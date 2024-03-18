import { Board, BoardSpaceConfig, GAME_MODE } from "$store/types";
import {v4 as uuidv4} from 'uuid';
const trivia: BoardSpaceConfig = {
  x: 0.1,
  y: 0.1,
  width: 0.06,
  height: 0.06,
  color: '#8888ff',
  id: "trivia",
  label: 'trivia',
  connections: ['middleTop','implore'],
  type: GAME_MODE.TRIVIA,
}

function randomColor({
  minBrightness = 0,
  maxBrightness = 100,
  minSaturation = 0,
  maxSaturation = 100,
}: {
  minBrightness?: number;
  maxBrightness?: number;
  minSaturation?: number;
  maxSaturation?: number;
}): string {
  const brightness = Math.floor(
    Math.random() * (maxBrightness - minBrightness) + minBrightness
  );
  const saturation = Math.floor(
    Math.random() * (maxSaturation - minSaturation) + minSaturation
  );
  const hue = Math.floor(Math.random() * 255);
  const colorString = `hsl(${hue}, ${saturation}%, ${brightness}%)`;
  return colorString;
}

function randomBetween(min:number, max:number):number{
  return Math.random() * (max - min) + min;
}

function randomLocation(){
  return randomBetween(0.2, 0.8);
}


function createTriviaSpace({x=randomLocation(), y=randomLocation(), label='trivia', id=uuidv4(), connections=[], color=randomColor({})}):BoardSpaceConfig{
  return {
    x,
    y,
    width: 0.06,
    height: 0.06,
    color: color,
    id,
    label,
    connections,
    type: GAME_MODE.TRIVIA,
  }
}

const duel: BoardSpaceConfig = {
  x: 0.9,
  y: 0.1,
  width: 0.06,
  height: 0.06,
  color: '#5588aa',
  id: "duel",
  label: 'Showdown',
  connections: ['frenzy', 'middleTop',],
  type: GAME_MODE.DUEL,
}

function createDuelSpace({x=randomLocation(), y=randomLocation(), label='duel', id=uuidv4(), connections=[], color=randomColor({})}):BoardSpaceConfig{
  return {
    x,
    y,
    width: 0.06,
    height: 0.06,
    color: color,
    id,
    label,
    connections,
    type: GAME_MODE.DUEL,
  }
}

const shop: BoardSpaceConfig = {
  x: 0.4,
  y: 0.7,
  width: 0.06,
  height: 0.06,
  color: '#00ff00',
  id: "shop",
  label: 'shop',
  connections: ['home', 'middleLeft'],
  type: GAME_MODE.SHOP,
}

function createShopSpace({x=randomLocation(), y=randomLocation(), label='shop', id=uuidv4(), connections=[], color=randomColor({})}):BoardSpaceConfig{
  return {
    x,
    y,
    width: 0.06,
    height: 0.06,
    color: color,
    id,
    label,
    connections,
    type: GAME_MODE.SHOP,
  }
}

const home: BoardSpaceConfig = {
  x: 0.5,
  y: 0.5,
  width: 0.06,
  height: 0.06,
  color: '#ff00ff',
  id: 'home',
  label: 'home',
  connections: ['middleLeft', 'middleTop', 'frenzy', 'pursuit'],
  type: GAME_MODE.GET_ASSET
}

const rhiannon: BoardSpaceConfig = {
  x: 0.1,
  y: 0.9,
  width: 0.06,
  height: 0.06,
  color: '#ffff00',
  id: 'rhiannon',
  label: "Rhiannon's Casino",
  connections: ['middleBottom'],
  type: GAME_MODE.RANDOM_ASSET_CHANGE
}

const stormy: BoardSpaceConfig = {
  x: 0.9,
  y: 0.9,
  width: 0.06,
  height: 0.06,
  color: '#ffff00',
  id: 'stormy',
  label: "Stormy's \rSlots",
  connections: ['middleBottom'],
  type: GAME_MODE.RANDOM_ASSET_CHANGE
}

const createRandomAssetChangeSpace = ({x=randomLocation(), y=randomLocation(), label='random', id=uuidv4(), connections=[], color=randomColor({})}):BoardSpaceConfig=>{
  return {
    x,
    y,
    width: 0.06,
    height: 0.06,
    color: color,
    id,
    label,
    connections,
    type: GAME_MODE.RANDOM_ASSET_CHANGE,
  }
}

const middleLeft: BoardSpaceConfig = {
  x: 0.15,
  y: 0.5,
  width: 0.045,
  height: 0.045,
  color: "#228822",
  id: 'middleLeft',
  label: 'GOOD STUFF',
  connections: ['home', 'trivia', 'rhiannon'],
  type: GAME_MODE.GET_ASSET
}

function createGetAssetSpace({x=randomLocation(), y=randomLocation(), label='get asset', id=uuidv4(), connections=[], color=randomColor({})}):BoardSpaceConfig{
  return {
    x,
    y,
    width: 0.045,
    height: 0.045,
    color: color,
    id,
    label,
    connections,
    type: GAME_MODE.GET_ASSET,
  }
}

const frenzy: BoardSpaceConfig = {
  x: 0.85,
  y: 0.5,
  width: 0.045,
  height: 0.045,
  color: "#000000",
  id: 'frenzy',
  label: 'FRENZY',
  type: GAME_MODE.FRENZY,
  connections: ['duel', 'stormy'],
}

function createFrenzySpace({x=randomLocation(), y=randomLocation(), label='frenzy', id=uuidv4(), connections=[], color=randomColor({})}):BoardSpaceConfig{
  return {
    x,
    y,
    width: 0.045,
    height: 0.045,
    color: color,
    id,
    label,
    connections,
    type: GAME_MODE.FRENZY,
  }
}

const middleTop: BoardSpaceConfig = {
  x: 0.5,
  y: 0.2,
  width: 0.045,
  height: 0.045,
  color: "#ff2222",
  id: 'middleTop',
  label: 'OH NO',
  connections: ['trivia', 'duel', 'home'],
  type: GAME_MODE.LOSE_ASSET,
}

const middleBottom: BoardSpaceConfig = {
  x: 0.6,
  y: 0.9,
  width: 0.045,
  height: 0.045,
  color: "#ff2222",
  id: 'middleBottom',
  label: 'BAD STUFF',
  connections: ['shop', 'home'],
  type: GAME_MODE.LOSE_ASSET,
}

function createLoseAssetSpace({x=randomLocation(), y=randomLocation(), label='lose asset', id=uuidv4(), connections=[], color=randomColor({})}):BoardSpaceConfig{
  return {
    x,
    y,
    width: 0.045,
    height: 0.045,
    color: color,
    id,
    label,
    connections,
    type: GAME_MODE.LOSE_ASSET,
  }
}

const implore: BoardSpaceConfig = {
  x: 0.4,
  y: 0.3,
  width: 0.045,
  height: 0.045,
  color: "#aa22aa",
  id: 'implore',
  label: 'Implore',
  connections: ['home', 'shop'],
  type: GAME_MODE.IMPLORE,
}

const boardLayout: Board = {
  trivia,
  duel,
  shop,
  home,
  rhiannon,
  stormy,
  middleLeft,
  frenzy,
  middleTop,
  middleBottom,
  implore,
}

export const randomLayout:Board = {
  trivia:createTriviaSpace({id:'trivia'}),
  duel:createDuelSpace({id:'duel'}),
  shop:createShopSpace({id:'shop'}),
  home,
  rhiannon,
  stormy,
  frenzy:createFrenzySpace({id:'frenzy'}),
  get: createGetAssetSpace({id:'get'}),
  lose: createLoseAssetSpace({id:'lose'}),
  random: createRandomAssetChangeSpace({id:'random'}),
  random2: createRandomAssetChangeSpace({id:'random2'}),
  get2: createGetAssetSpace({id:'get2'}),
  lose2: createLoseAssetSpace({id:'lose2'}),
} 
export default boardLayout;