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
    connections: ['duel', 'shop', 'home', 'bl'],
    type: ModalContent.TRIVIA,
  },
  {
    x: boardWidth *.8,
    y: boardHeight * .2,
    width: 100,
    height: 100,
    color: '#ff0000',
    id: "duel",
    label: 'duel',
    connections: ['home', 'shop', 'trivia', 'br'],
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
    connections: ['bl', 'br', 'trivia', 'duel', 'home'],
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
    connections: ['trivia', 'duel', 'shop'],
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
    connections: ['trivia', 'shop'],
    type: ModalContent.RANDOM_ASSET_CHANGE
  },
]
export default boardLayout;