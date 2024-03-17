import {shrimp, magicHat, teleport, cheat, souperSoup, soup, magicHand} from '$assets/images.ts';
// import activateItem from '$store/actions/activateItem'
import { ItemDefinition } from '$store/types';

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
    description: 'Cheat',
    price: 100,
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
  }
]

export default items;