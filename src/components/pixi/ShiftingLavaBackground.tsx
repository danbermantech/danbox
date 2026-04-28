import { useRef } from "react";
import { tilingLava } from "$assets/images";
import { TilingSprite, useTick } from "@pixi/react";
import {
  TilingSprite as PixiTilingSprite,
} from "pixi.js";
import useBoardDimensions from "$hooks/useBoardDimensions";

function hslToInt(h: number, s: number, l: number): number {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return (Math.round(f(0) * 255) << 16) | (Math.round(f(8) * 255) << 8) | Math.round(f(4) * 255);
}

const TiledLava = ({alpha, rate}:{alpha?:number, rate:{x:number, y:number}}) => {
  const { boardWidth, boardHeight } = useBoardDimensions();
  const tileRef = useRef<PixiTilingSprite>(null);
  const initialPosition = useRef({x: Math.random() * 1024, y: Math.random() * 1024});
  const tintTime = useRef(Math.random() * 1200);
  const tintRate = useRef(Math.random() * 800 + 400)
  useTick((delta: number) => {
    const tile = tileRef.current;
    if (!tile) return;
    tile.tilePosition.x += rate.x * delta;
    tile.tilePosition.y += rate.y * delta;
    tintTime.current += delta;
    tile.tint = hslToInt(((tintTime.current / tintRate.current) % 1) * 360, 1, 0.5);
  });
  return (
    <TilingSprite
      ref={tileRef}
      image={tilingLava}
      position={{ x: 0, y: 0 }}
      tilePosition={initialPosition.current}
      width={boardWidth * 2}
      height={boardHeight * 2}
      alpha={alpha ?? 1}
    />
  );
};

const ShiftingLavaBackground = () => {
  return (
    <>
      <TiledLava alpha={0.4} rate={{x:0.5, y:0.5}} />
      <TiledLava alpha={0.3} rate={{x:-0.1, y:0.4}} />
      <TiledLava alpha={0.2} rate={{x:0.4, y:-0.2}} />
      <TiledLava alpha={0.1} rate={{x:-0.3, y:-0.3}} />
    </>
  );
};

export default ShiftingLavaBackground;