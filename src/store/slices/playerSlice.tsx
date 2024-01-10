import { createAction, createSlice, Action } from '@reduxjs/toolkit'
// const incrementBy = createAction<number>('incrementBy')
const setState = createAction<{players:Players}>('setState')

interface RejectedAction extends Action {
  error: Error
}

function isRejectedAction(action: Action): action is RejectedAction {
  return action.type.endsWith('rejected')
}

type Player = {
  name: string
  id: string
  points: number
  gold: number
  teamId: string
  items: string[]
  history: string[]
}

type Players = Player[]

const defaultState: Players = [
  { name: 'player1', id: 'player1', points: 0, gold: 0, teamId: 'team1', items: [], history: [] },
  { name: 'player2', id: 'player2', points: 0, gold: 0, teamId: 'team1', items: [], history: [] },
  { name: 'player3', id: 'player3', points: 0, gold: 0, teamId: 'team2', items: [], history: [] },
  { name: 'player4', id: 'player4', points: 0, gold: 0, teamId: 'team2', items: [], history: [] }
]
export const teamsSlice = createSlice({
  name: 'players',
  initialState: defaultState,
  reducers: {
    addPlayer: (state, action) => {
      state.push(action.payload)
    },
    removePlayer: (state, action) => {
      return state.filter((team) => team.id !== action.payload)
    },
    setPlayers: (state, action) => {
      return action.payload
    },
    renamePlayer: (state, action) => {
      const team = state.find((team) => team.id === action.payload.id)
      if (!team) return
      team.name = action.payload.name
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(setState, (state, action) => {
        return action.payload.players
        // action is inferred correctly here if using TS
      })
      .addMatcher(
        isRejectedAction,
        // `action` will be inferred as a RejectedAction due to isRejectedAction being defined as a type guard
        (state, action) => {
          console.error(action.error.message)
          return state
        }
      )
  },
})

// Action creators are generated for each case reducer function
export const { addPlayer, removePlayer, setPlayers, renamePlayer } = teamsSlice.actions

export default teamsSlice.reducer
