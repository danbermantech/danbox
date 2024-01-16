import { createSlice, Action } from "@reduxjs/toolkit";
import { BoardSpaceConfig, GameMode, type GameState, type RejectedAction } from "../types";
import setState from "$store/actions/setState";
import triggerNextRound from "$store/actions/triggerNextRound";
import addQueuedAction from "$store/actions/addQueuedAction";
import triggerNextQueuedAction from "$store/actions/triggerNextQueuedAction";
import boardLayout from "$constants/boardLayout";
import movePlayer from "$store/actions/movePlayer";
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
  board: boardLayout
  // currentPlayerActions: [],
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
    closeModal: (state) => {
      state.modalOpen = false;
      return state;
    },
    setActivePlayers: (state, action) => {
      state.activePlayers = action.payload;
      return state;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(setState, (state, action) => {
        console.log(action);
        return action.payload.game;
        // action is inferred correctly here if using TS
      })
      .addCase(triggerNextRound, (state) => {
        state.currentRound += 1;
        state.mode = 'MOVEMENT'
        state.modalOpen = false;
        // return state;
      })
      .addCase(addQueuedAction, (state, action) => {
        state.queuedActions.push(action.payload);
        return state;
      })
      .addCase(movePlayer, (state, action) => {
        const space = state.board.find((space)=>(space.id == action.payload.spaceId)) as BoardSpaceConfig;
        state.queuedActions.push({mode: GameMode.MINIGAME, modalContent:space.type, for: [action.payload.playerId], when:'start'});
        return state;
      })
      .addCase(triggerNextQueuedAction, (state) => {
        const nextAction = state.queuedActions.shift();
        console.log(nextAction)
        if(!nextAction) {
          state.currentRound += 1;
          state.mode = 'MOVEMENT'
          state.modalOpen = false;
          return;
        }
        if(nextAction.mode) state.mode = nextAction.mode;
        // if(nextAction.modalContent) {
          state.modalContent = nextAction.modalContent ?? null;
          state.modalOpen = !!nextAction.modalContent;
        // }
        if(nextAction.for){
          state.activePlayers = nextAction.for
        }
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
  closeModal,
  // setCurrentPlayerActions,
  // clearCurrentPlayerActions,
} = gameSlice.actions;

export default gameSlice.reducer;
