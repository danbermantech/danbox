import { Graphics } from '@pixi/react';
import { BoardSpaceConfig } from '$store/types';
import useBoardDimensions from '$hooks/useBoardDimensions';

type LineProps = {children?:React.ReactNode, from: BoardSpaceConfig, to: BoardSpaceConfig, color:string, width:number }

const Line2 = (props:LineProps) => {
  const {boardWidth, boardHeight} = useBoardDimensions();
  return <Graphics 
  draw={(g) => {
    g.clear();
    g.beginFill(props.color)
    g.lineStyle(props.width, '#ffffff', 1);

    const angle = Math.atan2(props.to.y - props.from.y, props.to.x - props.from.x);
    const offset = 0.02
    const angleOffset = 15 * (Math.PI/180)
    // console.log(angle, props.from, props.to, {cos: Math.cos(angle *.8), sin: Math.sin(angle*.8)})

    g.moveTo(
      (boardWidth  * (props.from.x + Math.cos(angle)*(props.from.width + offset*2))), 
      (boardHeight * (props.from.y + Math.sin(angle )*(props.from.width + offset * 2))));
    g.lineTo(
      (boardWidth  * (props.from.x + (Math.cos(angle - angleOffset))*(props.from.width + offset))),
      (boardHeight * (props.from.y + (Math.sin(angle - angleOffset)) *(props.from.width + offset))));
    g.lineTo(
      (boardWidth  * (props.to.x - Math.cos(angle)*(props.to.width + offset))), 
      (boardHeight * (props.to.y - Math.sin(angle)*(props.to.width + offset))));
    g.lineTo(
      (boardWidth  * (props.from.x + (Math.cos(angle + angleOffset))*(props.from.width + offset))), 
      (boardHeight * (props.from.y + (Math.sin(angle + angleOffset))*(props.from.width + offset))));
    g.lineTo(
      (boardWidth  * (props.from.x + Math.cos(angle)*(props.from.width + offset * 2))), 
      (boardHeight * (props.from.y + Math.sin(angle )*(props.from.width + offset * 2))));

    g.closePath();
    g.endFill();  
  }} 
  />
}

export default Line2