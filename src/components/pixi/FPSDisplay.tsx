import { Text, useTick } from '@pixi/react';
import { TextStyle } from 'pixi.js';
import { useRef } from 'react';

export const FPSDisplay = () => {
  const lastTime = useRef(performance.now());
  const frameCount = useRef(0);
  const fps = useRef(0);
  useTick(() => {
    frameCount.current++;
    const now = performance.now();
    if (now - lastTime.current >= 1000) {
      fps.current = frameCount.current;
      frameCount.current = 0;
      lastTime.current = now;
    }
  });
  return (
    <Text
      text={`${fps.current} FPS`}
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

export default FPSDisplay;
