import { StoreData } from "$store/types";
import { Text } from "@pixi/react";
import { TextStyle } from "pixi.js";
import { useSelector } from "react-redux";

const boardWidth = (()=>window.innerWidth - 512)();

const RoundCounter = () => {

  const currentRound = useSelector((state:StoreData) => state.game.currentRound);
  const maxRounds = useSelector((state:StoreData) => state.game.maxRounds);
return (

  <Text
  text={`Round ${currentRound}/${maxRounds}`} 
  style={new TextStyle({
    align: 'center',
    fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
    fontSize: 100,
    fontWeight: '400',
    fill: ['#8888ff', '#000000'], // gradient
    stroke: '#0000ff',
    strokeThickness: 5,
    letterSpacing: 20,
    dropShadow: true,
    dropShadowColor: '#4444ff',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
  })} 
  width={300}
  height={150} 
  x={boardWidth* 0.5} y={0} 
  anchor={{x:0.5, y: 0}} 
  />
  )
}

export default RoundCounter