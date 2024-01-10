import { createSlice } from '@reduxjs/toolkit'

export type PlayerAction = {
  label: string,
  action: string,
  value: string,
  styles?: React.CSSProperties,
}

type GameState = {
  currentRound: number,
  currentMiniGame: string|null,
  currentPlayerActions: PlayerAction[]
}

const defaultState: GameState = {
  currentRound: 0,
  currentMiniGame: null,
  currentPlayerActions: []
}
export const gameSlice = createSlice({
  name: 'game',
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
    setCurrentPlayerActions: (state, action) => {
      state.currentPlayerActions = action.payload;
      return state;
    },
    clearCurrentPlayerActions: (state) => {
      state.currentPlayerActions = [];
      return state;
    },
  }
})

// Action creators are generated for each case reducer function
export const { incrementCurrentRound, setCurrentMiniGame, clearCurrentMiniGame, setCurrentRound, setCurrentPlayerActions, clearCurrentPlayerActions} = gameSlice.actions

export default gameSlice.reducer
