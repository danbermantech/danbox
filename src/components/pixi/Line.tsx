import { Graphics, Color } from 'pixi.js';
import { PixiComponent } from '@pixi/react';

type LineProps = {children?:React.ReactNode, x1:number, x2:number, y1:number, y2:number, color:string, width:number }

const Line = PixiComponent('Line', {
  create: (props:LineProps) => {
    const graphics = new Graphics();
    const color = new Color(props.color)

    graphics.beginFill(color)
    graphics.lineStyle(props.width, color, 1);
    graphics.moveTo(props.x1, props.y1);
    graphics.lineTo(props.x2, props.y2);
    graphics.closePath();
    graphics.endFill();
    return graphics;
  },
  applyProps: (graphics, _, props) => {
    // props changed
    // apply logic to the instance
    const color = new Color(props.color)
    graphics.clear();
    graphics.beginFill(color)
    graphics.lineStyle(props.width, color, 1);
    graphics.moveTo(props.x1, props.y1);
    graphics.lineTo(props.x2, props.y2);
    graphics.closePath();
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