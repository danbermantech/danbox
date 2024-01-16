import type { Action } from "@reduxjs/toolkit/react";

export type PlayerAction = {
  label: string;
  action: string;
  value: string;
  styles?: React.CSSProperties;
};

export type Player = {
  name: string;
  id: string;
  points: number;
  gold: number;
  teamId: string;
  items: {name:string, description:string, image:string}[];
  history: string[];
  spaceId: string,
  image: string;
  controls: PlayerAction[];
  hasMoved: boolean;
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
  mode: 'MOVEMENT' | 'REGISTRATION' | 'GAME_OVER' | 'MINIGAME' | 'MINIGAME_RESULTS'
  // currentPlayerActions: PlayerAction[];
};


export interface RejectedAction extends Action {
  error: Error;
}

export type StoreData = { players: Players; game: GameState; board: BoardSpaceConfig[] };