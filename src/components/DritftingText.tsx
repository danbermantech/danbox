import { useEffect, useRef } from "react";

type DriftingTextProps = {
  text: string;
  amplitude?: number;
  speed?: number;
  rotation?: number; // max degrees of rotation
  className?: string;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function hash(n: number) {
  const x = Math.sin(n) * 43758.5453;
  return x - Math.floor(x);
}

function noise1D(x: number) {
  const i0 = Math.floor(x);
  const i1 = i0 + 1;

  const t = x - i0;
  const v0 = hash(i0);
  const v1 = hash(i1);

  return lerp(v0, v1, smoothstep(t));
}

function fbm(x: number) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;

  for (let i = 0; i < 3; i++) {
    value += noise1D(x * frequency) * amplitude;
    frequency *= 2;
    amplitude *= 0.5;
  }

  return value;
}

export default function DriftingText({
  text,
  amplitude = 4,
  speed = 1,
  rotation = 6,
  className,
}: DriftingTextProps) {
  const spansRef = useRef<HTMLSpanElement[]>([]);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const nodes = spansRef.current;

    const seeds = nodes.map(() => ({
      xOffset: Math.random() * 1000,
      yOffset: Math.random() * 1000,
      rOffset: Math.random() * 1000,
    }));

    const start = performance.now();

    const loop = (t: number) => {
      const time = ((t - start) / 1000) * speed;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const s = seeds[i];

        const nx = fbm(time + s.xOffset);
        const ny = fbm(time + s.yOffset);
        const nr = fbm(time + s.rOffset);

        const x = (nx * 2 - 1) * amplitude;
        const y = (ny * 2 - 1) * amplitude;
        const r = (nr * 2 - 1) * rotation;

        node.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current !== null) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [text, amplitude, speed, rotation]);

  return (
    <span className={className} style={{ display: "inline-block", whiteSpace: "pre" }}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          ref={(el) => {
            if (el) spansRef.current[i] = el;
          }}
          style={{
            display: "inline-block",
            willChange: "transform",
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}