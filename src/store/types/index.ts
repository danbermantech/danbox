import type { Action } from "@reduxjs/toolkit/react";

export type PlayerAction = {
  label: string;
  action: string;
  value: string;
  styles?: React.CSSProperties;
};

export type ItemDefinition = {
  name: string,
  description: string,
  price: number,
  image: string,
  action: (args:{user:string, target:string, value?:unknown})=>{payload:{user:string, target:string, value?:unknown}, type:string},
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
  effects?: Effect[];
  previousSpaceId: string;
  image: string;
  controls: PlayerAction[];
  hasMoved: boolean;
  instructions: string;
};

export type Players = Player[];

export enum GameMode {
  MOVEMENT = 'MOVEMENT',
  REGISTRATION = 'REGISTRATION',
  GAME_OVER = 'GAME_OVER',
  MINIGAME = 'MINIGAME',
  MINIGAME_RESULTS = 'MINIGAME_RESULTS'
}

export enum ModalContent {
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
  RACE = 'RACE',
  GET_ASSET = 'GET_ASSET',
  LOSE_ASSET = 'LOSE_ASSET',
}

export type QueueAction =  {
  mode: GameMode, 
  modalContent: ModalContent,
  for: string[],
  when: 'start' | 'end'
}

export type BoardSpaceConfig = {
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
  type: ModalContent
}

export type GameState = {
  currentRound: number;
  currentMiniGame: string | null;
  modalContent: ModalContent | null;
  modalOpen: boolean;
  queuedActions: QueueAction[];
  activePlayers: string[];
  board: BoardSpaceConfig[];
  mode: 'MOVEMENT' | 'REGISTRATION' | 'GAME_OVER' | 'MINIGAME' | 'MINIGAME_RESULTS',
  maxRounds: number;
};


export interface RejectedAction extends Action {
  error: Error;
}

export type StoreData = { players: Players; game: GameState; board: BoardSpaceConfig[] };