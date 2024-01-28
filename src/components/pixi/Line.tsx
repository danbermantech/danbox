import { Graphics, Color } from 'pixi.js';
import { PixiComponent } from '@pixi/react';
import { BoardSpaceConfig } from '$store/types';

type LineProps = {children?:React.ReactNode, from: BoardSpaceConfig, to: BoardSpaceConfig, color:string, width:number }

const Line = PixiComponent('Line', {
  create: (props:LineProps) => {
    const graphics = new Graphics();
    const color = new Color(props.color)

    graphics.beginFill(color)
    graphics.lineStyle(props.width, color, 1);
    // move the pointer 20% of the way between the from.x,from.y and to.x,to.y
    // graphics.moveTo(props.from.x + (props.to.x - props.from.x) * 0.4, props.from.y + (props.to.y - props.from.y) * 0.4);

    // graphics.moveTo(props.from.x, props.from.y);
    //stop the pointer 80% of the way between the from.x,from.y and to.x,to.y
    // graphics.lineTo(props.from.x + (props.to.x - props.from.x) * 0.8, props.from.y + (props.to.y - props.from.y) * 0.6);
    // graphics.lineTo(props.to.x, props.to.y);
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
    graphics.lineStyle(props.width, '#ffffff', 1);

    const angle = Math.atan2(props.to.y - props.from.y, props.to.x - props.from.x);
    const offset = 20

    console.log(angle, props.from, props.to, {cos: Math.cos(angle *.8), sin: Math.sin(angle*.8)})

    graphics.moveTo((props.from.x + Math.cos(angle)*(props.from.width + offset*2)), (props.from.y + Math.sin(angle )*(props.from.width + offset * 2)));
    graphics.lineTo((props.from.x + (Math.cos(angle *.8) || -0.5)*(props.from.width + offset)), (props.from.y + (Math.sin(angle * .8) || -0.5) *(props.from.width + offset)));
    graphics.lineTo((props.to.x - Math.cos(angle)*(props.to.width + offset)), (props.to.y - Math.sin(angle)*(props.to.width + offset)));
    graphics.lineTo((props.from.x + (Math.cos(angle *1.2) || 0.5)*(props.from.width + offset)), (props.from.y + (Math.sin(angle * 1.2) || 0.5)*(props.from.width + offset)));
    graphics.lineTo((props.from.x + Math.cos(angle)*(props.from.width + offset * 2)), (props.from.y + Math.sin(angle )*(props.from.width + offset * 2)));

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