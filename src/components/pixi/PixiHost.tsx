import { Stage, Sprite, Text, } from '@pixi/react';
import Line from '$components/pixi/Line';
import Circle from '$components/pixi/Circle';
import { useSelector } from 'react-redux';
import { BoardSpaceConfig, StoreData } from '$store/types';
import { Fragment } from 'react';
import bg from '$assets/bg.png';
import { TextStyle } from 'pixi.js';
import PlayerPiece from './PlayerPiece';

const boardWidth = (()=>window.innerWidth - 512)();
const boardHeight = (()=>window.innerHeight - 32)();


export const PixiHost = () =>
{
  const players = useSelector((state:StoreData) => state.players);
  const board = useSelector((state:StoreData) => state.game.board);
  const currentRound = useSelector((state:StoreData) => state.game.currentRound);
  const maxRounds = useSelector((state:StoreData) => state.game.maxRounds);
  return (
    <Stage className="w-full mx-auto rounded-xl" width={boardWidth} height={boardHeight} options={{ backgroundColor: 0xffffff, antialias: true }}>
      <Text 
            text={`${currentRound}/${maxRounds}`} 
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
            width={400}
            height={200} 
            x={boardWidth* 0.9} y={boardHeight * 0.1} 
            anchor={{x:0.5, y: 0}} 
          />
      <Sprite x={0} y={0} width={boardWidth} height={boardHeight} image={bg} scale={{x:boardWidth/1920, y: boardHeight/1080}} />
      {board.map((location) => {
        return location.connections.map((connection) => {
          const connectedLocation = board.find((location) => location.id == connection);
          if (!connectedLocation) return null;
          return <Line
            key={location.id + '_' + connection}
            from={location}
            to={connectedLocation}
            color={location.color}
            width={1}
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
              return (<PlayerPiece 
                key={player.id}
                player={player} 
                location={location} 
                previousLocation={board.find((space)=>(space.id == player.previousSpaceId)) as BoardSpaceConfig} 
                xOffset={arr.length >= 1 ? (index - ((arr.length-1) / 2)) * (arr.length / (location.width * 1.5)) * 100 * location.width / arr.length : 0} 
                />)
          })
        }
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
            width={location.width}
            height={location.width*.5} 
            x={location.x} y={location.y + location.width * .4} 
            anchor={{x:0.5, y: 0}} 
          />
        </Fragment>
      )
      })}
    </Stage>
  );
};

export default PixiHost