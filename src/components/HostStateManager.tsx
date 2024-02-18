import { useCallback, useEffect, useState } from "react";
import { usePeer } from "$hooks/usePeer";
import movePlayer from "$store/actions/movePlayer";
import { removeEffect, setPlayerControls, setPlayerInstructions, } from "$store/slices/playerSlice";
import { StoreData } from "$store/types";
import activateItem from "$store/actions/activateItem";
import usePeerDataReceived from "$hooks/useDataReceived";
import useAudio from "$hooks/useAudio";
import {v4 as uuidv4 } from 'uuid'
import { ThunkAction, UnknownAction } from "@reduxjs/toolkit";
import movePlayerFinal from "$store/actions/movePlayerFinal";
import { useAppDispatch, useAppSelector } from "$store/hooks";
import triggerNextQueuedAction from "$store/actions/triggerNextQueuedAction";
import { isEqual } from "lodash";
import addQueuedAction from "$store/actions/addQueuedAction";

const HostStateManager = () => {
  const gameState = useAppSelector((state) => state.game);
  const players = useAppSelector((state) => state.players);
  const currentRound = useAppSelector((state) => state.game.currentRound);
  const board = useAppSelector((state) => state.board);
  const dispatch = useAppDispatch();

  const [movementActionId] = useState(()=>uuidv4())

  const movementListener = useCallback((data:{type:string, payload:{action:string, playerId: string, value:string}})=>{
    const player = players.find((player)=>(player.id == data.payload.playerId || player.name == data.payload.playerId));
    if(!player) return;

    //@ts-expect-error I didn't type these yet
    dispatch<ThunkAction<void, StoreData, unknown, UnknownAction>>((disp, getState)=>{
      const state = getState();
      console.log(state);
      
      if(!player.movesRemaining) return;
      disp(movePlayer({playerId: player.id, spaceId: data.payload.value}))
      const nextPlayer = getState().players.find((player)=>(player.id == data.payload.playerId));
      if(nextPlayer && nextPlayer?.movesRemaining > 0 || !nextPlayer) return;
      console.log(data.payload.value)
      disp(addQueuedAction({mode: board[data.payload.value].type, for: [player.id], when:'start'}))
      disp(movePlayerFinal({playerId: player.id, spaceId: data.payload.value}))
      console.log(getState().players.reduce((acc, player)=>(acc + player.movesRemaining), 0))
      if(getState().players.reduce((acc, player)=>(acc + player.movesRemaining), 0) == 0){
        setTimeout(()=>{

          disp(triggerNextQueuedAction())
        },2000)
      }
      })
  },[players, dispatch, board]); 

  usePeerDataReceived<{playerId:string, value: string, action:string}>(movementListener, movementActionId)

  usePeerDataReceived<{playerId: string, value:{item:string, [x:string]:string}, target:string}>(data=>{
      dispatch(activateItem({user: data.payload.playerId,target: data.payload.target, item: data.payload.value.item, value: data.payload.value}))
  }, 'activateItem')

  usePeerDataReceived<{playerId: string, value:string}>((data)=>{
    dispatch(removeEffect({playerId: data.payload.playerId, value: data.payload.value}))
  }, 'removeEffect')
  usePeerDataReceived<UnknownAction>(data=>{
    console.log(data);
    dispatch(data.payload)
  }, 'admin')

  const {triggerSoundEffect} = useAudio();

  useEffect(()=>{
    let cb;
    if(gameState.mode == 'MOVEMENT'){
      cb = triggerSoundEffect('movementSong')
    }
    console.log(cb);
    return cb;
  },[gameState.mode, triggerSoundEffect])

  useEffect(()=>{
    players.forEach((player)=>{
      if(gameState.mode !== 'MOVEMENT' || gameState.currentRound <= 0) return
      if(player.movesRemaining <= 0){
        dispatch(setPlayerInstructions({playerId: player.id, instructions: `Please wait...`}))
        dispatch(setPlayerControls({playerId: player.id, controls:[]}));
      }else{
        const mySpace = board[player.spaceId];
        const connections = mySpace?.connections
        if(!connections) return;
        const availableSpaces = Object.values(board).filter((space)=>connections.includes(space.id));
        const options = availableSpaces.map((connection)=>({label:connection.label, value:connection.id, action:movementActionId}));
        dispatch(setPlayerInstructions({playerId: player.id, instructions: `${player.movesRemaining} moves remaining`}))
        if(isEqual(player.controls, options)) return;
        dispatch(setPlayerControls({playerId: player.id, controls:options}))
      }
    })
  },[currentRound, gameState.mode, gameState.currentRound, players, board, dispatch, movementActionId])

  const sendPeersMessage = usePeer((cv) => cv.sendPeersMessage) as (
    data:{type: string, payload: {value:Partial<StoreData>}},
  ) => void;
  const setOnConnectSendValue = usePeer((cv) => cv.setOnConnectSendValue) as (
    value: unknown,
  ) => void;
  const peerReady = usePeer((cv) => cv.peerReady) as boolean;
  useEffect(() => {
    if (!peerReady) return;
    setOnConnectSendValue && setOnConnectSendValue({state:players});
    sendPeersMessage &&
      sendPeersMessage({ type: "state", payload: { value: {players, game: gameState, board} } });
  }, [sendPeersMessage, setOnConnectSendValue, peerReady, players, gameState, board]);
  return null;

};

export default HostStateManager;
