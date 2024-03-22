import {shrimp, magicHat, teleport, cheat, souperSoup, soup, magicHand, wrecking_ball, men_at_work, add_space} from '$assets/images.ts';
// import activateItem from '$store/actions/activateItem'
import { GAME_MODE, ItemDefinition } from '$store/types';

const items:ItemDefinition[] = [
  {
    name: 'shrimp',
    description: 'throw a shrimp at somebody (they will be very confused)',
    price: 10,
    image: shrimp,
    params: [{
      name: 'target',
      type: 'select',
      special: 'players',
    }],
    cost: 10,
    weight: 5,
  },
  {
    name: 'magic hat', 
    description: 'Swap places with somebody',
    price: 20,
    image: magicHat,
    params: [{
      name: 'target',
      type: 'select',
      special: 'players',
    }],
    weight: 1,
  },
  {
    name: 'teleport', 
    description: 'Teleport to a random space',
    price: 30,
    image: teleport,
    params: [{
      name: 'target',
      type: 'select',
      special: 'spaces',
    }],
    weight: 1,
  },
  {
    name: 'cheat', 
    description: 'Become like Jitney Spears',
    price: 500,
    image: cheat,
    params: [{
      name: 'target',
      type: 'select',
      special: 'players',
    }],
    weight: 1,
  },
  {
    name: 'souper soup',
    description: 'permanent movement +1',
    price: 200,
    image: souperSoup,
    params: [{
      name: 'target',
      type: 'select',
      special: 'players',
    }],
    weight: 1,
  },
  {
    name: 'soup',
    description: 'movement +1',
    price: 20,
    image: soup,
    params: [{
      name: 'target',
      type: 'select',
      special: 'players',
    }],
    weight: 5,
  },
  {
    name: 'magic hand',
    description: 'steal all of an opponents assets',
    price: 500,
    image: magicHand,
    params: [{
      name: 'target',
      type: 'select',
      special: 'players',
    }],
    weight: 1,
  },
  {
    name: 'traffic engineer', 
    description: 'Add or remove a path on the board',
    price: 10,
    image: men_at_work,
    params: [
      {
        name: 'action',
        type: 'select',
        options: ['add', 'remove'],
      },
      {
        name: 'from',
        type: 'select',
        special: 'spaces',
      },
      {
        name: 'to',
        type: 'select',
        special: 'spaces',
      }
    ],
    weight: 5,
  },
  {
    name: 'demolition crew', 
    description: 'Remove a space from the board',
    price: 10,
    image: wrecking_ball,
    params: [
      {
        name: 'space',
        type: 'select',
        special: 'spaces',
      },
    ],
    weight: 5,
  },
  {
    name: 'construction crew', 
    description: 'Add a space to the board',
    price: 10,
    image: add_space,
    params: [
      {
        name: 'type',
        type: 'select',
        options: [GAME_MODE.DUEL, GAME_MODE.FRENZY, GAME_MODE.GET_ASSET, GAME_MODE.LOSE_ASSET, GAME_MODE.SLOTS, GAME_MODE.SHOP],
      },
      {
        name: 'label',
        type: 'string',
      },
      {
        name: 'color',
        type: 'color',
      },
      {
        name: 'pathsFrom1',
        type: 'select',
        special: 'spaces',
      },
      {
        name: 'pathsFrom2',
        type: 'select',
        special: 'spaces',
      },
      {
        name: 'pathsFrom3',
        type: 'select',
        special: 'spaces',
      },
      {
        name: 'pathsTo1',
        type: 'select',
        special: 'spaces',
      },
      {
        name: 'pathsTo2',
        type: 'select',
        special: 'spaces',
      },
      {
        name: 'pathsTo3',
        type: 'select',
        special: 'spaces',
      }
    ],
    weight: 5,
  },
]

export default items;