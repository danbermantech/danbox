import { createSlice, Action } from "@reduxjs/toolkit";
import { BoardSpaceConfig, GameMode, type GameState, type RejectedAction } from "../types";
import setState from "$store/actions/setState";
import addQueuedAction from "$store/actions/addQueuedAction";
import triggerNextQueuedAction from "$store/actions/triggerNextQueuedAction";
import boardLayout from "$constants/boardLayout";
import movePlayerFinal from "$store/actions/movePlayerFinal";
import restart from "$store/actions/restart";
function isRejectedAction(action: Action): action is RejectedAction {
  return action.type.endsWith("rejected");
}

const defaultState: GameState = {
  currentRound: 0,
  currentMiniGame: null,
  modalContent: null,
  mode: 'REGISTRATION',
  modalOpen: true,
  queuedActions: [],
  activePlayers: [],
  board: boardLayout,
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
    setModalContent: (state, action) => {
      state.modalContent = action.payload;
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
    closeModal: (state) => {
      state.modalOpen = false;
      state.modalContent = null;
      return state;
    },
    setActivePlayers: (state, action) => {
      state.activePlayers = action.payload;
      return state;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(setState, (_, action) => {
        console.log(action);
        return action.payload.game;
        // action is inferred correctly here if using TS
      })
      .addCase(addQueuedAction, (state, action) => {
        state.queuedActions.push(action.payload);
        return state;
      })
      .addCase(movePlayerFinal, (state, action) => {
        const space = state.board.find((space)=>(space.id == action.payload.spaceId)) as BoardSpaceConfig;
        console.log(action, space.type, {...space});
        state.queuedActions.push({mode: GameMode.MINIGAME, modalContent:space.type, for: [action.payload.playerId], when:'start'});
        return state;
      })
      .addCase(restart, ()=>{
        return defaultState;
      })
      .addCase(triggerNextQueuedAction, (state) => {
        const nextAction = state.queuedActions.shift();
        console.log(nextAction)
        if(!nextAction) {
          state.currentRound += 1;
          if(state.currentRound > state.maxRounds){
            state.mode = 'GAME_OVER'
            state.modalOpen = true;
            return;
          }
          state.mode = 'MOVEMENT'
          state.modalOpen = false;
          return;
        }
        if(nextAction.mode) state.mode = nextAction.mode;
        state.modalContent = nextAction.modalContent ?? null;
        state.modalOpen = !!nextAction.modalContent;
        if(nextAction.for) state.activePlayers = nextAction.for
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
  setModalContent,
  setGameMode,
  openModal,
  closeModal,
  setMaxRounds,
} = gameSlice.actions;

export default gameSlice.reducer;
