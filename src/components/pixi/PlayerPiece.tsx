import { Container, Sprite, Text, useTick,  } from "@pixi/react";
import { TextStyle } from "pixi.js";
import type { Player, BoardSpaceConfig, StoreData } from "$store/types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useBoardDimensions from "$hooks/useBoardDimensions";


const PlayerPiece = ({id}:{id:string}) => {

  // const initialLocation = useMemo(()=>({x:location.x, y:location.y}), []);
  // const initialLocation = useRef(location)

  // const previousLocation = usePrevious(targetLocation);
  const {boardWidth, boardHeight} = useBoardDimensions();
  const player = useSelector((state:StoreData)=>state.players.find((p)=>p.id == id)) as Player;
  // const [currentLocation, setCurrentLocation] = useState({x:0, y:0});
  const location = useSelector((state:StoreData)=>state.game.board.find((l)=>l.id == player.spaceId)) as BoardSpaceConfig;

  const [destination, setDestination] = useState({x:location.x, y:location.y});
  useEffect(()=>{
    setDestination({
      x:location.x + Math.random()*location.width - location.width/2, 
      y:location.y + Math.random()*location.width * 0.5 - location.width/2
    })
  },[location])
  const [playerLocation, setPlayerLocation] = useState(destination);
  // console.log(location, initialLocation)
  useTick((delta:number) => {
    // console.log(delta)
    // if((location.x !== playerLocation.x && location.y !== playerLocation.y)) return;
    if(Math.abs(playerLocation.x - destination.x) <= 0.01 && Math.abs(playerLocation.y - destination.y) <= 0.01) return setPlayerLocation({x: destination.x, y: destination.y});
      // steadily move towards location.x and location.y
      const xDiff = destination.x - playerLocation.x;
      const yDiff = destination.y - playerLocation.y;
      const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
      const speed = 0.005;
      const xVel = xDiff / distance * speed * delta;
      const yVel = yDiff / distance * speed * delta;
      // console.log(xVel, yVel)
      const newX = playerLocation.x + xVel;
      const newY = playerLocation.y + yVel;
      setPlayerLocation({x: newX, y: newY});
  })

  return (
    <Container
      x={boardWidth * playerLocation.x}
      y={boardHeight * (playerLocation.y - location.width * .5)}
      zIndex={100}
      width={boardWidth * 0.07}
      height={boardWidth * 0.07}
      key={player.id}
    >
      {/* <Graphics draw={
        (g) => {
          g.clear();
          g.lineStyle(2, 0xffffff, 1);
          g.beginFill(0xff88ff);
          g.drawCircle(0, 0, boardWidth * 0.02);
          g.lineStyle(0, 0xffffff, 0);
          g.drawRect(-boardWidth * 0.02, 0, boardWidth * 0.1, boardHeight * 0.07);
          g.endFill();
        }
      
      } /> */}
      <Sprite
      anchor={0.5}
      x={0}
      y={0}
      width={boardWidth > 1080 ? boardWidth * 0.1 : boardWidth * 0.04}
      height={boardWidth > 720 ? boardWidth * 0.1 : boardWidth * 0.04}
      image={player.image}
      />
      <Text text={player.name.toLocaleUpperCase()} style={new TextStyle({align: 'center',
        fontFamily: 'sans-serif',
        fontSize: 100,
        fontWeight: '600',
        // fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#ffffff',
        strokeThickness: 5,
        letterSpacing: 20,
        // dropShadow: true,
        // dropShadowColor: '#ccced2',
        // dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,})}  
        width={boardWidth > 1200 ? boardWidth * 0.08: boardWidth * 0.022 } 
        height={boardHeight > 720 ? boardWidth * 0.06 : boardWidth * 0.012 } 
        x={0} 
        y={boardWidth * 0.01} 
        anchor={{x:0.5, y: 0./5}} 
        />
    </Container>
  )
}




export default PlayerPiece