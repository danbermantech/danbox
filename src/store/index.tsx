import { configureStore } from "@reduxjs/toolkit";
import teamsSlice from "./slices/teamSlice";
import playerSlice from "./slices/playerSlice";
import gameProgressSlice from "./slices/gameProgressSlice";

const store = configureStore({
  reducer: {
    teams: teamsSlice,
    players: playerSlice,
    game: gameProgressSlice,
  },
});

export default store;
