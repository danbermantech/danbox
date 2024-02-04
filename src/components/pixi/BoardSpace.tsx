import { StoreData } from "$store/types";
import { Fragment } from "react";
import { useSelector } from "react-redux"
import Circle from '$components/pixi/Circle';
import { Text } from "@pixi/react";
import { TextStyle } from "pixi.js";
import useBoardDimensions from "$hooks/useBoardDimensions";

const BoardSpace = ({id}:{id:string}) =>{
  const {boardWidth, boardHeight} = useBoardDimensions();
  const location = useSelector((state:StoreData)=>state.game.board.find((l)=>l.id == id));
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
            fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
            fontSize: 100,
            fontWeight: '400',
            fill: ['#880000', '#000000'], // gradient
            stroke: '#880000',
            strokeThickness: 5,
            letterSpacing: 20,
            dropShadow: true,
            dropShadowColor: '#FF0000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,})} 
            width={boardWidth * location.width}
            height={boardHeight * location.width*.8} 
            x={boardWidth * location.x} y={boardHeight * (location.y + location.width * .5)} 
            anchor={{x:0.5, y: 0}} 
          />
        </Fragment>
)
}

export default BoardSpace;