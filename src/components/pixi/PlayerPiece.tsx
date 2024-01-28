import { Container, Graphics, Sprite, Text, useTick,  } from "@pixi/react";
import { TextStyle } from "pixi.js";
import type { Player, BoardSpaceConfig } from "$store/types";
import { useState } from "react";

const PlayerPiece = ({player, location, previousLocation, xOffset}:{player:Player, location:BoardSpaceConfig, previousLocation: BoardSpaceConfig, xOffset:number}) => {

  // const initialLocation = useMemo(()=>({x:location.x, y:location.y}), []);
  // const initialLocation = useRef(location)

  // const previousLocation = usePrevious(targetLocation);

  const [playerLocation, setPlayerLocation] = useState({x: previousLocation.x, y: previousLocation.y});
  // console.log(location, initialLocation)
  useTick((delta:number) => {
    // console.log(delta)
    if((location.x !== playerLocation.x && location.y !== playerLocation.y)) return;
    if(Math.abs(playerLocation.x - location.x) <= 5 && Math.abs(playerLocation.y - location.y) <= 5) return setPlayerLocation({x: location.x, y: location.y});
      // steadily move towards location.x and location.y
      const xDiff = location.x - playerLocation.x;
      const yDiff = location.y - playerLocation.y;
      const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
      const speed = 5;
      const xVel = xDiff / distance * speed * delta;
      const yVel = yDiff / distance * speed * delta;
      // console.log(xVel, yVel)
      const newX = playerLocation.x + xVel;
      const newY = playerLocation.y + yVel;
      setPlayerLocation({x: newX, y: newY});
  })

  return (
    <Container
      x={playerLocation.x + xOffset}
      y={playerLocation.y - location.width * .5}
      zIndex={100}
      width={50}
      height={50}
      key={player.id}
    >
      <Graphics draw={
        (g) => {
          g.clear();
          g.lineStyle(2, 0xffffff, 1);
          g.beginFill(0xff88ff);
          g.drawCircle(0, 0, 30);
          g.lineStyle(0, 0xffffff, 0);
          g.drawRect(-28, 0, 56, 40);
          g.endFill();
        }
      
      } />
      <Sprite
      anchor={0.5}
      x={0}
      y={0}
      width={50}
      height={50}
      image={player.image}
      />
      <Text text={player.name.toLocaleUpperCase()} style={new TextStyle({align: 'center',
fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
fontSize: 100,
fontWeight: '400',
fill: ['#ffffff', '#00ff99'], // gradient
stroke: '#01d27e',
strokeThickness: 5,
letterSpacing: 20,
dropShadow: true,
dropShadowColor: '#ccced2',
dropShadowBlur: 4,
dropShadowAngle: Math.PI / 6,
dropShadowDistance: 6,
wordWrap: true,
wordWrapWidth: 440,})}  width={(location.width ?? 100) * .5} height={30} x={0} y={10} anchor={{x:0.5, y: 0}} />
    </Container>
  )
}

export default PlayerPiece