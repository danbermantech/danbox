import { Graphics, Color } from 'pixi.js';
import { PixiComponent } from '@pixi/react';

type LineProps = { radius:number, x:number, y:number, fill:string, stroke:string, strokeWidth: number,}

const Line = PixiComponent('Circle', {
  create: (props:LineProps) => {
    const graphics = new Graphics();
    const stroke = new Color(props.stroke)
    const fill = new Color(props.fill)
    graphics.beginFill(fill)
    graphics.lineStyle(props.strokeWidth, stroke, 1);
    graphics.drawCircle(props.x, props.y, props.radius);
    graphics.endFill();
    return graphics;
  },
  applyProps: (graphics, _, props) => {
    // props changed
    // apply logic to the instance
    graphics.clear();
    const stroke = new Color(props.stroke)
    const fill = new Color(props.fill)
    graphics.beginFill(fill)
    graphics.lineStyle(props.strokeWidth, stroke, 1);
    graphics.drawCircle(props.x, props.y, props.radius);
    graphics.endFill();
    graphics.endFill();
  },
  config: {
    // destroy instance on unmount?
    // default true
    destroy: true,

    /// destroy its children on unmount?
    // default true
    destroyChildren: true,
  },
});

export default Line