import { BoardSpaceConfig, ModalContent } from "$store/types";

const boardWidth = (()=>window.innerWidth - 512)();
const boardHeight = (()=>window.innerHeight - 32)();

const boardLayout: BoardSpaceConfig[] = [
  {
    x: boardWidth* .2,
    y: boardHeight * .2,
    width: 100,
    height: 100,
    color: '#8888ff',
    id: "trivia",
    label: 'trivia',
    connections: ['middleLeft', 'middleTop'],
    type: ModalContent.TRIVIA,
  },
  {
    x: boardWidth *.8,
    y: boardHeight * .2,
    width: 100,
    height: 100,
    color: '#5588aa',
    id: "duel",
    label: 'Showdown',
    connections: ['middleRight', 'middleTop',],
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
    connections: ['home', 'middleLeft', 'middleRight'],
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
    connections: ['middleLeft', 'middleTop', 'middleRight'],
    type: ModalContent.GET_ASSET
  },
  {
    x: boardWidth*.2,
    y: boardHeight * .8,
    width: 100,
    height: 100,
    color: '#ffff00',
    id: 'bl',
    label: "Rhiannon's Casino",
    connections: ['middleLeft', 'shop',],
    type: ModalContent.RANDOM_ASSET_CHANGE
  },
  {
    x: boardWidth*.8,
    y: boardHeight * .8,
    width: 100,
    height: 100,
    color: '#ffff00',
    id: 'br',
    label: "Stormy's \rSlots",
    connections: ['middleRight', 'shop'],
    type: ModalContent.RANDOM_ASSET_CHANGE
  },
  {
    x: boardWidth*.2,
    y: boardHeight * .5,
    width: 50,
    height: 50,
    color: "#228822",
    id: 'middleLeft',
    label: '😊',
    connections: ['home', 'trivia', 'bl',],
    type: ModalContent.GET_ASSET
  },
  {
    x: boardWidth*.8,
    y: boardHeight * .5,
    width: 50,
    height: 50,
    color: "#228822",
    id: 'middleRight',
    label: 'RACE',
    connections: ['duel', 'home', 'br'],
    type: ModalContent.RACE,
  },
  {
    x: boardWidth*.5,
    y: boardHeight * .2,
    width: 50,
    height: 50,
    color: "#ff2222",
    id: 'middleTop',
    label: '🙁',
    connections: ['trivia', 'duel', 'home'],
    type: ModalContent.LOSE_ASSET,
  }
]
export default boardLayout;