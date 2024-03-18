import { createSlice } from "@reduxjs/toolkit";
import { Board, BoardSpaceConfig, GAME_MODE } from "../types";
import setState from "$store/actions/setState";
import removeSpace from "$store/actions/removeSpace";
import restart from "$store/actions/restart";
import activateItem from "$store/actions/activateItem";
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
      // {label: 'id', type: InputType.TEXT, value: 'id', key:'id'},
      // {label: 'label', type: InputType.TEXT, value: 'label', key:'label'},
      // {label: 'x', type: InputType.NUMBER, value: 0, key:'x'},
      // {label: 'y', type: InputType.NUMBER, value: 0, key:'y'},
      // {label: 'color', type: InputType.TEXT, value: '#000000', key:'color'},
      // {label: 'width', type: InputType.NUMBER, value: 0.06, key:'width'},
      // {label: 'height', type: InputType.NUMBER, value: 0.06, key:'height'},
      // {label: 'type', type: InputType.SELECT, options: Object.entries(GAME_MODE).map(([key, value])=>({id:key, label:value})), value: GAME_MODE.TRIVIA, key:'type'},
      // {label: 'Path From 1', value:'home', type: InputType.SELECT, options: 'spaces', key:'pathsFrom1'},
      // {label: 'Path From 2', value:'', type: InputType.SELECT, options: 'spaces', key:'pathsFrom2'},
      // {label: 'Path From 3', value:'', type: InputType.SELECT, options: 'spaces', key:'pathsFrom3'},
      // {label: 'Path To 1', value:'home', type: InputType.SELECT, options: 'spaces', key:'pathsTo1'},
      // {label: 'Path To 2', value:'', type: InputType.SELECT, options: 'spaces', key:'pathsTo2'},
      // {label: 'Path To 3', value:'', type: InputType.SELECT, options: 'spaces', key:'pathsTo3'}
      // {label: 'connections', type: InputType.SELECT, options: 'spaces', value: [], key:'connections'},
      const {id, label, x, y, color, width, height, type, pathsFrom1, pathsFrom2, pathsFrom3, pathsTo1, pathsTo2, pathsTo3} = action.payload;
      state[id] = {
        id,
        label,
        x:Number(x),
        y:Number(y),
        color,
        width:Number(width),
        height:Number(height),
        type,
        connections: [pathsTo1, pathsTo2, pathsTo3].filter((path)=>path !== ''),
      };

      [pathsFrom1, pathsFrom2, pathsFrom3].filter((path)=>path !== '').forEach((path)=>{
        state[path].connections.push(id);
      });
      // const {}
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
    // removeSpace: (state, action) => {
    //   delete state[action.payload.id];
    //   Object.values(state).forEach((space) => {
    //     space.connections = space.connections.filter((id) => id !== action.payload.id);
    //   });
    //   return state;
    // },
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
      .addCase(removeSpace, (state, action) => {
        delete state[action.payload.id];
        Object.values(state).forEach((space) => {
          space.connections = space.connections.filter((id) => id !== action.payload.id);
        });
        return state;
      })
      .addCase(activateItem, (state, action) => {
        const {payload} = action;
        switch(action.payload.item){
          case('traffic engineer'):{
            const {value} = payload as unknown as {value:{action: string, from: string, to: string}};
            switch(value.action){
              case('add'):
                state[value.from].connections.push(value.from);
                return state;
              case('remove'):
                state[value.to].connections = state[value.to].connections.filter((id) => id !== value.from);
                return state;
            }
            break;
          }
          case('demolition crew'):{
            const {value} = payload as unknown as {value:{id: string}}
            delete state[value.id];
                Object.values(state).forEach((space) => {
                  space.connections = space.connections.filter((id) => id !== value.id);
                });
                return state;
            break;
          }
          case('construction crew'):{
            const {value} = payload as unknown as {value:{label:string, color:string, type:GAME_MODE, pathsFrom1:string, pathsFrom2:string, pathsFrom3:string, pathsTo1:string, pathsTo2:string, pathsTo3:string}};
            state[value.label] = {
              id: value.label,
              label: value.label,
              x: randomPosition(),
              y: randomPosition(),
              color: value.color,
              width: 0.06,
              height: 0.06,
              type: value.type,
              connections: [value.pathsTo1, value.pathsTo2, value.pathsTo3].filter((path)=>path !== ''),
            };
            [value.pathsFrom1, value.pathsFrom2, value.pathsFrom3].filter((path)=>path !== '').forEach((path)=>{
              state[path].connections.push(value.label);
            });
            return state;
          }
        }
      })
  },
});

// Action creators are generated for each case reducer function
export const {
  setBoardLayout,
  createSpace,
  createPath,
  removePath,
  randomizeBoard,
  moveSpace,
  shiftSpace,
} = gameSlice.actions;

export default gameSlice.reducer;
