import useBoardDimensions from "$hooks/useBoardDimensions";
import usePeerDataReceived from "$hooks/useDataReceived";
import type { Player } from "$store/types"
import { Sprite, useTick } from "@pixi/react";
import { useRef, useState } from "react";

// Fraction of velocity retained each tick — lower = more friction/shorter coast
const FRICTION = 0.92;
// Max velocity gained per tick when accelerating
const ACCELERATION = 0.003;

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
  const positionRef = useRef({x:0.5, y:0.5, angle:0, velocity:0});
  const movementRef = useRef({targetVelocity:0, angle:0});

  usePeerDataReceived<{playerId:string, value:{targetVelocity:number, angle:number}, action:string}>((data)=>{
    if(data.payload.playerId !== player.id) return;
    movementRef.current = {targetVelocity: data.payload.value.targetVelocity, angle: data.payload.value.angle};
  }, 'FRENZY'+player.id)

  useTick((delta:number) => {
    const pos = positionRef.current;
    const mv = movementRef.current;

    // Decay velocity each tick for coasting momentum
    let nextVelocity = pos.velocity * Math.pow(FRICTION, delta);

    // Accelerate toward the target velocity when throttle is applied
    const velocityDiff = mv.targetVelocity - nextVelocity;
    if (velocityDiff > 0) {
      nextVelocity = Math.min(nextVelocity + ACCELERATION * delta, mv.targetVelocity);
    }

    const nextAngle = mv.angle ? pos.angle - mv.angle * delta : pos.angle;
    const nextX = Math.max(Math.min(pos.x + Math.cos(nextAngle) * nextVelocity * delta, boundaries.maxX), boundaries.minX);
    const nextY = Math.max(Math.min(pos.y + Math.sin(nextAngle) * nextVelocity * delta, boundaries.maxY), boundaries.minY);

    const nextPos = {x: nextX, y: nextY, angle: nextAngle, velocity: nextVelocity};
    positionRef.current = nextPos;
    setPosition(nextPos);

    points.forEach((point)=>{
      if(Math.abs(nextX - point.x) < 0.05 && Math.abs(nextY - point.y) < 0.05){
        onPointCollected(player.id, point.id);
      }
    });

    gold.forEach((point)=>{
      if(Math.abs(nextX - point.x) < 0.05 && Math.abs(nextY - point.y) < 0.05){
        onGoldCollected(player.id, point.id);
      }
    });
  });

  return (<Sprite image={player.image} x={position.x *boardWidth} y={position.y *boardHeight} rotation={position.angle} width={100} height={100} anchor={0.5} />)
}

export default FrenzyCar;