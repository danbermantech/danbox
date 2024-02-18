import { Board, BoardSpaceConfig, GAME_MODE } from "$store/types";

const trivia: BoardSpaceConfig = {
  x: 0.1,
  y: 0.1,
  width: 0.06,
  height: 0.06,
  color: '#8888ff',
  id: "trivia",
  label: 'trivia',
  connections: ['middleLeft', 'middleTop','implore'],
  type: GAME_MODE.TRIVIA,
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

const middleLeft: BoardSpaceConfig = {
  x: 0.15,
  y: 0.5,
  width: 0.045,
  height: 0.045,
  color: "#228822",
  id: 'middleLeft',
  label: '😊',
  connections: ['home', 'trivia', 'rhiannon'],
  type: GAME_MODE.GET_ASSET
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
  connections: ['duel', 'home', 'stormy'],
}

const middleTop: BoardSpaceConfig = {
  x: 0.5,
  y: 0.2,
  width: 0.045,
  height: 0.045,
  color: "#ff2222",
  id: 'middleTop',
  label: '🙁',
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
  label: '🙁',
  connections: ['shop', 'home'],
  type: GAME_MODE.LOSE_ASSET,
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
  implore
}
export default boardLayout;