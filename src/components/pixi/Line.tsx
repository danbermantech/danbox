import { Graphics, Color } from 'pixi.js';
import { PixiComponent } from '@pixi/react';
import { BoardSpaceConfig } from '$store/types';

type LineProps = {children?:React.ReactNode, from: BoardSpaceConfig, to: BoardSpaceConfig, color:string, width:number }

const Line = PixiComponent('Line', {
  create: (props:LineProps) => {
    const graphics = new Graphics();
    const color = new Color(props.color)
    graphics.clear();
    graphics.beginFill(color)
    graphics.lineStyle(props.width, '#ffffff', 1);

    const angle = Math.atan2(props.to.y - props.from.y, props.to.x - props.from.x);
    const offset = 20
    const angleOffset = 15 * (Math.PI/180)
    console.log(angle, props.from, props.to, {cos: Math.cos(angle *.8), sin: Math.sin(angle*.8)})

    graphics.moveTo((props.from.x + Math.cos(angle)*(props.from.width + offset*2)), (props.from.y + Math.sin(angle )*(props.from.width + offset * 2)));
    graphics.lineTo((props.from.x + (Math.cos(angle - angleOffset) || -0.5)*(props.from.width + offset)), (props.from.y + (Math.sin(angle - angleOffset) || -0.5) *(props.from.width + offset)));
    graphics.lineTo((props.to.x - Math.cos(angle)*(props.to.width + offset)), (props.to.y - Math.sin(angle)*(props.to.width + offset)));
    graphics.lineTo((props.from.x + (Math.cos(angle + angleOffset) || 0.5)*(props.from.width + offset)), (props.from.y + (Math.sin(angle + angleOffset) || 0.5)*(props.from.width + offset)));
    graphics.lineTo((props.from.x + Math.cos(angle)*(props.from.width + offset * 2)), (props.from.y + Math.sin(angle )*(props.from.width + offset * 2)));

    graphics.closePath();
    graphics.endFill();
    return graphics
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
    const angleOffset = 15 * (Math.PI/180)
    console.log(angle, props.from, props.to, {cos: Math.cos(angle *.8), sin: Math.sin(angle*.8)})

    graphics.moveTo((props.from.x + Math.cos(angle)*(props.from.width + offset*2)), (props.from.y + Math.sin(angle )*(props.from.width + offset * 2)));
    graphics.lineTo((props.from.x + (Math.cos(angle - angleOffset) || -0.5)*(props.from.width + offset)), (props.from.y + (Math.sin(angle - angleOffset) || -0.5) *(props.from.width + offset)));
    graphics.lineTo((props.to.x - Math.cos(angle)*(props.to.width + offset)), (props.to.y - Math.sin(angle)*(props.to.width + offset)));
    graphics.lineTo((props.from.x + (Math.cos(angle + angleOffset) || 0.5)*(props.from.width + offset)), (props.from.y + (Math.sin(angle + angleOffset) || 0.5)*(props.from.width + offset)));
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