import { createSlice } from "@reduxjs/toolkit";
import { Board } from "../types";
import setState from "$store/actions/setState";

import restart from "$store/actions/restart";


const defaultState: Board = {};
export const gameSlice = createSlice({
  name: "board",
  initialState: defaultState,
  reducers: {
    setBoardLayout: (state, action) => {
      state = action.payload;
      return state;
    },
    createSpace: (state, action) => {
      state[action.payload.id] = action.payload;
      return state;
    },
    removeSpace: (state, action) => {
      delete state[action.payload];
      Object.values(state).forEach((space) => {
        space.connections = space.connections.filter((id) => id !== action.payload);
      });
      return state;
    },
    createPath: (state, action) => {
      state[action.payload.from].connections.push(action.payload.to);
      return state;
    },
    removePath: (state, action) => {
      state[action.payload.from].connections = state[action.payload.from].connections.filter((id) => id !== action.payload.to);
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setState, (_, action) => {
        console.log(action);
        return action.payload.board;
        // action is inferred correctly here if using TS
      })
      .addCase(restart, ()=>{
        return defaultState;
      })
  },
});

// Action creators are generated for each case reducer function
export const {
  setBoardLayout,
  createSpace,
  removeSpace,
  createPath,
  removePath,
} = gameSlice.actions;

export default gameSlice.reducer;
