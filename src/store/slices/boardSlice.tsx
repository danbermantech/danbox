import { BoardSpaceConfig, ModalContent } from "$store/types";
import { createSlice } from "@reduxjs/toolkit";

const boardWidth = (()=>window.innerWidth - 32)();
const boardHeight = (()=>window.innerHeight - 32)();

const boardLayout: BoardSpaceConfig[] = [
  {
    x: boardWidth* .2,
    y: boardHeight * .2,
    width: 100,
    height: 100,
    color: '#0000ff',
    id: "bank",
    label: 'bank',
    connections: ['duel', 'shop', 'home', 'bl'],
    type: ModalContent.BANK,
  },
  {
    x: boardWidth *.8,
    y: boardHeight * .2,
    width: 100,
    height: 100,
    color: '#ff0000',
    id: "duel",
    label: 'duel',
    connections: ['home', 'shop', 'bank', 'br'],
    type: ModalContent.DUEL,
  },
  {
    x: boardWidth*.5,
    y: boardHeight * .8,
    width: 100,
    height: 100,
    color: '#00ff00',
    id: "shop",
    label: 'shop',
    connections: ['bl', 'br'],
    type: ModalContent.SHOP,
  },
  {
    x: boardWidth*.5,
    y: boardHeight * .5,
    width: 100,
    height: 100,
    color: '#ff00ff',
    id: 'home',
    label: 'home',
    connections: ['bank', 'duel', 'shop'],
    type: ModalContent.HOME
  },
  {
    x: boardWidth*.8,
    y: boardHeight * .8,
    width: 100,
    height: 100,
    color: '#ffff00',
    id: 'br',
    label: 'random',
    connections: ['duel', 'shop'],
    type: ModalContent.RANDOM_ASSET_CHANGE
  },
  {
    x: boardWidth*.2,
    y: boardHeight * .8,
    width: 100,
    height: 100,
    color: '#ffff00',
    id: 'bl',
    label: 'random',
    connections: ['bank', 'shop'],
    type: ModalContent.RANDOM_ASSET_CHANGE
  },
]


export const boardSlice = createSlice({
  name: "board",
  initialState: boardLayout,
  reducers:{
    setBoard: (state, action) => {
      return action.payload;
    }
  },
});

export default boardSlice.reducer;