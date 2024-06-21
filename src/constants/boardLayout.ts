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


export function createTriviaSpace({x=randomLocation(), y=randomLocation(), label='trivia', id=uuidv4(), connections=[], color=randomColor({})}):BoardSpaceConfig{
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
  color: '#558826',
  id: "duel",
  label: 'Showdown',
  connections: ['frenzy', 'middleTop'],
  type: GAME_MODE.DUEL,
}

export function createDuelSpace({x=randomLocation(), y=randomLocation(), label='duel', id=uuidv4(), connections=[], color=randomColor({})}):BoardSpaceConfig{
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
  x: 0.35,
  y: 0.7,
  width: 0.04,
  height: 0.04,
  color: '#00ff00',
  id: "shop",
  label: 'shop',
  connections: ['home', 'middleLeft'],
  type: GAME_MODE.SHOP,
}

const shop2: BoardSpaceConfig = {
  x: 0.65,
  y: 0.3,
  width: 0.04,
  height: 0.04,
  color: '#00ff00',
  id: "shop2",
  label: 'shop',
  connections: ['home', 'frenzy'],
  type: GAME_MODE.SHOP,
}

export function createShopSpace({x=randomLocation(), y=randomLocation(), label='shop', id=uuidv4(), connections=[], color=randomColor({})}):BoardSpaceConfig{
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
  color: '#aa6622',
  id: 'rhiannon',
  label: "Rhiannon's Casino",
  connections: ['middleBottom'],
  type: GAME_MODE.SLOTS
}

const stormy: BoardSpaceConfig = {
  x: 0.9,
  y: 0.9,
  width: 0.06,
  height: 0.06,
  color: '#aa6688',
  id: 'stormy',
  label: "Stormy's \rSlots",
  connections: ['middleBottom', 'implore2'],
  type: GAME_MODE.SLOTS
}

export const createSlotsSpace = ({x=randomLocation(), y=randomLocation(), label='random', id=uuidv4(), connections=[], color=randomColor({})}):BoardSpaceConfig=>{
  return {
    x,
    y,
    width: 0.06,
    height: 0.06,
    color: color,
    id,
    label,
    connections,
    type: GAME_MODE.SLOTS,
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

export function createGetAssetSpace({x=randomLocation(), y=randomLocation(), label='get asset', id=uuidv4(), connections=[], color=randomColor({})}):BoardSpaceConfig{
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
  color: "#35a6b2",
  id: 'frenzy',
  label: 'FRENZY',
  type: GAME_MODE.FRENZY,
  connections: ['duel', 'stormy', 'home'],
}

export function createFrenzySpace({x=randomLocation(), y=randomLocation(), label='frenzy', id=uuidv4(), connections=[], color=randomColor({})}):BoardSpaceConfig{
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
  connections: ['trivia', 'duel', 'home', 'shop2'],
  type: GAME_MODE.LOSE_ASSET,
}

export const middleBottom: BoardSpaceConfig = {
  x: 0.5,
  y: 0.9,
  width: 0.045,
  height: 0.045,
  color: "#ff2222",
  id: 'middleBottom',
  label: 'BAD STUFF',
  connections: ['shop', 'home'],
  type: GAME_MODE.LOSE_ASSET,
}

export function createLoseAssetSpace({x=randomLocation(), y=randomLocation(), label='lose asset', id=uuidv4(), connections=[], color=randomColor({})}):BoardSpaceConfig{
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
  x: 0.35,
  y: 0.3,
  width: 0.045,
  height: 0.045,
  color: "#aa22aa",
  id: 'implore',
  label: 'Implore',
  connections: ['home', 'shop'],
  type: GAME_MODE.IMPLORE,
}

const implore2: BoardSpaceConfig = {
  x: 0.65,
  y: 0.7,
  width: 0.045,
  height: 0.045,
  color: "#aa22aa",
  id: 'implore2',
  label: 'Implore',
  connections: ['home', 'shop2', 'frenzy'],
  type: GAME_MODE.IMPLORE,
}

export const boardLayout: Board = {
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
  implore2,
  shop2
}

export const boardLayout2: Board = {
  home:{
    x: 0.1,
    y: 0.5,
    width: 0.06,
    height: 0.06,
    color: '#11a122',
    id: 'home',
    label: 'home',
    connections: ['frown top', 'frown bottom'],
    type: GAME_MODE.GET_ASSET
  },
  'frown top':{
    x: 0.2,
    y: 0.1,
    width: 0.04,
    height: 0.04,
    color: '#ff2222',
    id: 'frown top',
    label: '🙁',
    connections: ['smile top', 'trivia1'],
    type: GAME_MODE.LOSE_ASSET,
  },
  'smile top':{
    x: 0.4,
    y: 0.15,
    width: 0.04,
    height: 0.04,
    color: '#22ff22',
    id: 'smile top',
    label: '🙂',
    connections: ['shop', 'rhiannon'],
    type: GAME_MODE.GET_ASSET,
  },
  'frown bottom':{
    x: 0.2,
    y: 0.9,
    width: 0.04,
    height: 0.04,
    color: '#ff2222',
    id: 'frown bottom',
    label: '🙁',
    connections: ['smile bottom', 'frenzy1'],
    type: GAME_MODE.LOSE_ASSET,
  },
  'smile bottom':{
    x: 0.4,
    y: 0.85,
    width: 0.04,
    height: 0.04,
    color: '#22ff22',
    id: 'smile bottom',
    label: '🙂',
    connections: ['shop', 'stormy'],
    type: GAME_MODE.GET_ASSET,
  },
  'frenzy1':{
    x: 0.3,
    y: 0.3,
    width: 0.04,
    height: 0.04,
    color: '#2222cc',
    id: 'frenzy1',
    label: 'Frenzy',
    connections: ['smile top', 'shop', 'duel top'],
    type: GAME_MODE.FRENZY,
  },
  'trivia1':{
    x: 0.3,
    y: 0.7,
    width: 0.04,
    height: 0.04,
    color: '#2222cc',
    id: 'trivia1',
    label: 'Trivia',
    connections: ['smile bottom', 'shop', 'duel bottom'],
    type: GAME_MODE.TRIVIA,
  },
  'shop':{
    x: 0.5,
    y: 0.5,
    width: 0.04,
    height: 0.04,
    color: '#22ffff',
    id: 'shop',
    label: 'Shop',
    connections: ['rhiannon', 'stormy'],
    type: GAME_MODE.SHOP,
  },
  'duel top': {
    x: 0.55,
    y: 0.3,
    width: 0.04,
    height: 0.04,
    color: '#aa00aa',
    id: 'duel top',
    label: 'Duel',
    connections: ['rhiannon'],
    type: GAME_MODE.DUEL
  },
  'duel bottom': {
    x: 0.55,
    y: 0.7,
    width: 0.04,
    height: 0.04,
    color: '#aa00aa',
    id: 'duel bottom',
    label: 'Duel',
    connections: ['stormy'],
    type: GAME_MODE.DUEL
  },
  'rhiannon':{
    x: 0.75,
    y: 0.2,
    width: 0.05,
    height: 0.05,
    color: '#aa6688',
    id: 'rhiannon',
    label: "Rhiannon's Casino",
    connections: ['implore'],
    type: GAME_MODE.SLOTS
  },
  'stormy':{
    x: 0.75,
    y: 0.8,
    width: 0.05,
    height: 0.05,
    color: '#aa6688',
    id: 'stormy',
    label: "Stormy's \rSlots",
    connections: ['implore'],
    type: GAME_MODE.SLOTS
  },
  'implore': {
    x: 0.9,
    y: 0.5,
    width: 0.05,
    height: 0.05,
    color: '#aa88ff',
    id: 'implore',
    label: 'Implore',
    connections: ['home', 'trivia2', 'frenzy2'],
    type: GAME_MODE.IMPLORE
  },
  'trivia2': {
    x: 0.9,
    y: 0.1,
    width: 0.04,
    height: 0.04,
    color: '#2222cc',
    id: 'trivia2',
    label: 'Trivia',
    connections: ['frown top'],
    type: GAME_MODE.TRIVIA,
  },
  'frenzy2': {
    x: 0.9,
    y: 0.9,
    width: 0.04,
    height: 0.04,
    color: '#2222cc',
    id: 'frenzy2',
    label: 'Frenzy',
    connections: ['frown bottom'],
    type: GAME_MODE.FRENZY,
  }
}

// export const randomLayout:Board = {
//   trivia:createTriviaSpace({id:'trivia'}),
//   duel:createDuelSpace({id:'duel'}),
//   shop:createShopSpace({id:'shop'}),
//   home,
//   rhiannon,
//   stormy,
//   frenzy:createFrenzySpace({id:'frenzy'}),
//   get: createGetAssetSpace({id:'get'}),
//   lose: createLoseAssetSpace({id:'lose'}),
//   random: createSlotsSpace({id:'random'}),
//   random2: createSlotsSpace({id:'random2'}),
//   get2: createGetAssetSpace({id:'get2'}),
//   lose2: createLoseAssetSpace({id:'lose2'}),
// } 
export default boardLayout;