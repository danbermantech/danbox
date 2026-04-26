import { Graphics } from '@pixi/react';
import { BoardSpaceConfig } from '$store/types';
import useBoardDimensions from '$hooks/useBoardDimensions';

type Point = { x: number; y: number };
type LineProps = { children?: React.ReactNode; from: BoardSpaceConfig; to: BoardSpaceConfig; color: string; width: number; spaces?: BoardSpaceConfig[] }

const BUFFER = 0.035;

/** Returns the closest point on segment [a,b] to point p, and the parametric t in [0,1]. */
function closestPointOnSegment(p: Point, a: Point, b: Point): { point: Point; t: number } {
  const dx = b.x - a.x, dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return { point: a, t: 0 };
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
  return { point: { x: a.x + t * dx, y: a.y + t * dy }, t };
}

/**
 * Recursively computes waypoints that route around spaces intersecting the segment from→to.
 */
function computeWaypoints(from: Point, to: Point, spaces: BoardSpaceConfig[], excludeIds: Set<string>, depth = 0): Point[] {
  if (depth > 10) return [];

  let firstT = Infinity;
  let firstSpace: BoardSpaceConfig | null = null;
  let firstP: Point | null = null;

  for (const space of spaces) {
    if (excludeIds.has(space.id)) continue;
    const { point, t } = closestPointOnSegment({ x: space.x, y: space.y }, from, to);
    const dist = Math.hypot(space.x - point.x, space.y - point.y);
    if (dist < space.width + BUFFER && t > 0.001 && t < 0.999 && t < firstT) {
      firstT = t;
      firstSpace = space;
      firstP = point;
    }
  }

  if (!firstSpace || !firstP) return [];

  const distPC = Math.hypot(firstSpace.x - firstP.x, firstSpace.y - firstP.y);
  let θ: number;
  if (distPC < 1e-6) {
    θ = Math.atan2(to.y - from.y, to.x - from.x) - Math.PI / 2;
  } else {
    θ = Math.atan2(firstSpace.y - firstP.y, firstSpace.x - firstP.x);
  }

  const avoidDist = firstSpace.width + BUFFER * 2;
  const waypoint: Point = {
    x: firstSpace.x + Math.cos(θ) * avoidDist,
    y: firstSpace.y + Math.sin(θ) * avoidDist,
  };

  const nextExclude = new Set(excludeIds);
  nextExclude.add(firstSpace.id);

  return [
    ...computeWaypoints(from, waypoint, spaces, nextExclude, depth + 1),
    waypoint,
    ...computeWaypoints(waypoint, to, spaces, nextExclude, depth + 1),
  ];
}

/** Unit perpendicular at spine[i], derived from local tangent. */
function perpAt(pts: Point[], i: number): Point {
  const prev = pts[Math.max(0, i - 1)];
  const next = pts[Math.min(pts.length - 1, i + 1)];
  const dx = next.x - prev.x, dy = next.y - prev.y;
  const len = Math.hypot(dx, dy);
  if (len < 1e-9) return { x: 0, y: 1 };
  return { x: -dy / len, y: dx / len };
}

/** Converts a polyline into Catmull-Rom cubic bezier segments. */
function catmullRomToBezier(pts: Point[], tension = 0.8): Array<[Point, Point, Point]> {
  if (pts.length < 2) return [];
  return pts.slice(0, -1).map((_, i) => {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    return [
      { x: p1.x + (p2.x - p0.x) * tension / 3, y: p1.y + (p2.y - p0.y) * tension / 3 },
      { x: p2.x - (p3.x - p1.x) * tension / 3, y: p2.y - (p3.y - p1.y) * tension / 3 },
      p2,
    ] as [Point, Point, Point];
  });
}

const Line = (props: LineProps) => {
  const { boardWidth, boardHeight } = useBoardDimensions();

  return <Graphics draw={(g) => {
    g.clear();

    const toPixel = (p: Point) => ({ x: p.x * boardWidth, y: p.y * boardHeight });

    const initAngle = Math.atan2(props.to.y - props.from.y, props.to.x - props.from.x);
    const srcEdgeRough: Point = {
      x: props.from.x + Math.cos(initAngle) * (props.from.width + 0.005),
      y: props.from.y + Math.sin(initAngle) * (props.from.width + 0.005),
    };

    const excludeIds = new Set([props.from.id, props.to.id]);
    const midWaypoints = props.spaces
      ? computeWaypoints(srcEdgeRough, { x: props.to.x, y: props.to.y }, props.spaces, excludeIds)
      : [];

    // Recalculate srcEdge aimed at the first waypoint (or dest) for a more direct start
    const firstTarget = midWaypoints.length > 0 ? midWaypoints[0] : { x: props.to.x, y: props.to.y };
    const fromAngle = Math.atan2(firstTarget.y - props.from.y, firstTarget.x - props.from.x);
    const srcEdge: Point = {
      x: props.from.x + Math.cos(fromAngle) * (props.from.width + 0.005),
      y: props.from.y + Math.sin(fromAngle) * (props.from.width + 0.005),
    };

    const lastWp = midWaypoints.length > 0 ? midWaypoints[midWaypoints.length - 1] : srcEdge;
    const toAngle = Math.atan2(props.to.y - lastWp.y, props.to.x - lastWp.x);
    const dstEdge: Point = {
      x: props.to.x - Math.cos(toAngle) * (props.to.width + 0.005),
      y: props.to.y - Math.sin(toAngle) * (props.to.width + 0.005),
    };

    const spine: Point[] = [srcEdge, ...midWaypoints, dstEdge];
    const n = spine.length;

    // Half-width tapers from startHalf at index 0 down to 0 at the tip
    const startHalf = props.from.width * 0.45;
    const circleR = props.from.width + 0.005;

    // Angular spread so the two start points lie on the source circle edge
    const δ = Math.asin(Math.min(1, startHalf / circleR));

    // Build offset left and right spines; start points are on the source circle, tip converges to dstEdge
    const leftSpine: Point[] = spine.map((pt, i) => {
      if (i === 0) return { x: props.from.x + Math.cos(fromAngle - δ) * circleR, y: props.from.y + Math.sin(fromAngle - δ) * circleR };
      const t = i / (n - 1);
      const half = startHalf * (1 - t);
      const perp = perpAt(spine, i);
      return { x: pt.x - perp.x * half, y: pt.y - perp.y * half };
    });
    const rightSpine: Point[] = spine.map((pt, i) => {
      if (i === 0) return { x: props.from.x + Math.cos(fromAngle + δ) * circleR, y: props.from.y + Math.sin(fromAngle + δ) * circleR };
      const t = i / (n - 1);
      const half = startHalf * (1 - t);
      const perp = perpAt(spine, i);
      return { x: pt.x + perp.x * half, y: pt.y + perp.y * half };
    });

    // ── Filled arrow body: forward along left, backward along right ──────
    g.lineStyle(props.width * 0.3, props.to.color, 4);
    g.beginFill(props.from.color, 0.8);

    const startPx = toPixel(leftSpine[0]);
    g.moveTo(startPx.x, startPx.y);
    for (const [cp1, cp2, end] of catmullRomToBezier(leftSpine)) {
      const c1 = toPixel(cp1), c2 = toPixel(cp2), e = toPixel(end);
      g.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, e.x, e.y);
    }
    for (const [cp1, cp2, end] of catmullRomToBezier([...rightSpine].reverse())) {
      const c1 = toPixel(cp1), c2 = toPixel(cp2), e = toPixel(end);
      g.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, e.x, e.y);
    }
    g.closePath();
    g.endFill();
  }} />;
};

export default Line;