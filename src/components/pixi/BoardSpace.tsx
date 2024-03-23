import { StoreData } from "$store/types";
import { Fragment } from "react";
import { useSelector } from "react-redux"
import Circle from '$components/pixi/Circle';
import { Text } from "@pixi/react";
import { TextStyle } from "pixi.js";
import useBoardDimensions from "$hooks/useBoardDimensions";

const BoardSpace = ({id}:{id:string}) =>{
  const {boardWidth, boardHeight} = useBoardDimensions();
  const location = useSelector((state:StoreData)=>state.board[id]);
  if(!location) return null;
  return(
  <Fragment key={location.id}>
        <Circle
          fill={location.color}
          stroke={location.color}
          x={location.x * boardWidth}
          y={location.y * boardHeight}
          radius={location.width * boardWidth}
          strokeWidth={10}
          />
          
          <Text
            text={location.label.toLocaleUpperCase()} 
            style={new TextStyle({align: 'center',
            fontFamily: '"Titan One", "Source Sans Pro", Helvetica, sans-serif',
            fontSize: 50,
            fontWeight: '400',
            fill:['#ffffff', '#cccccc'],
            // fillGradientType: TEXT_GRADIENT.LINEAR_VERTICAL,
            // fill: ['#ff0000', '#00ff00', '#0000ff','#ff0000', '#00ff00', '#0000ff','#ff0000', '#00ff00', '#0000ff','#ff0000', '#00ff00', '#0000ff','#ff0000', '#00ff00', '#0000ff',], // gradient
            stroke: '#000000',
            strokeThickness: 8,
            letterSpacing: 1,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,})} 
            width={boardWidth * location.width * 1.2}
            height={boardHeight * location.width} 
            x={boardWidth * location.x} y={boardHeight * (location.y + location.width * .5)} 
            anchor={{x:0.5, y: 0}} 
          />
        </Fragment>
)
}

export default BoardSpace;