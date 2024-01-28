import usePeerDataReceived from "$hooks/useDataReceived";
import { Player, StoreData } from "$store/types"
import { Sprite, useTick } from "@pixi/react";
import { useState } from "react";
import { useSelector } from "react-redux";

const RaceCar = ({player}:{player:Player}) => {
  const [position, setPosition] = useState(()=>({x:100, y:100, angle:0, velocity:0}));

  const [movementValues, setMovementValues] = useState({targetVelocity:0, angle:0})

  const playerState = useSelector((state:StoreData)=>state.players.find((p)=>p.id == player.id));
  console.log(playerState)
  usePeerDataReceived<{playerId:string, value:{targetVelocity:number, angle:number}, action:string}>((data)=>{
    if(data.payload.playerId !== player.id) return;
    setMovementValues({targetVelocity: data.payload.value.targetVelocity, angle: data.payload.value.angle})
  }, 'RACE'+player.id)

  useTick((delta:number) => {
    setPosition((prev)=>{
        if(!position || !movementValues) return prev;
        //set the velocity to ease in towards the target velocity using delta
        const nextVelocity = Math.min(position.velocity + (movementValues.targetVelocity - position.velocity) * delta, movementValues.targetVelocity);
        //set the angle to ease in towards the target angle using delta
        const nextAngle = movementValues.angle? position.angle + movementValues.angle * delta : position.angle;
        //set the x and y positions based on the velocity and angle
        const nextX = position.x + Math.cos(nextAngle) * nextVelocity * delta;
        const nextY = position.y + Math.sin(nextAngle) * nextVelocity * delta;
        //set the next position
        return {x: nextX, y: nextY, angle: nextAngle, velocity: nextVelocity};
    });
    // setPlayerMovementValues(newMovementValues);
  })
  return (<Sprite image={player.image} x={position.x} y={position.y} rotation={position.angle} width={50} height={50} anchor={0.5} />)
}

export default RaceCar;