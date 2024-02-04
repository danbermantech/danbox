import useBoardDimensions from "$hooks/useBoardDimensions";
import usePeerDataReceived from "$hooks/useDataReceived";
import { useAppSelector } from "$store/hooks";
// import usePeerDataReceived from "$hooks/useDataReceived";
import { Player } from "$store/types"
import { Sprite, useTick } from "@pixi/react";
import { useState } from "react";
// import { useSelector } from "react-redux";

const PursuitCar = (
  {
    player,
    opponents,
    onMove,
    onOpponentCaptured,
  }:{
    player:Player, 
    opponents:{id:string, x:number, y:number, angle:number, velocity:number}[],
    onMove: (playerId:string, position:{x:number, y:number, angle:number, velocity:number})=>void,
    onOpponentCaptured: (playerId:string, opponentId:string)=>void,
  }) => {

  const {boardWidth, boardHeight} = useBoardDimensions();
  const [position, setPosition] = useState(()=>({x:Math.random()*0.8+0.1, y:Math.random()*0.8+0.1, angle:0, velocity:0}));
  const [movementValues, setMovementValues] = useState({targetVelocity:0, angle:0})

  const playerState = useAppSelector((state)=>state.players.find((p)=>p.id == player.id));
  // console.log(playerState)
  usePeerDataReceived<{playerId:string, value:{targetVelocity:number, angle:number}, action:string}>((data)=>{
    if(data.payload.playerId !== player.id) return;
    setMovementValues({targetVelocity: data.payload.value.targetVelocity, angle: data.payload.value.angle})
  }, 'PURSUIT'+player.id)


  useTick((delta:number) => {
    let captures;
    setPosition((prev)=>{
      if(!position || !movementValues) return prev;
      //set the velocity to ease in towards the target velocity using delta
      const nextVelocity = Math.min(position.velocity + (movementValues.targetVelocity - position.velocity) * delta, movementValues.targetVelocity);
      //set the angle to ease in towards the target angle using delta
      let nextAngle = movementValues.angle? (position.angle - movementValues.angle * delta)% (Math.PI*2) : position.angle;
      if(nextAngle < 0) nextAngle += Math.PI*2;
      //set the x and y positions based on the velocity and angle
      const nextX = Math.max(Math.min(position.x + Math.cos(nextAngle) * nextVelocity * delta, 0.9), 0.1);
      const nextY = Math.max(Math.min(position.y + Math.sin(nextAngle) * nextVelocity * delta, 0.9), 0.1);
      opponents.forEach((opponent)=>{
        //CHeck the angle between the two points
  
        const angle = Math.atan2(opponent.y - nextY ,  opponent.x - nextX);
  
        //Check the distance between the two points
  
        const distance = Math.sqrt((nextX - opponent.x)**2 + (nextY- opponent.y)**2);
        // console.log(angle, position.angle, opponent.angle, distance)
        // console.log(player.id, opponent.id, Math.abs(angle - nextAngle), Math.abs(position.angle - opponent.angle), distance);
        if(distance < 0.1){
          console.log('collision', player.id, opponent.id, distance);
        }
        if(Math.abs(angle - nextAngle) < Math.PI / 2)
          console.log('player angle', player.id, nextAngle)
        if(Math.abs(angle - opponent.angle) < Math.PI / 2)
          console.log('opponent angle', opponent.id, opponent.angle)
        if(Math.abs(nextAngle - opponent.angle) < Math.PI / 2)
          console.log('similar angle', player.id,opponent.id,)

        if(Math.abs(angle - nextAngle) < Math.PI/2 && Math.abs(nextAngle - opponent.angle) < Math.PI/2 && distance < 0.1){
          console.log(player.id, ' captured ', opponent.id, Math.abs(angle - nextAngle), Math.abs(nextAngle - opponent.angle), distance);
          captures = opponent.id
          // onOpponentCaptured(player.id, opponent.id);
        }
      })
      return {x: nextX, y: nextY, angle: nextAngle, velocity: nextVelocity};
    });
    onMove(player.id, position);
    if(captures) onOpponentCaptured(player.id, captures);

    // opponents.forEach((point)=>{
    //   if(Math.abs(position.x - point.x) < 0.05 && Math.abs(position.y - point.y) < 0.05){
    //     console.log('point collected')
    //     onOpponentCaptured(player.id, point.id);
    //     return;
    //   }
    // })
  })

  // const [position, setPosition] = useState(()=>({x:0.5, y:0.5, angle:0, velocity:0}));

  // const [movementValues, setMovementValues] = useState({targetVelocity:0, angle:0})

  // const playerState = useSelector((state:StoreData)=>state.players.find((p)=>p.id == player.id));
  // console.log(playerState)
  // usePeerDataReceived<{playerId:string, value:{targetVelocity:number, angle:number}, action:string}>((data)=>{
  //   if(data.payload.playerId !== player.id) return;
  //   setMovementValues({targetVelocity: data.payload.value.targetVelocity, angle: data.payload.value.angle})
  // }, 'Pursuit'+player.id)

  return (<Sprite image={player.image} x={position.x *boardWidth} y={position.y *boardHeight} rotation={position.angle} width={100} height={100} anchor={0.5} />)
}

export default PursuitCar;