import { useState } from 'react';
import { lava0 } from '$assets/images'
import { Sprite, useTick } from '@pixi/react';
import { BLEND_MODES } from 'pixi.js';
import useBoardDimensions from '$hooks/useBoardDimensions';
const LavaBackground = ({img}:{img:string}) => {
  
  const {boardWidth, boardHeight} = useBoardDimensions();
  const [scale, setScale] = useState(8);
  const [xPos, setXPos] = useState(boardWidth/2);
  const [yPos, setYPos] = useState(boardHeight/2);
  const [angle, setAngle] = useState(Math.random() * Math.PI * 2);

  useTick((delta:number) => {
    setAngle((prev)=>prev + (((0.5-Math.random()) *0.002)* delta));
    setScale((prev)=>prev + (((0.5 - Math.random()) *0.1)*delta));
    setXPos((prev)=>Math.max(boardWidth, Math.min(0, prev + Math.cos(angle) * ((Math.random()) * 5 *delta))));
    setYPos((prev)=>Math.max(boardHeight, Math.min(0, prev + Math.sin(angle) * ((Math.random()) * 5 *delta))));
  });
  
  return (
    <Sprite x={xPos} y={yPos} anchor={0.5} scale={{x:scale, y:scale}} rotation={angle} blendMode={BLEND_MODES.LIGHTEN} width={1920*4} height={1080*4} image={img} />
  );
}

const lavas = [
  lava0,
]

const ShiftingLavaBackground = () => {
  return <>
    {lavas.map((lava, i)=><LavaBackground key={i} img={lava} />)}
  </>
}

export default ShiftingLavaBackground;