import { createSlice, Action } from "@reduxjs/toolkit";
import { Player, Players, RejectedAction } from "../types";
import setState from "../actions/setState";
import { isEqual } from "lodash";
import movePlayer from "$store/actions/movePlayer";
import triggerNextQueuedAction from "$store/actions/triggerNextQueuedAction";
import activateItem from "$store/actions/activateItem";
import restart from "$store/actions/restart";
import movePlayerFinal from "$store/actions/movePlayerFinal";
import items from "$constants/items";
import {v4 as uuidv4} from 'uuid'
import { playerPlaceholder } from "$assets/images";
import removeSpace from "$store/actions/removeSpace";

function isRejectedAction(action: Action): action is RejectedAction {
  return action.type.endsWith("rejected");
}

const defaultMovesPerRound = 2;

export const playerSlice = createSlice({
  name: "players",
  initialState: [] as Players,
  reducers: {
    addPlayer: (state, action) => {
      console.log(state, action)
      const player = state.findIndex((player)=>player.name == action.payload.name);
      if(player > -1){
        state[player].id = action.payload.id;
        return state;
      } 
      state.push({
        name: "unknown",
        id: "unknown",
        points: 0,
        gold: 0,
        teamId: "unknown",
        spaceId: "home",
        previousSpaceId: "home",
        effects:[],
        items: [],
        history: [],
        controls: [],
        image: playerPlaceholder,
        movesPerRound: defaultMovesPerRound,
        hasMoved: false,
        instructions:"",
        movesRemaining: defaultMovesPerRound,
        ...action.payload,
      });
      return state;
    },
    changePlayerImage: (state, action) => {
      console.log('setting player image')
      const player = state.find((player) => player.id === action.payload.playerId);
      console.log(state, action.payload.playerId)
      console.log(player)
      if (!player) return state;
      player.image = action.payload.image;
    
    },
    changePlayerName: (state, action) => {
      console.log('changing')
      const player = state.find((player) => player.id === action.payload.playerId);
      if (!player) return state;
      player.name = action.payload.name;
    },
    removePlayer: (state, action) => {
      return state.filter((player) => player.id !== action.payload.playerId);
    },
    setPlayers: (_, action) => {
      return action.payload;
    },
    renamePlayer: (state, action) => {
      const player = state.find((player) => player.id === action.payload.playerId);
      if (!player) return;
      player.name = action.payload.name;
    },
    setPlayerControls: (state, action) => {
      const { playerId, controls } = action.payload;

      function giveControls(id:string){
        const player = state.find((player) => player.id === id || player.name === id);
        if (!player) return state;
        if(isEqual(player.controls, controls)) return state;
        player.controls = controls;
        if(!isEqual(controls, [])) player.hasMoved == true
      }

      if(typeof(playerId) == 'string'){
        giveControls(playerId);
      }else if(Array.isArray(playerId)){
        playerId.forEach((id)=>{
          giveControls(id);
        })
      }
    },
    givePlayerPoints: (state, action) => {
      const { playerId, points } = action.payload;
      const player = state.find((player) => player.id === playerId || player.name === playerId);
      if (!player) return state;
      player.points += Number(points);
    },
    givePlayerGold: (state, action) => {
      const { playerId, gold } = action.payload;
      const player = state.find((player) => player.id === playerId || player.name === playerId);
      if (!player) return state;
      player.gold += Number(gold);
    },
    givePlayerItem: (state, action) => {
      const { playerId, item } = action.payload;
      let value = item
      if(typeof(item) == 'string') {
        const temp = items.find((i)=>i.name == item); 
        if(!temp) return;
        value = {...temp, id: uuidv4()}
      }
      console.log(item, value, items)
      const player = state.find((player) => player.id === playerId || player.name === playerId);
      if (!player) return state;
      player.items.push(value);
    },
    clearAllPlayerControls: (state) => {
      state.forEach((_,i) => {
        state[i].controls = [];
      });
      return state;
    },
    setMovesPerRound: (state, action) => {
      const { playerId, movesPerRound } = action.payload;
      const player = state.findIndex((player) => player.id === playerId || player.name === playerId);
      if (!player) return state;
      state[player].movesPerRound = movesPerRound;
      return state;
    },
    setPlayerInstructions: (state, action) => {
      const { playerId, instructions } = action.payload;
      const player = state.find((player) => player.id === playerId || player.name === playerId);
      if (!player) return state;
      player.instructions = instructions;
    },
    removeEffect: (state, action) =>{
      const { playerId, effect } = action.payload;
      const player = state.find((player) => player.id === playerId);
      if (!player) return state;
      console.log("removing ", effect, "from", player.name)
      player.effects = player.effects.filter(eff=> eff == effect)
    },
    handleTransfer: (state, action) => {
      const { type, asset, target, from } = action.payload;
      const fromPlayer = state.find((player) => player.name == from || player.id == from);
      const toPlayer = state.find((player) => player.name === target || player.id == target);
      if (!fromPlayer || !toPlayer) return state;
      const [assetType, qty] = (asset??'').split(' ').reverse() as ['gold' | 'points' | 'items', '1'|'5'|'10'|'all'|undefined];
      switch(type){
        case('swap'):{
          switch(assetType){
            case('gold'):{
              const fromAsset = fromPlayer.gold;
              const toAsset = toPlayer.gold as Player['gold'];
              fromPlayer.gold = toAsset;
              toPlayer.gold = fromAsset;
              break;
            }
            case('points'):{
              const fromAsset = fromPlayer.points;
              const toAsset = toPlayer.points as Player['points'];
              fromPlayer.points = toAsset;
              toPlayer.points = fromAsset;
              break;
            }
            case('items'):{
              const fromAsset = fromPlayer.items;
              const toAsset = toPlayer.items as Player['items'];
              fromPlayer.items = toAsset;
              toPlayer.items = fromAsset;
              break;
            }
            default:
              break;
          }
          break;
        }case('give'):{
          switch(assetType){
            case('gold'):{
              const quantity = qty == 'all' ? fromPlayer.gold : parseInt(qty ?? '0');
              fromPlayer.gold -= quantity;
              toPlayer.gold += quantity;
              break;
            }
            case('points'):{
              const quantity = qty == 'all' ? fromPlayer.points : parseInt(qty ?? '0');
              fromPlayer.points -= quantity;
              toPlayer.points += quantity;
              break;
            }
            case('items'):{
              const quantity = qty == 'all' ? fromPlayer.items.length : parseInt(qty ?? '0');
              const items = fromPlayer.items.splice(0, quantity);
              toPlayer.items.push(...items);
              break;
            }
            default:
              break;
          }
          break;
        }case('take'):{
          switch(assetType){
            case('gold'):{
              const quantity = qty == 'all' ? toPlayer.gold : parseInt(qty ?? '0');
              toPlayer.gold -= quantity;
              fromPlayer.gold += quantity;
              break;
            }
            case('points'):{
              const quantity = qty == 'all' ? toPlayer.points : parseInt(qty ?? '0');
              toPlayer.points -= quantity;
              fromPlayer.points += quantity;
              break;
            }
            case('items'):{
              const quantity = qty == 'all' ? toPlayer.items.length : parseInt(qty ?? '0');
              const items = toPlayer.items.splice(0, quantity);
              fromPlayer.items.push(...items);
              break;
            }
          }
          break;
        }default:{
          break;
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(setState, (_, action) => {
        console.log(action);
        return action.payload.players;
        // action is inferred correctly here if using TS
      })
      .addCase(movePlayer, (state, action) => {
        const player = state.find((player)=>(player.id == action.payload.playerId));
        if(!player || player.movesRemaining <= 0) return state;
        player.previousSpaceId= player.spaceId;
        player.spaceId = action.payload.spaceId;
        player.movesRemaining -= 1;
      })
      .addCase(movePlayerFinal, (state, action) => {
        const player = state.find((player)=>(player.id == action.payload.playerId));
        if(!player || player.movesRemaining <= 0) return state;
        player.controls = [];
        player.hasMoved = true;
      })
      .addCase(triggerNextQueuedAction, (state) => {
        state.forEach((_, i)=>{
          state[i].hasMoved = false;
          state[i].movesRemaining = state[i].movesPerRound
          state[i].controls = [];
          state[i].instructions = '';
        })
      })
      .addCase(activateItem, (state, action) => {
        const player = state.find((player)=>(player.id == action.payload.user));
        if(!player) return;
        switch(action.payload.item){
          case('shrimp'):{
            if(!action.payload.target) return;
            if(action.payload.target){
              const targetIndex = state.findIndex((player)=>(player.id == action.payload.target));
              state[targetIndex].effects?.push('SHRIMPED')
            }
            break;
          }
          case('magic hat'):{
            if(!action.payload.target) return;
            const userIndex = state.findIndex((player)=>(player.id == action.payload.user));
            const targetIndex = state.findIndex((player)=>(player.id == action.payload.target));
            const playerLocation = state[userIndex].spaceId;
            const targetLocation = state[targetIndex].spaceId;
            if(!playerLocation || !targetLocation) return;
            state[userIndex].spaceId = targetLocation;
            state[targetIndex].spaceId = playerLocation;
            break;
          }
          case('teleport'):{
            if(!action.payload.target) return;
            const userIndex = state.findIndex((player)=>(player.id == action.payload.user));
            state[userIndex].spaceId = action.payload.target;
            break;
          }
          case('soup'):{
            if(!action.payload.target) return;
            (state.find((player)=>player.id == action.payload.target) as Player).movesRemaining += 1
            break;
          }
          case('souper soup'):{
            if(!action.payload.target) return;
            (state.find((player)=>player.id == action.payload.target) as Player).movesPerRound += 1
            break;
          }
          case('magicHand'):{
            // if(!action.payload.target) return;
            const player = state.find((player)=>player.id == action.payload.user);
            if(!player) return;
            const target = state.find((player)=>player.id == action.payload.target);
            if(!target) return;
            player.items.push(...target.items);
            target.items = [];
            player.gold += target.gold;
            target.gold = 0;
            player.points += target.points;
            target.points = 0;
            break;
          }
          case('cheat'):{
            if(!action.payload.target) return;
            const targetIndex = state.findIndex((player)=>(player.id == action.payload.target));
            state[targetIndex].effects?.push('CHEAT')
            break;
          }
          case('demolition crew'):{
            const {id} = action.payload.value as {id: string};
            return state.map((player)=>({...player, spaceId: player.spaceId == id ? 'home' : player.spaceId, previousSpaceId: player.previousSpaceId == id ? 'home' : player.previousSpaceId}))
          }
        }
        player.items = player.items.filter((item)=>(item.name !== action.payload.item));
        })
      .addCase(restart, (state)=>{
        return state.map((player)=>({...player, spaceId: 'home', previousSpaceId: 'home', points: 0, gold: 0, items:[], movesRemaining: defaultMovesPerRound, hasMoved:false, controls:[]}))
      })
      .addCase(removeSpace, (state, action)=>{
        return state.map((player)=>({...player, spaceId: player.spaceId == action.payload.id ? 'home' : player.spaceId, previousSpaceId: player.previousSpaceId == action.payload.id ? 'home' : player.previousSpaceId}))
      })
      .addMatcher(
        isRejectedAction,
        (state, action) => {
          console.error(action.error.message);
          return state;
        },
      );
  },
});

// Action creators are generated for each case reducer function
export const { addPlayer, changePlayerImage, changePlayerName, removePlayer, removeEffect, givePlayerGold, givePlayerPoints, givePlayerItem, handleTransfer, setPlayers, renamePlayer, setPlayerInstructions, setPlayerControls, clearAllPlayerControls } =
  playerSlice.actions;

export default playerSlice.reducer;
