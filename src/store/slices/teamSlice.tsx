import { createSlice } from "@reduxjs/toolkit";
type Team = {
  name: string;
  id: string;
};
type Teams = Team[];

const defaultState: Teams = [
  { name: "team1", id: "team1" },
  { name: "team2", id: "team2" },
];
export const teamsSlice = createSlice({
  name: "teams",
  initialState: defaultState,
  reducers: {
    addTeam: (state, action) => {
      state.push(action.payload);
    },
    removeTeam: (state, action) => {
      return state.filter((team) => team.id !== action.payload);
    },
    setTeams: (state, action) => {
      return action.payload;
    },
    renameTeam: (state, action) => {
      const team = state.find((team) => team.id === action.payload.id);
      if (!team) return;
      team.name = action.payload.name;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addTeam, removeTeam, setTeams, renameTeam } = teamsSlice.actions;

export default teamsSlice.reducer;
