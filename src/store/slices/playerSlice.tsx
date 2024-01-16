import { createSlice, Action } from "@reduxjs/toolkit";
import { Player, Players, RejectedAction } from "../types";
import setState from "../actions/setState";
import { isEqual } from "lodash";
import movePlayer from "$store/actions/movePlayer";
import triggerNextRound from "$store/actions/triggerNextRound";
import triggerNextQueuedAction from "$store/actions/triggerNextQueuedAction";
import activateItem from "$store/actions/activateItem";

function isRejectedAction(action: Action): action is RejectedAction {
  return action.type.endsWith("rejected");
}

export const teamsSlice = createSlice({
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
        items: [],
        history: [],
        controls: [],
        image: "https://pixijs.io/pixi-react/img/bunny.png",
        hasMoved: false,
        ...action.payload,
      });
      return state;
    },
    removePlayer: (state, action) => {
      return state.filter((team) => team.id !== action.payload);
    },
    setPlayers: (_, action) => {
      return action.payload;
    },
    renamePlayer: (state, action) => {
      const team = state.find((team) => team.id === action.payload.id);
      if (!team) return;
      team.name = action.payload.name;
    },
    givePlayerControls: (state, action) => {
      const { playerId, controls } = action.payload;
      // const next = [...state];
      const player = state.find((player) => player.id === playerId || player.name === playerId);
      if (!player) return state;
      if(isEqual(player.controls, controls)) return state;
      player.controls = controls;
      if(!isEqual(controls, [])) player.hasMoved == true
      // return next;
    },
    givePlayerPoints: (state, action) => {
      const { playerId, points } = action.payload;
      const player = state.find((player) => player.id === playerId || player.name === playerId);
      if (!player) return state;
      player.points += points;
    },
    givePlayerGold: (state, action) => {
      const { playerId, gold } = action.payload;
      const player = state.find((player) => player.id === playerId || player.name === playerId);
      if (!player) return state;
      player.gold += gold;
    },
    givePlayerItem: (state, action) => {
      const { playerId, item } = action.payload;
      const player = state.find((player) => player.id === playerId || player.name === playerId);
      if (!player) return state;
      player.items.push(item);
    },
    clearAllPlayerControls: (state) => {
      state.forEach((_,i) => {
        state[i].controls = [];
      });
      return state;
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
      // fromPlayer.items = fromPlayer.items.filter((i) => i !== item);
      // toPlayer.items.push(item);
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
        if(!player) return state;
        player.spaceId = action.payload.spaceId;
        player.hasMoved = true;
      })
      .addCase(triggerNextQueuedAction, (state) => {
        state.forEach((_, i)=>{
          state[i].hasMoved = false;
        })
      })
      .addCase(triggerNextRound, (state) => {
        state.forEach((_, i)=>{
          state[i].hasMoved = false;
        })
      })
      .addCase(activateItem, (state, action) => {
        const player = state.find((player)=>(player.id == action.payload.playerId));
        if(!player) return;
        switch(action.payload.item){
          case('shrimp'):{
            if(!player.hasMoved) return
            // player.items.splice(player.items.findIndex((item)=>(item.name == 'shrimp')), 1);
            player.hasMoved = false;
            break;
          }
          case('magic hat'):{
            const notMe = state.filter((player)=>(player.id !== action.payload.playerId));
            const randomPlayer = notMe[Math.floor(Math.random()*notMe.length)];
            const playerLocation = state.find((player)=>(player.id == action.payload.playerId))?.spaceId;
            const partnerLocation = state.find((player)=>(player.id == randomPlayer.id))?.spaceId;
            if(!playerLocation || !partnerLocation) return;
            state.find((player)=>(player.id == action.payload.playerId))!.spaceId = partnerLocation;
            state.find((player)=>(player.id == randomPlayer.id))!.spaceId = playerLocation;
            break;
          }
        }
        player.items = player.items.filter((item)=>(item.name !== action.payload.item));
        })
      .addMatcher(
        isRejectedAction,
        // `action` will be inferred as a RejectedAction due to isRejectedAction being defined as a type guard
        (state, action) => {
          console.error(action.error.message);
          return state;
        },
      );
  },
});

// Action creators are generated for each case reducer function
export const { addPlayer, removePlayer, givePlayerGold, givePlayerPoints, givePlayerItem, handleTransfer, setPlayers, renamePlayer, givePlayerControls, clearAllPlayerControls } =
  teamsSlice.actions;

export default teamsSlice.reducer;
