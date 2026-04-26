import { Board, BoardSpaceConfig, GAME_MODE } from "$store/types";
import {v4 as uuidv4} from 'uuid';
const trivia: BoardSpaceConfig = {
  x: 0.1,
  y: 0.1,
  width: 0.06,
  height: 0.06,
  color: '#8888ff',
  id: "trivia",
  label: 'trivia',
  connections: ['middleTop','implore'],
  type: GAME_MODE.TRIVIA,
}

function randomColor({
  minBrightness = 0,
  maxBrightness = 100,
  minSaturation = 0,
  maxSaturation = 100,
}: {
  minBrightness?: number;
  maxBrightness?: number;
  minSaturation?: number;
  maxSaturation?: number;
}): string {
  const brightness = Math.floor(
    Math.random() * (maxBrightness - minBrightness) + minBrightness
  );
  const saturation = Math.floor(
    Math.random() * (maxSaturation - minSaturation) + minSaturation
  );
  const hue = Math.floor(Math.random() * 255);
  const colorString = `hsl(${hue}, ${saturation}%, ${brightness}%)`;
  return colorString;
}

function randomBetween(min:number, max:number):number{
  return Math.random() * (max - min) + min;
}

function randomLocation(){
  return randomBetween(0.2, 0.8);
}


export function createTriviaSpace({x=randomLocation(), y=randomLocation(), label='trivia', id=uuidv4(), connections=[], color=randomColor({})}):BoardSpaceConfig{
  return {
    x,
    y,
    width: 0.06,
    height: 0.06,
    color: color,
    id,
    label,
    connections,
    type: GAME_MODE.TRIVIA,
  }
}

const duel: BoardSpaceConfig = {
  x: 0.9,
  y: 0.1,
  width: 0.06,
  height: 0.06,
  color: '#558826',
  id: "duel",
  label: 'Showdown',
  connections: ['frenzy', 'middleTop'],
  type: GAME_MODE.DUEL,
}

export function createDuelSpace({x=randomLocation(), y=randomLocation(), label='duel', id=uuidv4(), connections=[], color=randomColor({})}):BoardSpaceConfig{
  return {
    x,
    y,
    width: 0.06,
    height: 0.06,
    color: color,
    id,
    label,
    connections,
    type: GAME_MODE.DUEL,
  }
}

const shop: BoardSpaceConfig = {
  x: 0.35,
  y: 0.7,
  width: 0.04,
  height: 0.04,
  color: '#00ff00',
  id: "shop",
  label: 'shop',
  connections: ['home', 'middleLeft'],
  type: GAME_MODE.SHOP,
}

const shop2: BoardSpaceConfig = {
  x: 0.65,
  y: 0.3,
  width: 0.04,
  height: 0.04,
  color: '#00ff00',
  id: "shop2",
  label: 'shop',
  connections: ['home', 'frenzy'],
  type: GAME_MODE.SHOP,
}

export function createShopSpace({x=randomLocation(), y=randomLocation(), label='shop', id=uuidv4(), connections=[], color=randomColor({})}):BoardSpaceConfig{
  return {
    x,
    y,
    width: 0.06,
    height: 0.06,
    color: color,
    id,
    label,
    connections,
    type: GAME_MODE.SHOP,
  }
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
  color: '#aa6622',
  id: 'rhiannon',
  label: "Rhiannon's Casino",
  connections: ['middleBottom'],
  type: GAME_MODE.SLOTS
}

const stormy: BoardSpaceConfig = {
  x: 0.9,
  y: 0.9,
  width: 0.06,
  height: 0.06,
  color: '#aa6688',
  id: 'stormy',
  label: "Stormy's \rSlots",
  connections: ['middleBottom', 'implore2'],
  type: GAME_MODE.SLOTS
}

export const createSlotsSpace = ({x=randomLocation(), y=randomLocation(), label='random', id=uuidv4(), connections=[], color=randomColor({})}):BoardSpaceConfig=>{
  return {
    x,
    y,
    width: 0.06,
    height: 0.06,
    color: color,
    id,
    label,
    connections,
    type: GAME_MODE.SLOTS,
  }
}

const middleLeft: BoardSpaceConfig = {
  x: 0.15,
  y: 0.5,
  width: 0.045,
  height: 0.045,
  color: "#228822",
  id: 'middleLeft',
  label: 'GOOD STUFF',
  connections: ['home', 'trivia', 'rhiannon'],
  type: GAME_MODE.GET_ASSET
}

export function createGetAssetSpace({x=randomLocation(), y=randomLocation(), label='get asset', id=uuidv4(), connections=[], color=randomColor({})}):BoardSpaceConfig{
  return {
    x,
    y,
    width: 0.045,
    height: 0.045,
    color: color,
    id,
    label,
    connections,
    type: GAME_MODE.GET_ASSET,
  }
}

const frenzy: BoardSpaceConfig = {
  x: 0.85,
  y: 0.5,
  width: 0.045,
  height: 0.045,
  color: "#35a6b2",
  id: 'frenzy',
  label: 'FRENZY',
  type: GAME_MODE.FRENZY,
  connections: ['duel', 'stormy', 'home'],
}

export function createFrenzySpace({x=randomLocation(), y=randomLocation(), label='frenzy', id=uuidv4(), connections=[], color=randomColor({})}):BoardSpaceConfig{
  return {
    x,
    y,
    width: 0.045,
    height: 0.045,
    color: color,
    id,
    label,
    connections,
    type: GAME_MODE.FRENZY,
  }
}

const middleTop: BoardSpaceConfig = {
  x: 0.5,
  y: 0.2,
  width: 0.045,
  height: 0.045,
  color: "#ff2222",
  id: 'middleTop',
  label: 'OH NO',
  connections: ['trivia', 'duel', 'home', 'shop2'],
  type: GAME_MODE.LOSE_ASSET,
}

export const middleBottom: BoardSpaceConfig = {
  x: 0.5,
  y: 0.9,
  width: 0.045,
  height: 0.045,
  color: "#ff2222",
  id: 'middleBottom',
  label: 'BAD STUFF',
  connections: ['shop', 'home'],
  type: GAME_MODE.LOSE_ASSET,
}

export function createLoseAssetSpace({x=randomLocation(), y=randomLocation(), label='lose asset', id=uuidv4(), connections=[], color=randomColor({})}):BoardSpaceConfig{
  return {
    x,
    y,
    width: 0.045,
    height: 0.045,
    color: color,
    id,
    label,
    connections,
    type: GAME_MODE.LOSE_ASSET,
  }
}

const implore: BoardSpaceConfig = {
  x: 0.35,
  y: 0.3,
  width: 0.045,
  height: 0.045,
  color: "#aa22aa",
  id: 'implore',
  label: 'Implore',
  connections: ['home', 'shop'],
  type: GAME_MODE.IMPLORE,
}

const implore2: BoardSpaceConfig = {
  x: 0.65,
  y: 0.7,
  width: 0.045,
  height: 0.045,
  color: "#aa22aa",
  id: 'implore2',
  label: 'Implore',
  connections: ['home', 'shop2', 'frenzy'],
  type: GAME_MODE.IMPLORE,
}

export const boardLayout: Board = {
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
  implore,
  implore2,
  shop2
}

export const boardLayout2: Board = {
  home:{
    x: 0.1,
    y: 0.5,
    width: 0.06,
    height: 0.06,
    color: '#11a122',
    id: 'home',
    label: 'home',
    connections: ['frown top', 'frown bottom'],
    type: GAME_MODE.GET_ASSET
  },
  'frown top':{
    x: 0.2,
    y: 0.1,
    width: 0.04,
    height: 0.04,
    color: '#ff2222',
    id: 'frown top',
    label: '🙁',
    connections: ['smile top', 'trivia1'],
    type: GAME_MODE.LOSE_ASSET,
  },
  'smile top':{
    x: 0.4,
    y: 0.15,
    width: 0.04,
    height: 0.04,
    color: '#22ff22',
    id: 'smile top',
    label: '🙂',
    connections: ['shop', 'rhiannon'],
    type: GAME_MODE.GET_ASSET,
  },
  'frown bottom':{
    x: 0.2,
    y: 0.9,
    width: 0.04,
    height: 0.04,
    color: '#ff2222',
    id: 'frown bottom',
    label: '🙁',
    connections: ['smile bottom', 'frenzy1'],
    type: GAME_MODE.LOSE_ASSET,
  },
  'smile bottom':{
    x: 0.4,
    y: 0.85,
    width: 0.04,
    height: 0.04,
    color: '#22ff22',
    id: 'smile bottom',
    label: '🙂',
    connections: ['shop', 'stormy'],
    type: GAME_MODE.GET_ASSET,
  },
  'frenzy1':{
    x: 0.3,
    y: 0.3,
    width: 0.04,
    height: 0.04,
    color: '#2222cc',
    id: 'frenzy1',
    label: 'Frenzy',
    connections: ['smile top', 'shop', 'duel top'],
    type: GAME_MODE.FRENZY,
  },
  'trivia1':{
    x: 0.3,
    y: 0.7,
    width: 0.04,
    height: 0.04,
    color: '#2222cc',
    id: 'trivia1',
    label: 'Trivia',
    connections: ['smile bottom', 'shop', 'duel bottom'],
    type: GAME_MODE.TRIVIA,
  },
  'shop':{
    x: 0.5,
    y: 0.5,
    width: 0.04,
    height: 0.04,
    color: '#22ffff',
    id: 'shop',
    label: 'Shop',
    connections: ['rhiannon', 'stormy'],
    type: GAME_MODE.SHOP,
  },
  'duel top': {
    x: 0.55,
    y: 0.3,
    width: 0.04,
    height: 0.04,
    color: '#aa00aa',
    id: 'duel top',
    label: 'Duel',
    connections: ['rhiannon'],
    type: GAME_MODE.DUEL
  },
  'duel bottom': {
    x: 0.55,
    y: 0.7,
    width: 0.04,
    height: 0.04,
    color: '#aa00aa',
    id: 'duel bottom',
    label: 'Duel',
    connections: ['stormy'],
    type: GAME_MODE.DUEL
  },
  'rhiannon':{
    x: 0.75,
    y: 0.2,
    width: 0.05,
    height: 0.05,
    color: '#aa6688',
    id: 'rhiannon',
    label: "Rhiannon's Casino",
    connections: ['implore'],
    type: GAME_MODE.SLOTS
  },
  'stormy':{
    x: 0.75,
    y: 0.8,
    width: 0.05,
    height: 0.05,
    color: '#aa6688',
    id: 'stormy',
    label: "Stormy's \rSlots",
    connections: ['implore'],
    type: GAME_MODE.SLOTS
  },
  'implore': {
    x: 0.9,
    y: 0.5,
    width: 0.05,
    height: 0.05,
    color: '#aa88ff',
    id: 'implore',
    label: 'Implore',
    connections: ['home', 'trivia2', 'frenzy2'],
    type: GAME_MODE.IMPLORE
  },
  'trivia2': {
    x: 0.9,
    y: 0.1,
    width: 0.04,
    height: 0.04,
    color: '#2222cc',
    id: 'trivia2',
    label: 'Trivia',
    connections: ['frown top'],
    type: GAME_MODE.TRIVIA,
  },
  'frenzy2': {
    x: 0.9,
    y: 0.9,
    width: 0.04,
    height: 0.04,
    color: '#2222cc',
    id: 'frenzy2',
    label: 'Frenzy',
    connections: ['frown bottom'],
    type: GAME_MODE.FRENZY,
  }
}

function proximitySample(candidates: BoardSpaceConfig[], from: BoardSpaceConfig, n: number): BoardSpaceConfig[] {
  const pool = candidates.map(s => ({
    s,
    w: 1 / Math.pow(Math.hypot(s.x - from.x, s.y - from.y) + 0.001, 2),
  }));
  const result: BoardSpaceConfig[] = [];
  while (result.length < n && pool.length > 0) {
    const total = pool.reduce((sum, p) => sum + p.w, 0);
    let r = Math.random() * total;
    let idx = pool.length - 1;
    for (let i = 0; i < pool.length; i++) { r -= pool[i].w; if (r <= 0) { idx = i; break; } }
    result.push(pool[idx].s);
    pool.splice(idx, 1);
  }
  return result;
}

export function generateRandomBoard(spaceCount = 14): Board {
  const PADDING = 0.1;
  const MIN_DIST = 0.15;
  const MAX_PLACEMENT_ATTEMPTS = 400;

  // IMPLORE is excluded here — exactly one is placed deterministically below
  const spaceTypeDefs = [
    { type: GAME_MODE.TRIVIA,     labels: ['Trivia', 'Quiz', 'Brain Buster', 'Think Fast', 'Pop Quiz'],           color: '#7777ee', size: 0.055, weight: 2 },
    { type: GAME_MODE.LOSE_ASSET, labels: ['Bad Luck', 'Rotten Luck', 'Tough Break', 'Misfortune', 'Rough Patch'], color: '#ee4444', size: 0.05,  weight: 5 },
    { type: GAME_MODE.GET_ASSET,  labels: ['Good Luck', 'Fortune', 'Lucky Break', 'Windfall', 'Payday'],           color: '#44bb44', size: 0.05,  weight: 5 },
    { type: GAME_MODE.SHOP,       labels: ['Shop', 'Market', 'Bazaar', 'Emporium', 'Trading Post'],                color: '#00dddd', size: 0.05,  weight: 3 },
    { type: GAME_MODE.DUEL,       labels: ['Showdown', 'Face Off', 'Challenge', 'Rivalry', 'Clash'],               color: '#558826', size: 0.055, weight: 2 },
    { type: GAME_MODE.SLOTS,      labels: ['Slots', 'Spin', 'Lucky Spin', 'Take a Chance', 'Roll the Dice'],       color: '#aa6622', size: 0.055, weight: 3 },
    { type: GAME_MODE.FRENZY,     labels: ['Frenzy', 'Chaos', 'Mayhem', 'Wild Card', 'Pandemonium'],               color: '#35a6b2', size: 0.05,  weight: 2 },
  ];
  const typePool = spaceTypeDefs.flatMap(def => Array(def.weight).fill(def));
  const pickLabel = (def: typeof spaceTypeDefs[0]) => def.labels[Math.floor(Math.random() * def.labels.length)];

  // --- Place spaces via Bridson's Poisson-disk sampling ---
  // Candidates are generated in an annulus [MIN_DIST, 2*MIN_DIST] around each
  // accepted point, giving far more even spatial coverage than pure dart-throwing.
  const homeAtCenter = Math.random() < 0.5;
  const firstPos = homeAtCenter
    ? { x: 0.5, y: 0.5 }
    : { x: randomBetween(PADDING, 1 - PADDING), y: randomBetween(PADDING, 1 - PADDING) };

  const positions: { x: number; y: number }[] = [firstPos];
  const frontier: { x: number; y: number }[] = [firstPos];
  const K = 30; // candidates per frontier point before retiring it

  while (positions.length < spaceCount && frontier.length > 0) {
    const idx = Math.floor(Math.random() * frontier.length);
    const base = frontier[idx];
    let placed = false;

    for (let k = 0; k < K; k++) {
      // Random point in annulus [MIN_DIST, 2*MIN_DIST] around base
      const angle = Math.random() * 2 * Math.PI;
      const radius = MIN_DIST * (1 + Math.random());
      const x = base.x + radius * Math.cos(angle);
      const y = base.y + radius * Math.sin(angle);

      if (x < PADDING || x > 1 - PADDING || y < PADDING || y > 1 - PADDING) continue;
      if (positions.some(p => Math.hypot(p.x - x, p.y - y) < MIN_DIST)) continue;

      const pt = { x, y };
      positions.push(pt);
      frontier.push(pt);
      placed = true;
      if (positions.length >= spaceCount) break;
    }

    if (!placed) frontier.splice(idx, 1);
  }

  // Fallback: if Poisson disk didn't fill the board (very large spaceCount), top up with dart-throwing
  let fallbackAttempts = 0;
  while (positions.length < spaceCount && fallbackAttempts < MAX_PLACEMENT_ATTEMPTS) {
    fallbackAttempts++;
    const x = randomBetween(PADDING, 1 - PADDING);
    const y = randomBetween(PADDING, 1 - PADDING);
    if (!positions.some(p => Math.hypot(p.x - x, p.y - y) < MIN_DIST)) positions.push({ x, y });
  }

  // --- Create space objects ---
  const spaces: BoardSpaceConfig[] = positions.map((pos, i) => {
    if (i === 0) return { x: pos.x, y: pos.y, width: 0.065, height: 0.065, color: '#ff00ff', id: 'home', label: 'Home', connections: [], type: GAME_MODE.GET_ASSET };
    const def = typePool[Math.floor(Math.random() * typePool.length)];
    const label = pickLabel(def);
    return { x: pos.x, y: pos.y, width: def.size, height: def.size, color: def.color, id: `${def.type}-${label}-${uuidv4()}`, label, connections: [], type: def.type };
  });

  // --- Assign exactly one implore space (random non-home) ---
  const nonHome = spaces.filter(s => s.id !== 'home');
  const imploreSpace = nonHome[Math.floor(Math.random() * nonHome.length)];
  imploreSpace.type = GAME_MODE.IMPLORE;
  imploreSpace.label = 'Implore';
  imploreSpace.color = '#aa22aa';

  // --- Enforce constraints on non-home, non-implore spaces ---
  const adjustable = spaces.filter(s => s.id !== 'home' && s.id !== imploreSpace.id);

  // 1. Equal GET_ASSET / LOSE_ASSET counts
  const getAssetDef = spaceTypeDefs.find(d => d.type === GAME_MODE.GET_ASSET)!;
  const loseAssetDef = spaceTypeDefs.find(d => d.type === GAME_MODE.LOSE_ASSET)!;
  const applyDef = (s: BoardSpaceConfig, def: typeof getAssetDef) => {
    s.type = def.type; s.label = pickLabel(def); s.color = def.color; s.width = def.size; s.height = def.size;
  };
  {
    const gets = adjustable.filter(s => s.type === GAME_MODE.GET_ASSET);
    const loses = adjustable.filter(s => s.type === GAME_MODE.LOSE_ASSET);
    // Trim the larger side down to match the smaller, swapping excess to neutral (TRIVIA)
    const trivDef = spaceTypeDefs.find(d => d.type === GAME_MODE.TRIVIA)!;
    while (gets.length > loses.length) {
      const excess = gets.pop()!;
      applyDef(excess, trivDef);
    }
    while (loses.length > gets.length) {
      const excess = loses.pop()!;
      applyDef(excess, trivDef);
    }
    // Now both are equal — if both are 0, seed one of each from neutral spaces
    const neutrals = adjustable.filter(s => s.type !== GAME_MODE.GET_ASSET && s.type !== GAME_MODE.LOSE_ASSET && s.type !== GAME_MODE.SHOP);
    if (adjustable.filter(s => s.type === GAME_MODE.GET_ASSET).length === 0 && neutrals.length >= 2) {
      applyDef(neutrals[0], getAssetDef);
      applyDef(neutrals[1], loseAssetDef);
    }
  }

  // 2. Guarantee at least one SHOP
  const shopDef = spaceTypeDefs.find(d => d.type === GAME_MODE.SHOP)!;
  if (!adjustable.some(s => s.type === GAME_MODE.SHOP)) {
    // Replace a non-GET_ASSET / non-LOSE_ASSET space so we don't break the balance above
    const candidate = adjustable.find(s => s.type !== GAME_MODE.GET_ASSET && s.type !== GAME_MODE.LOSE_ASSET);
    if (candidate) applyDef(candidate, shopDef);
  }

  // --- Mark true islands (~3% per non-home, non-implore space) ---
  const islandIds = new Set<string>(
    spaces.slice(1).filter(s => s.id !== imploreSpace.id && Math.random() < 0.03).map(s => s.id)
  );
  const active = spaces.filter(s => !islandIds.has(s.id));

  // --- Hub: 10% board-wide chance — one non-implore, non-home space exits to every other active space ---
  const hubCandidates = active.filter(s => s.id !== 'home' && s.id !== imploreSpace.id);
  const hubId = Math.random() < 0.1 && hubCandidates.length > 1
    ? hubCandidates[Math.floor(Math.random() * hubCandidates.length)].id
    : null;

  // --- Build directed outgoing edges (skip implore for now) ---
  const outEdges = new Map<string, Set<string>>(spaces.map(s => [s.id, new Set()]));

  for (const space of active) {
    if (space.id === hubId || space.id === imploreSpace.id) continue;
    const others = active.filter(s => s.id !== space.id && s.id !== imploreSpace.id);
    const n = Math.random() < 0.4 ? 1 : Math.random() < 0.58 ? 2 : 3;
    proximitySample(others, space, n).forEach(t => outEdges.get(space.id)!.add(t.id));
  }

  if (hubId) {
    active.filter(s => s.id !== hubId && s.id !== imploreSpace.id).forEach(s => outEdges.get(hubId)!.add(s.id));
  }

  // --- Compute incoming ---
  const inEdges = new Map<string, Set<string>>(spaces.map(s => [s.id, new Set()]));
  const rebuildIn = () => {
    for (const set of inEdges.values()) set.clear();
    for (const [from, tos] of outEdges) for (const to of tos) inEdges.get(to)!.add(from);
  };
  rebuildIn();

  // --- Fix dead ends (excluding implore — handled separately) ---
  for (const space of active) {
    if (space.id === imploreSpace.id) continue;
    if (inEdges.get(space.id)!.size > 0 && outEdges.get(space.id)!.size === 0) {
      const target = active.find(s => s.id !== space.id && s.id !== imploreSpace.id);
      if (target) { outEdges.get(space.id)!.add(target.id); inEdges.get(target.id)!.add(space.id); }
    }
  }

  // --- Trim hub incoming to exactly 1 ---
  if (hubId) {
    const hubIn = inEdges.get(hubId)!;
    if (hubIn.size === 0) {
      const donor = active.find(s => s.id !== hubId && s.id !== imploreSpace.id);
      if (donor) { outEdges.get(donor.id)!.add(hubId); hubIn.add(donor.id); }
    }
    if (hubIn.size > 1) {
      const keep = [...hubIn][Math.floor(Math.random() * hubIn.size)];
      for (const from of [...hubIn]) {
        if (from === keep) continue;
        hubIn.delete(from);
        outEdges.get(from)!.delete(hubId);
        if (inEdges.get(from)!.size > 0 && outEdges.get(from)!.size === 0) {
          const fallback = active.find(s => s.id !== from && s.id !== hubId && s.id !== imploreSpace.id);
          if (fallback) { outEdges.get(from)!.add(fallback.id); inEdges.get(fallback.id)!.add(from); }
        }
      }
    }
  }

  rebuildIn();

  // --- Wire up implore ---

  // Entrance: closest active non-implore space by Euclidean distance
  const imploreEntrance = active
    .filter(s => s.id !== imploreSpace.id)
    .sort((a, b) =>
      Math.hypot(a.x - imploreSpace.x, a.y - imploreSpace.y) -
      Math.hypot(b.x - imploreSpace.x, b.y - imploreSpace.y)
    )[0];

  // Remove all existing incoming edges to implore, re-route displaced sources
  for (const from of [...inEdges.get(imploreSpace.id)!]) {
    outEdges.get(from)!.delete(imploreSpace.id);
    // Fix dead end if this was their only exit
    if (inEdges.get(from)!.size > 0 && outEdges.get(from)!.size === 0) {
      const fallback = active.find(s => s.id !== from && s.id !== imploreSpace.id);
      if (fallback) { outEdges.get(from)!.add(fallback.id); }
    }
  }
  // Set the single entrance
  outEdges.get(imploreEntrance.id)!.add(imploreSpace.id);
  rebuildIn();

  // Exit: furthest active non-implore space by BFS hop count (undirected)
  // Build undirected adjacency from outEdges for distance measurement
  const bfsFrom = (startId: string): Map<string, number> => {
    const dist = new Map<string, number>([[startId, 0]]);
    const queue = [startId];
    while (queue.length) {
      const cur = queue.shift()!;
      const d = dist.get(cur)!;
      // follow outEdges and inEdges (undirected BFS)
      const neighbours = [...outEdges.get(cur)!, ...(inEdges.get(cur) ?? [])];
      for (const n of neighbours) {
        if (!dist.has(n)) { dist.set(n, d + 1); queue.push(n); }
      }
    }
    return dist;
  };

  const imploreDistances = bfsFrom(imploreSpace.id);
  const imploreExit = active
    .filter(s => s.id !== imploreSpace.id)
    .sort((a, b) => (imploreDistances.get(b.id) ?? 0) - (imploreDistances.get(a.id) ?? 0))[0];

  outEdges.get(imploreSpace.id)!.clear();
  outEdges.get(imploreSpace.id)!.add(imploreExit.id);
  rebuildIn();

  // --- Guarantee shop has at least one entrance ---
  const shopSpaces = active.filter(s => s.type === GAME_MODE.SHOP);
  for (const shop of shopSpaces) {
    if (inEdges.get(shop.id)!.size === 0) {
      const donor = active.find(s => s.id !== shop.id && s.id !== imploreSpace.id);
      if (donor) { outEdges.get(donor.id)!.add(shop.id); inEdges.get(shop.id)!.add(donor.id); }
    }
  }

  // --- Write connections ---
  spaces.forEach(space => { space.connections = [...outEdges.get(space.id)!]; });

  return Object.fromEntries(spaces.map(s => [s.id, s])) as Board;
}

/**
 * Creates a demo board with exactly one of each landable space type arranged
 * in a circle, with bidirectional connections between every adjacent pair.
 */
export function createDemoBoard(): Board {
  const spaceTypes: Array<{ type: GAME_MODE; label: string; color: string }> = [
    { type: GAME_MODE.GET_ASSET,  label: 'Home',      color: '#ff00ff' },
    { type: GAME_MODE.TRIVIA,     label: 'Trivia',    color: '#8888ff' },
    { type: GAME_MODE.DUEL,       label: 'Duel',      color: '#558826' },
    { type: GAME_MODE.SHOP,       label: 'Shop',      color: '#00cc66' },
    { type: GAME_MODE.LOSE_ASSET, label: 'Lose',      color: '#ff2222' },
    { type: GAME_MODE.FRENZY,     label: 'Frenzy',    color: '#35a6b2' },
    { type: GAME_MODE.SLOTS,      label: 'Slots',     color: '#aa6622' },
    { type: GAME_MODE.IMPLORE,    label: 'Implore',   color: '#aa22aa' },
  ];

  const n = spaceTypes.length;
  const ids = spaceTypes.map((_, i) => i === 0 ? 'home' : uuidv4());

  const spaces: BoardSpaceConfig[] = spaceTypes.map((def, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const radius = 0.35;
    const prev = (i - 1 + n) % n;
    const next = (i + 1) % n;
    return {
      id: ids[i],
      label: def.label,
      type: def.type,
      color: def.color,
      x: parseFloat((0.5 + radius * Math.cos(angle)).toFixed(3)),
      y: parseFloat((0.5 + radius * Math.sin(angle)).toFixed(3)),
      width: 0.06,
      height: 0.06,
      connections: [ids[prev], ids[next]],
    };
  });

  return Object.fromEntries(spaces.map(s => [s.id, s])) as Board;
}