// import { BlurFilter } from 'pixi.js';
import { Stage, Sprite, Text, Container, } from '@pixi/react';
// import { useMemo, } from 'react';
import Line from '$components/pixi/Line';
import Circle from '$components/pixi/Circle';
// import red_circle from '$assets/red_circle.png' 
import { useSelector } from 'react-redux';
import { StoreData } from '$store/types';
import { Fragment } from 'react';
import bg from '$assets/bg.png';

// import { Circle } from 'pixi.js';



const boardWidth = (()=>window.innerWidth - 512)();
const boardHeight = (()=>window.innerHeight - 32)();




export const PixiHost = () =>
{
  const players = useSelector((state:StoreData) => state.players);
  const board = useSelector((state:StoreData) => state.game.board);
  return (
    <Stage className="w-full mx-auto rounded-xl" width={boardWidth} height={boardHeight} options={{ backgroundColor: 0xffffff }}>
      <Sprite x={0} y={0} width={boardWidth} height={boardHeight} image={bg} scale={{x:boardWidth/1920, y: boardHeight/1080}} />
      {board.map((location) => {
        return location.connections.map((connection) => {
          const connectedLocation = board.find((location) => location.id == connection);
          if (!connectedLocation) return null;
          return <Line
            key={location.id + '_' + connection}
            x1={location.x}
            y1={location.y}
            x2={connectedLocation.x}
            y2={connectedLocation.y}
            color="#000000"
            width={10}
          />
        })
      })}
      {board.map((location) => {
        return (<Fragment key={location.id}>
        <Circle
          fill={location.color}
          stroke={location.color}
          x={location.x}
          y={location.y}
          radius={location.width ?? 100}
          strokeWidth={10}
          />
          {
            players.filter((player)=>player.spaceId == location.id).map((player, index, arr)=>{
              
              const xOffset = (()=>{
                if(arr.length == 1) return 0;
                return (index - ((arr.length-1) / 2)) * (arr.length / (location.width * 1.5)) * 100 * location.width / arr.length ;
              })()
              return (
                <Container
                  x={location.x + xOffset}
                  y={location.y - location.width * .5}
                  width={(location.width ?? 100) * .5}
                  height={(location.width ?? 100) * .5}
                  key={player.id}
                >
                  <Sprite
                  anchor={0.5}
                  x={0}
                  y={0}
                  width={(location.width ?? 100) * .5}
                  height={(location.width ?? 100) * .5}
                  image={player.image}
                  />
                  <Text text={player.name.toLocaleUpperCase()}  width={(location.width ?? 100) * .5} height={30} x={0} y={10} anchor={{x:0.5, y: 0}} />
                </Container>
              )
          })
        }
          <Text text={location.label.toLocaleUpperCase()} width={location.width} height={location.width/2} x={location.x} y={location.y} anchor={{x:0.5, y: 0}} />
        </Fragment>
      )
      })}
      {/* <Container x={0} y={boardHeight - 50} width={boardHeight } height={100}>
        {players.map((player, index, arr)=>(
          <Container
            x={((index+1)/arr.length) * boardWidth * .8}
            y={0}
            width={250}
            height={100}
            key={player.id}
            >
              <Sprite
              anchor={0.5}
              x={0}
              y={-20}
              width={50}
              height={50}
              image={player.image}
              />
              <Text text={player.name.toLocaleUpperCase()}  width={100} height={30} x={0} y={10} anchor={{x:0.5, y: 0}} />
              <Text text={`gold : ${player.gold}`} width={150} height={30} x={150} y={-50} anchor={{x:0.5, y: 0}} />
              <Text text={`points : ${player.points}`} width={150} height={30} x={150} y={-20} anchor={{x:0.5, y: 0}} />
              <Text text={`items : ${player.items.length ? player.items.join(', ') : 'none'}`} width={150} height={30} x={150} y={10} anchor={{x:0.5, y: 0}} />

          </Container>
        ))}
     </Container> */}
    </Stage>
  );
};

export default PixiHost