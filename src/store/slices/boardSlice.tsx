import { createSlice } from "@reduxjs/toolkit";
import { Board, BoardSpaceConfig } from "../types";
import setState from "$store/actions/setState";

import restart from "$store/actions/restart";
// import { random } from "lodash";

const minDistance = 0.2;

function distanceBetween(space:BoardSpaceConfig, otherSpace:BoardSpaceConfig){
return Math.sqrt((space.x - otherSpace.x)**2 + (space.y - otherSpace.y)**2);
}


function boardHasConflicts(board: Board) {
  let result = false;
  Object.values(board).forEach((space) => {
    Object.values(board)
      .filter((otherSpace) => space.id !== otherSpace.id)
      .forEach((otherSpace) => {
        const distanceBetweenSpaces = distanceBetween(space, otherSpace)
        if (distanceBetweenSpaces < minDistance) {
          result = true;
        }
      });
  })
  return result;
}

function randomPosition(){
  return Math.min(1 - minDistance, Math.max(minDistance, Math.random()));
}

function shuffleBoard(state:Board){
  console.log(state);
  if(!boardHasConflicts(state)) return state;
  Object.entries(state).forEach(([spaceId, space], index) => {
  let conflictPotentiallyResolved = false;
    Object.entries(state)
    .filter(([otherSpaceId], otherIndex)=>spaceId !== otherSpaceId && otherIndex < index)
    .forEach(([, otherSpace]) => {
      if(conflictPotentiallyResolved) return;
      if(distanceBetween(space, otherSpace) < minDistance){
        state[spaceId].x = randomPosition();
        state[spaceId].y = randomPosition();
        conflictPotentiallyResolved = true;
      }
    });
  });
  return shuffleBoard(state);
}

const defaultState: Board = {};
export const gameSlice = createSlice({
  name: "board",
  initialState: defaultState,
  reducers: {
    setBoardLayout: (state, action) => {
      // const board = action.payload as Board;
      state = action.payload;
        shuffleBoard(state);
      
      Object.values(state).forEach((space) => {
        // if(space.connections.length > 0) return;
        if(space.connections.length > 0) return;
        const otherSpaces = Object.values(state).filter((otherSpace)=>otherSpace.id !== space.id);
        otherSpaces.sort((a, b)=>distanceBetween(space, a) - distanceBetween(space, b));
        space.connections = [
          otherSpaces[0].id, 
          otherSpaces[1].id, 
          // otherSpaces[Math.floor(Math.random() * otherSpaces.length-2)+ 2].id
        ];
      });

      return state;
    },
    randomizeBoard: (state) => {
      for (const space of Object.values(state)) {
        space.x = randomPosition()
        space.y = randomPosition();
      }
      for (const space of Object.values(state)){
        const otherSpaces = Object.values(state).filter((otherSpace)=>otherSpace.id !== space.id);
        otherSpaces.sort((a, b)=>distanceBetween(space, a) - distanceBetween(space, b));
        space.connections = []
        for(let i = 0; i < 5; i++){
          if(Math.random()>0.5){
            space.connections.push(otherSpaces[i].id)
          }
        }
        if(space.connections.length === 0){
          space.connections.push(otherSpaces[0].id);
        }
      }
      return shuffleBoard(state);
    },
    createSpace: (state, action) => {
      state[action.payload.id] = action.payload;
      return state;
    },
    moveSpace: (state, action) => {
      state[action.payload.id].x = Number(action.payload.x);
      state[action.payload.id].y = Number(action.payload.y);
      // return shuffleBoard(state);
      // return state;
    },
    shiftSpace: (state, action) => {
      state[action.payload.id].x += Number(action.payload.x);
      state[action.payload.id].y += Number(action.payload.y);
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
  randomizeBoard,
  moveSpace,
  shiftSpace,
} = gameSlice.actions;

export default gameSlice.reducer;
