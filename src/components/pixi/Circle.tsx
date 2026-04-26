import { Graphics, Color } from 'pixi.js';
import { PixiComponent } from '@pixi/react';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';

export type CircleProps = { radius: number; x: number; y: number; fill: string; stroke: string; strokeWidth: number };

const shadowFilter = new DropShadowFilter({ offset: { x: 6, y: 6 }, blur: 10, alpha: 0.5, color: 0x000000 });

type BatchProps = { circles: CircleProps[] };

const Circles = PixiComponent('Circles', {
  create: () => {
    const g = new Graphics();
    g.filters = [shadowFilter];
    return g;
  },
  applyProps: (g, _, props: BatchProps) => {
    g.clear();
    for (const c of props.circles) {
      g.beginFill(new Color(c.fill));
      g.lineStyle(c.strokeWidth, new Color(c.stroke), 1);
      g.drawCircle(c.x, c.y, c.radius);
      g.endFill();
    }
  },
  config: { destroy: true, destroyChildren: true },
});

export default Circles;