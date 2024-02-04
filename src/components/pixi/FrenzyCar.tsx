import useBoardDimensions from "$hooks/useBoardDimensions";
import usePeerDataReceived from "$hooks/useDataReceived";
import { Player, StoreData } from "$store/types"
import { Sprite, useTick } from "@pixi/react";
import { useState } from "react";
import { useSelector } from "react-redux";

const FrenzyCar = (
  {
    player, 
    points, 
    gold, 
    boundaries,
    onPointCollected,
    onGoldCollected,
  }:{
    player:Player, 
    points:{x:number, y:number,id:string}[], 
    gold:{x:number,y:number, id:string}[], 
    boundaries: {minX:number, minY:number,maxX:number, maxY:number},
    onPointCollected: (playerId:string, pointId:string)=>void,
    onGoldCollected: (playerId:string, goldId:string)=>void,
  }) => {

  const {boardWidth, boardHeight} = useBoardDimensions();

  const [position, setPosition] = useState(()=>({x:0.5, y:0.5, angle:0, velocity:0}));

  const [movementValues, setMovementValues] = useState({targetVelocity:0, angle:0})

  const playerState = useSelector((state:StoreData)=>state.players.find((p)=>p.id == player.id));
  console.log(playerState)
  usePeerDataReceived<{playerId:string, value:{targetVelocity:number, angle:number}, action:string}>((data)=>{
    if(data.payload.playerId !== player.id) return;
    setMovementValues({targetVelocity: data.payload.value.targetVelocity, angle: data.payload.value.angle})
  }, 'FRENZY'+player.id)

  useTick((delta:number) => {
    setPosition((prev)=>{
      if(!position || !movementValues) return prev;
      //set the velocity to ease in towards the target velocity using delta
      const nextVelocity = Math.min(position.velocity + (movementValues.targetVelocity - position.velocity) * delta, movementValues.targetVelocity);
      //set the angle to ease in towards the target angle using delta
      const nextAngle = movementValues.angle? position.angle - movementValues.angle * delta : position.angle;
      //set the x and y positions based on the velocity and angle
      const nextX = Math.max(Math.min(position.x + Math.cos(nextAngle) * nextVelocity * delta, boundaries.maxX), boundaries.minX);
      const nextY = Math.max(Math.min(position.y + Math.sin(nextAngle) * nextVelocity * delta, boundaries.maxY), boundaries.minY);

      return {x: nextX, y: nextY, angle: nextAngle, velocity: nextVelocity};
    });

    points.forEach((point)=>{
      if(Math.abs(position.x - point.x) < 0.05 && Math.abs(position.y - point.y) < 0.05){
        console.log('point collected')
        onPointCollected(player.id, point.id);
        return;
      }
    })

    gold.forEach((point)=>{
      if(Math.abs(position.x - point.x) < 0.05 && Math.abs(position.y - point.y) <0.05){
        console.log('point collected')
        onGoldCollected(player.id, point.id);
        return;
      }
    })
  })
  return (<Sprite image={player.image} x={position.x *boardWidth} y={position.y *boardHeight} rotation={position.angle} width={100} height={100} anchor={0.5} />)
}

export default FrenzyCar;