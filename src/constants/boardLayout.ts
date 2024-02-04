import { BoardSpaceConfig, ModalContent } from "$store/types";

const boardLayout: BoardSpaceConfig[] = [
  {
    x: 0.1,
    y: 0.1,
    width: 0.06,
    height: 0.06,
    color: '#8888ff',
    id: "trivia",
    label: 'trivia',
    connections: ['middleLeft', 'middleTop'],
    type: ModalContent.TRIVIA,
  },
  {
    x: 0.9,
    y: 0.1,
    width: 0.06,
    height: 0.06,
    color: '#5588aa',
    id: "duel",
    label: 'Showdown',
    connections: ['frenzy', 'middleTop',],
    type: ModalContent.DUEL,
  },
  {
    x: 0.4,
    y: 0.7,
    width: 0.06,
    height: 0.06,
    color: '#00ff00',
    id: "shop",
    label: 'shop',
    connections: ['home', 'middleLeft'],
    type: ModalContent.SHOP,
  },
  {
    x: 0.5,
    y: 0.5,
    width: 0.06,
    height: 0.06,
    color: '#ff00ff',
    id: 'home',
    label: 'home',
    connections: ['middleLeft', 'middleTop', 'frenzy', 'pursuit'],
    type: ModalContent.GET_ASSET
  },
  {
    x: 0.1,
    y: 0.9,
    width: 0.06,
    height: 0.06,
    color: '#ffff00',
    id: 'bl',
    label: "Rhiannon's Casino",
    connections: ['middleBottom'],
    type: ModalContent.RANDOM_ASSET_CHANGE
  },
  {
    x: 0.9,
    y: 0.9,
    width: 0.06,
    height: 0.06,
    color: '#ffff00',
    id: 'br',
    label: "Stormy's \rSlots",
    connections: ['middleBottom'],
    type: ModalContent.RANDOM_ASSET_CHANGE
  },
  {
    x: 0.15,
    y: 0.5,
    width: 0.045,
    height: 0.045,
    color: "#228822",
    id: 'middleLeft',
    label: '😊',
    connections: ['home', 'trivia', 'bl', 'jump'],
    type: ModalContent.GET_ASSET
  },
  {
    x: 0.85,
    y: 0.5,
    width: 0.045,
    height: 0.045,
    color: "#000000",
    id: 'frenzy',
    label: 'FRENZY',
    type: ModalContent.FRENZY,
    connections: ['duel', 'home', 'br'],
  },
  {
    x: 0.5,
    y: 0.2,
    width: 0.045,
    height: 0.045,
    color: "#ff2222",
    id: 'middleTop',
    label: '🙁',
    connections: ['trivia', 'duel', 'home'],
    type: ModalContent.LOSE_ASSET,
  },
  {
    x: 0.6,
    y: 0.9,
    width: 0.045,
    height: 0.045,
    color: "#ff2222",
    id: 'middleBottom',
    label: '🙁',
    connections: ['shop', 'home'],
    type: ModalContent.LOSE_ASSET,
  }
]
export default boardLayout;