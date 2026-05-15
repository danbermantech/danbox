import { useRef, useState } from 'react';
import { tilingLava2 } from '$assets/images';
import { Text, TilingSprite, useTick } from '@pixi/react';
import {
  BLEND_MODES,
  TilingSprite as PixiTilingSprite,
  TextStyle,
  Transform,
} from 'pixi.js';
import useBoardDimensions from '$hooks/useBoardDimensions';

function hslToInt(h: number, s: number, l: number): number {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return (
    (Math.round(f(0) * 255) << 16) |
    (Math.round(f(8) * 255) << 8) |
    Math.round(f(4) * 255)
  );
}

const TiledLava = ({
  alpha,
  rate,
}: {
  alpha?: number;
  rate: { x: number; y: number };
}) => {
  const { boardWidth, boardHeight } = useBoardDimensions();
  const tileRef = useRef<PixiTilingSprite>(null);
  const initialPosition = useRef({
    x: Math.random() * 1024,
    y: Math.random() * 1024,
  });
  const tintTime = useRef(Math.random() * 1200); // starts with offset
  const tintRate = useRef(Math.random() * 800 + 400); // how long tint cycles take to return to original color

  useTick((delta: number) => {
    const tile = tileRef.current;
    if (!tile) return;
    tile.tilePosition.x += rate.x * delta;
    tile.tilePosition.y += rate.y * delta;
    tintTime.current += delta;
    tile.tint = hslToInt(
      ((tintTime.current / tintRate.current) % 1) * 360,
      1,
      0.5,
    );
    transform.rotation = Math.sin(tintTime.current / tintRate.current / 10);
    tile.tileScale = {
      x: 1 + 0.05 * Math.sin(tintTime.current / tintRate.current / 10),
      y: 4 + 0.2 * Math.cos(tintTime.current / tintRate.current / 10),
    };
  });

  const transform = new Transform();
  return (
    <TilingSprite
      ref={tileRef}
      image={tilingLava2}
      position={{ x: 0, y: 0 }}
      tilePosition={initialPosition.current}
      tileTransform={transform}
      width={boardWidth * 2}
      height={boardHeight * 2}
      alpha={alpha ?? 1}
      blendMode={
        [
          BLEND_MODES.ADD,
          BLEND_MODES.DIFFERENCE,
          // BLEND_MODES.MULTIPLY,
          BLEND_MODES.NORMAL,
          BLEND_MODES.XOR,
        ][Math.floor(Math.random() * 4)]
      }
    />
  );
};
const FPSDisplay = () => {
  const [fps, setFps] = useState(0);
  const lastTime = useRef(performance.now());
  const frameCount = useRef(0);
  useTick(() => {
    frameCount.current++;
    const now = performance.now();
    if (now - lastTime.current >= 1000) {
      setFps(frameCount.current);
      frameCount.current = 0;
      lastTime.current = now;
    }
  });
  return (
    <Text
      text={`${fps} FPS`}
      style={
        new TextStyle({
          align: 'left',
          fontFamily: '"Source Code Pro", monospace',
          fontSize: 24,
          fill: '#ffffff',
          stroke: '#000000',
          strokeThickness: 4,
        })
      }
      x={10}
      y={10}
    />
  );
};

const ShiftingLavaBackground = () => {
  return (
    <>
      <TiledLava alpha={1} rate={{ x: -0.01, y: -0.6 }} />
      <TiledLava alpha={0.4} rate={{ x: 0.5, y: 0.5 }} />
      <TiledLava alpha={0.3} rate={{ x: -0.1, y: 0.4 }} />
      <TiledLava alpha={0.2} rate={{ x: 0.4, y: -0.2 }} />
      <TiledLava alpha={0.1} rate={{ x: -0.3, y: -0.3 }} />
      <FPSDisplay />
    </>
  );
};

export default ShiftingLavaBackground;
