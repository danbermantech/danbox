import { createSlice, Action } from "@reduxjs/toolkit";
import { GAME_MODE, type GameState, type RejectedAction } from "../types";
import setState from "$store/actions/setState";
import addQueuedAction from "$store/actions/addQueuedAction";
import triggerNextQueuedAction from "$store/actions/triggerNextQueuedAction";
import restart from "$store/actions/restart";
function isRejectedAction(action: Action): action is RejectedAction {
  return action.type.endsWith("rejected");
}

const defaultState: GameState = {
  currentRound: 0,
  currentMiniGame: null,
  mode: GAME_MODE.REGISTRATION,
  modalOpen: true,
  queuedActions: [],
  activePlayers: [],
  nsfw: false,
  // board: [],
  maxRounds: 10,
};
export const gameSlice = createSlice({
  name: "game",
  initialState: defaultState,
  reducers: {
    incrementCurrentRound: (state) => {
      state.currentRound += 1;
      return state;
    },
    setCurrentMiniGame: (state, action) => {
      state.currentMiniGame = action.payload;
      return state;
    },
    clearCurrentMiniGame: (state) => {
      state.currentMiniGame = null;
      return state;
    },
    setCurrentRound: (state, action) => {
      state.currentRound = action.payload;
      return state;
    },
    setGameMode: (state, action) => {
      state.mode = action.payload;
      return state;
    },
    openModal: (state) => {
      state.modalOpen = true;
      return state;
    },
    setMaxRounds: (state, action) => {
      state.maxRounds = action.payload;
      return state;
    },
    endMinigame: (state) => {
      // state.modalOpen = false;
      state.mode = null;
    },
    setGameState: (_, action) => {
      return action.payload;
    },
    setNSFW: (state, action) => {
      state.nsfw = action.payload;
      return state;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(setState, (_, action) => {
        // console.log(action);
        return action.payload.game;
        // action is inferred correctly here if using TS
      })
      .addCase(addQueuedAction, (state, action) => {
        // console.log('adding', action.payload)
        if(action.payload.when == 'start') state.queuedActions.unshift(action.payload);
        else state.queuedActions.push(action.payload);

        return state;
      })
      .addCase(restart, ()=>{
        return defaultState;
      })
      .addCase(triggerNextQueuedAction, (state) => {
        const nextAction = state.queuedActions.shift();
        // console.log(nextAction)
        if(!nextAction) {
          state.currentRound += 1;
          if(state.currentRound > state.maxRounds){
            state.mode = GAME_MODE.GAME_OVER
            state.modalOpen = true;
            return;
          }
          state.mode = GAME_MODE.MOVEMENT
          state.modalOpen = false;
          return;
        }
        if(nextAction.mode) state.mode = nextAction.mode;
        state.mode = nextAction.mode ?? null;
        state.modalOpen = !!nextAction.mode;
        if(nextAction.for) {state.activePlayers = nextAction.for}else{state.activePlayers = []}
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
export const {
  incrementCurrentRound,
  setCurrentMiniGame,
  clearCurrentMiniGame,
  setCurrentRound,
  setGameMode,
  openModal,
  endMinigame,
  setMaxRounds,
  setGameState,
  setNSFW
} = gameSlice.actions;

export default gameSlice.reducer;
