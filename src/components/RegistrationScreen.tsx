import { usePeer } from "$hooks/usePeer";
import triggerNextQueuedAction from "$store/actions/triggerNextQueuedAction";
import { clearAllPlayerControls, setPlayerControls, setPlayerInstructions } from "$store/slices/playerSlice";
import { StoreData } from "$store/types";
import { createSelector } from "@reduxjs/toolkit";
import { isEqual } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import QRShare from "./QRShare";
import useAudio from "$hooks/useAudio";
import usePeerDataReceived, { PeerDataCallbackPayload } from "$hooks/useDataReceived";
import {v4 as uuidv4} from 'uuid'
const playerSelector = createSelector(state=>state.players, 
  (players:StoreData['players']) => players.map((player)=>({id:player.id, name:player.name, image:player.image, controls: player.controls})),
  );

const RegistrationScreen = () => {
  const players = useSelector(playerSelector);
  const myShortId = usePeer((cv) => cv.myShortId) as string;
  const dispatch = useDispatch();
  
  const [actionId] = useState(()=>uuidv4())
  useEffect(()=>{
    if(players.length > 0){
      if(!isEqual(players[0].controls, [{label: 'START', value: 'start', action: actionId}]))
      dispatch(setPlayerInstructions({playerId: players[0].id, instructions: 'Press START to begin'}));
      players.filter((player)=>(player.id !== players[0].id)).forEach((player)=>{
        dispatch(setPlayerInstructions({playerId: player.id, instructions: 'Please wait...'}));
      })
      dispatch(setPlayerControls({playerId: players[0].id, controls: [{label: 'START', value: 'start', action: actionId}]}));
    }
  },[players, dispatch, actionId])

  const {triggerSoundEffect} = useAudio();

  useEffect(()=>{
    return triggerSoundEffect('registration')
  },[triggerSoundEffect])
  
  const peerDataCallback = useCallback((data:PeerDataCallbackPayload) => {
    console.log(data);
      if(data.payload.value == "start"){
        dispatch(clearAllPlayerControls());
        dispatch(triggerNextQueuedAction());
      }
  },[dispatch])

  usePeerDataReceived(peerDataCallback, actionId)

  const {initializeAudio }= useAudio()

  return (
    <div className="text-black flex flex-col gap-2 to-black-400">
      <h1 className="text-4xl text-bold text-black text-center p-4">
        <div className="font-cursive font-bold text-8xl -rotate-12 -translate-x-8 text-transparent bg-clip-text bg-gradient-to-br from-pink-600 to-violet-400">
          Welcome to 
        </div>
        <br />
          <div className="font-bold text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-violet-600 text-8xl rotate-12 translate-x-12 -translate-y-5 skew-x-12 back">
            DanBox
          </div>
        </h1>
      <h2 className="text-2xl text-bold text-black text-center">Scan this QR code to join the game</h2> 
      <h2 className="select-text text-center font-extrabold font-mono text-8xl">{myShortId}</h2>
      <QRShare />
        <button onClick={initializeAudio}>Initialize</button>
      <div className="flex flex-row justify-evenly">
      {players.map((player)=>{
        return (
          <div key={player.id} className="flex p-4 border-black border-4 rounded-xl bg-gradient-radial from-slate-400 to-slate-200 items-center flex-col">
            <h3 className="text-4xl font-bold">{player.name}</h3>
            <img src={player.image} width="100" height="100"/>
          </div>
        )
      })}
      </div>
    </div>
  );
}

export default RegistrationScreen;