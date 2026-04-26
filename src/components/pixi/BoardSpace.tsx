import { StoreData } from "$store/types";
import { Fragment } from "react";
import { useSelector } from "react-redux"
import { Text } from "@pixi/react";
import { TextStyle } from "pixi.js";
import useBoardDimensions from "$hooks/useBoardDimensions";

const BoardSpace = ({id}:{id:string}) =>{
  const {boardWidth, boardHeight} = useBoardDimensions();
  const location = useSelector((state:StoreData)=>state.board[id]);
  const isOccupied = useSelector((state:StoreData)=>state.players.some(p=>p.spaceId===id));
  const scale = isOccupied ? 1 : 0.8;
  if(!location) return null;
  return(
  <Fragment key={location.id}>
          <Text
            text={location.label.toLocaleUpperCase()} 
            style={new TextStyle({align: 'center',
            fontFamily: '"Titan One", "Source Sans Pro", Helvetica, sans-serif',
            fontSize: 50,
            fontWeight: '400',
            fill:['#ffffff', '#cccccc'],
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
            width={boardWidth * location.width * 1.2 * scale}
            height={boardHeight * location.width * scale} 
            x={boardWidth * location.x} y={boardHeight * (location.y + location.width * .5)} 
            anchor={{x:0.5, y: 0}} 
          />
        </Fragment>
)
}

export default BoardSpace;