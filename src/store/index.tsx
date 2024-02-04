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
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: { }
      }
    })
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch