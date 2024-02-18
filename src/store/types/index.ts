import type { Action } from "@reduxjs/toolkit/react";

export type PlayerAction = {
  label: string;
  action: string;
  value: string;
  styles?: React.CSSProperties;
  classNames?: string;
}

export type PlayerActions = PlayerAction[] | string;

export type StringInputParams = {
  name: string,
  type: 'string',
}

export type NumberInputParams = {
  name: string,
  type: 'number',
}

export type BooleanInputParams = {
  name: string,
  type: 'boolean',
}

export type StandardSelectInputParams = {
  name: string,
  type: 'select',
  options: (string|{label:string, value:string})[]
}

export type SpecialSelectOptions = 'players'|'opponents'|'teammates'|'spaces'|'teams'

export type SpecialSelectInputParams = {
  name: string,
  type: 'select',
  special: SpecialSelectOptions
}

export type SelectInputParams = StandardSelectInputParams | SpecialSelectInputParams

export type UserControlledParam = StringInputParams | NumberInputParams | BooleanInputParams | SelectInputParams

export type ItemDefinition = {
  name: string,
  description: string,
  price: number,
  image: string,
  // action: (args:{user:string, target:string, value?:unknown})=>{payload:{user:string, target:string, value?:unknown}, type:string},
  params?: UserControlledParam[],
  cost?: number,
  weight: number,
}

export type AssetDefinition = {
  name: string,
  value: number,
  asset: string,
  image: string,
  action: <T=unknown>(target:string)=>{payload:T, type:string},
  weight:number
}

export type Item = ItemDefinition & {id: string};

export type Effect = 'SHRIMPED' | 'MAGIC_HAT' | 'TELEPORT' | 'CHEAT'

export type Player = {
  name: string;
  id: string;
  points: number;
  gold: number;
  teamId: string;
  items: Item[];
  history: Player[];
  spaceId: string;
  effects: Effect[];
  previousSpaceId: string;
  image: string;
  controls: PlayerActions;
  hasMoved: boolean;
  movesPerRound: number;
  movesRemaining: number;
  instructions: string;
};

export type Players = Player[];

// export enum GameMode {
//   MOVEMENT = 'MOVEMENT',
//   REGISTRATION = 'REGISTRATION',
//   GAME_OVER = 'GAME_OVER',
//   MINIGAME = 'MINIGAME',
//   MINIGAME_RESULTS = 'MINIGAME_RESULTS'
// }

export enum GAME_MODE {
  MOVEMENT = 'MOVEMENT',
  REGISTRATION = 'REGISTRATION',
  GAME_OVER = 'GAME_OVER',
  RESULTS = 'RESULTS',
  TRIVIA = 'TRIVIA',
  RANDOM_ASSET_CHANGE = 'RANDOM_ASSET_CHANGE',
  HOME = 'HOME',
  DUEL = 'DUEL',
  EVENT = 'EVENT',
  ITEM = 'ITEM',
  SHOP = 'SHOP',
  BANK = 'BANK',
  START = 'START',
  END = 'END',
  FRENZY = 'FRENZY',
  GET_ASSET = 'GET_ASSET',
  LOSE_ASSET = 'LOSE_ASSET',
  IMPLORE = 'IMPLORE',
}

export type QueueAction =  {
  mode: GAME_MODE, 
  for: string[],
  when: 'start' | 'end'
}

export interface BoardSpaceConfig {
  x: number,
  y: number,
  width: number,
  height?: number,
  color: string,
  alpha?: number,
  image?: string,
  id: string,
  label: string,
  connections: string[],
  type: GAME_MODE
}

export type GameState = {
  currentRound: number;
  currentMiniGame: string | null;
  modalOpen: boolean;
  queuedActions: QueueAction[];
  activePlayers: string[];
  // board: BoardSpaceConfig[];
  mode: GAME_MODE | null,
  maxRounds: number;
};

export type Board = Record<string, BoardSpaceConfig>;

export interface BoardSpaceConfig {
  connections: string[];
}
export interface RejectedAction extends Action {
  error: Error;
}

export type StoreData = { players: Players; game: GameState; board: Board };