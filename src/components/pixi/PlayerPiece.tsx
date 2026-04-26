import { Container, Sprite, Text, useTick,  } from "@pixi/react";
import { TextStyle } from "pixi.js";
import type { Player } from "$store/types";
import { useEffect, useRef, useState } from "react";
import useBoardDimensions from "$hooks/useBoardDimensions";
import { useAppSelector } from "$store/hooks";

type Point = { x: number; y: number };

const PATH_BUFFER = 0.035;

function closestPointOnSegment(p: Point, a: Point, b: Point): { point: Point; t: number } {
  const dx = b.x - a.x, dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return { point: a, t: 0 };
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
  return { point: { x: a.x + t * dx, y: a.y + t * dy }, t };
}

function computeWaypoints(from: Point, to: Point, spaces: { x: number; y: number; width: number; id: string }[], excludeIds: Set<string>, depth = 0): Point[] {
  if (depth > 10) return [];
  let firstT = Infinity, firstSpace: typeof spaces[0] | null = null, firstP: Point | null = null;
  for (const space of spaces) {
    if (excludeIds.has(space.id)) continue;
    const { point, t } = closestPointOnSegment({ x: space.x, y: space.y }, from, to);
    const dist = Math.hypot(space.x - point.x, space.y - point.y);
    if (dist < space.width + PATH_BUFFER && t > 0.001 && t < 0.999 && t < firstT) {
      firstT = t; firstSpace = space; firstP = point;
    }
  }
  if (!firstSpace || !firstP) return [];
  const distPC = Math.hypot(firstSpace.x - firstP.x, firstSpace.y - firstP.y);
  const θ = distPC < 1e-6
    ? Math.atan2(to.y - from.y, to.x - from.x) - Math.PI / 2
    : Math.atan2(firstSpace.y - firstP.y, firstSpace.x - firstP.x);
  const avoidDist = firstSpace.width + PATH_BUFFER * 2;
  const waypoint: Point = { x: firstSpace.x + Math.cos(θ) * avoidDist, y: firstSpace.y + Math.sin(θ) * avoidDist };
  const nextExclude = new Set(excludeIds);
  nextExclude.add(firstSpace.id);
  return [...computeWaypoints(from, waypoint, spaces, nextExclude, depth + 1), waypoint, ...computeWaypoints(waypoint, to, spaces, nextExclude, depth + 1)];
}

/** Evaluate Catmull-Rom spline at parameter t (0 = first point, n-1 = last point). */
function catmullRomPoint(pts: Point[], t: number): Point {
  const n = pts.length;
  if (n === 0) return { x: 0, y: 0 };
  if (n === 1) return pts[0];
  const i = Math.min(Math.floor(t), n - 2);
  const lt = t - i;
  const lt2 = lt * lt, lt3 = lt2 * lt;
  const p0 = pts[Math.max(0, i - 1)];
  const p1 = pts[i];
  const p2 = pts[i + 1];
  const p3 = pts[Math.min(n - 1, i + 2)];
  return {
    x: 0.5 * ((2*p1.x) + (-p0.x+p2.x)*lt + (2*p0.x-5*p1.x+4*p2.x-p3.x)*lt2 + (-p0.x+3*p1.x-3*p2.x+p3.x)*lt3),
    y: 0.5 * ((2*p1.y) + (-p0.y+p2.y)*lt + (2*p0.y-5*p1.y+4*p2.y-p3.y)*lt2 + (-p0.y+3*p1.y-3*p2.y+p3.y)*lt3),
  };
}

const PlayerPiece = ({id}:{id:string}) => {

  const {boardWidth, boardHeight} = useBoardDimensions();
  const player = useAppSelector((state)=>state.players.find((p)=>p.id == id)) as Player;
  const location = useAppSelector((state)=>state.board[player.spaceId]);
  const prevLocation = useAppSelector((state)=>state.board[player.previousSpaceId]);
  const board = useAppSelector((state)=>state.board);
  const playersOnSpace = useAppSelector((state) =>
    state.players
      .filter((p) => p.spaceId === player.spaceId)
      .map((p) => p.id)
      .sort()
  );
  const playerIndex = playersOnSpace.indexOf(id);
  const totalOnSpace = playersOnSpace.length;
  const currentX = location?.x ?? 0.5;
  const currentY = location?.y ?? 0.5;
  const currentWidth = location?.width ?? 0.06;

  const [destination, setDestination] = useState({x: currentX, y: currentY});
  useEffect(()=>{
    if (!location) {
      setDestination({ x: currentX, y: currentY });
      return;
    }
    if (totalOnSpace <= 1) {
      setDestination({
        x: location.x + Math.random() * location.width - location.width / 2,
        y: location.y + Math.random() * location.width * 0.5 - location.width / 2,
      });
    } else {
      const angle = (2 * Math.PI * playerIndex) / totalOnSpace;
      const radius = location.width ;
      setDestination({
        x: location.x + Math.cos(angle) * radius,
        y: location.y + Math.sin(angle) * radius * 0.5,
      });
    }
  },[location, playerIndex, totalOnSpace, currentX, currentY])

  // Travel path: computed when location changes, followed as a smooth Catmull-Rom spline
  const travelPath = useRef<Point[]>([]);
  const pathT = useRef<number>(0);
  // Tracks where the piece actually was when this move started (updated on arrival)
  const arrivedAt = useRef<Point>({ x: location.x, y: location.y });

  useEffect(() => {
    if (!location) return;
    const from = arrivedAt.current;
    const to: Point = { x: location.x, y: location.y };
    if (Math.abs(from.x - to.x) < 1e-6 && Math.abs(from.y - to.y) < 1e-6) return;
    const excludeIds = new Set([location.id, ...(prevLocation ? [prevLocation.id] : [])]);
    const waypoints = computeWaypoints(from, to, Object.values(board), excludeIds);
    travelPath.current = [from, ...waypoints, to];
    pathT.current = 0;
  }, [location, prevLocation, board]);

  const [playerLocation, setPlayerLocation] = useState({x: currentX, y: currentY});

  useTick((delta:number) => {
    const path = travelPath.current;
    const maxT = path.length - 1;

    // Follow smooth spline through travel path
    if (path.length > 1 && pathT.current < maxT) {
      const speed = 0.04; // t-units per tick (tune this for visual speed)
      pathT.current = Math.min(pathT.current + speed * delta, maxT);
      const pos = catmullRomPoint(path, pathT.current);
      setPlayerLocation(pos);
      // Mark arrival when spline completes
      if (pathT.current >= maxT) {
        arrivedAt.current = path[path.length - 1];
      }
      return;
    }

    // Settle into final destination within the space
    if(Math.abs(playerLocation.x - destination.x) <= 0.01 && Math.abs(playerLocation.y - destination.y) <= 0.01) return setPlayerLocation({x: destination.x, y: destination.y});
    const xDiff = destination.x - playerLocation.x;
    const yDiff = destination.y - playerLocation.y;
    const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    const speed = 0.005;
    setPlayerLocation({x: playerLocation.x + xDiff / distance * speed * delta, y: playerLocation.y + yDiff / distance * speed * delta});
  })

  return (
    <Container
      x={boardWidth * playerLocation.x}
      y={boardHeight * (playerLocation.y - currentWidth * .5)}
      zIndex={100}
      key={player.id}
    >
      <Sprite
      anchor={0.5}
      x={0}
      y={0}
      width={Math.max(Math.min(32, boardWidth * 0.1), 72)}
      height={Math.max(Math.min(32, boardWidth * 0.1), 72)}
      image={player.image}
      />
      <Text text={player.name.toLocaleUpperCase()} 
        style={new TextStyle({align: 'center',
          fontFamily: 'Titan One',
          fontSize: 10,
          fontWeight: '800',
          stroke: '#ffffff',
          strokeThickness: 8,
          letterSpacing: 0,
          dropShadowAngle: Math.PI / 6,
          dropShadowDistance: 6,
          wordWrap: true,
          wordWrapWidth: 440,
        })}
        x={0} 
        y={boardWidth * 0.01} 
        anchor={{x:0.5, y: 0./5}} 
        />
    </Container>
  )
}




export default PlayerPiece