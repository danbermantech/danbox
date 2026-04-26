import { useCallback, useEffect, useRef, useState } from "react";
import { usePeer } from "$hooks/usePeer";
import useGameBackup from "$hooks/useGameBackup";
import movePlayer from "$store/actions/movePlayer";
import { changePlayerImage, removeEffect, setPlayerControls, setPlayerInstructions, } from "$store/slices/playerSlice";
import { GAME_MODE, StoreData } from "$store/types";
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

  const [movementActionId, setMovementActionId] = useState(()=>'movement:'+uuidv4())
  const {triggerSoundEffect} = useAudio();
  useGameBackup();
  const handledValues = useRef<string[]>([]);
  const movementListener = useCallback((data:{type:string, payload:{action:string, playerId: string, value:string}})=>{
    const player = players.find((player)=>(player.id == data.payload.playerId || player.name == data.payload.playerId));
    if(!player || gameState.mode !== GAME_MODE.MOVEMENT || gameState.isPaused) return;
    
    const lastColon = data.payload.value.lastIndexOf(':');
    const spaceId = data.payload.value.slice(lastColon + 1);
    if(handledValues.current.includes(data.payload.value)) return;
    handledValues.current.push(data.payload.value);
    triggerSoundEffect('dink')
    //@ts-expect-error I didn't type these yet
    dispatch<ThunkAction<void, StoreData, unknown, UnknownAction>>((disp, getState)=>{
      // const state = getState();
      // console.log(state);
      
      if(!player.movesRemaining) return;
      disp(movePlayer({playerId: player.id, spaceId}))
      const nextPlayer = getState().players.find((player)=>(player.id == data.payload.playerId));
      if(nextPlayer && nextPlayer?.movesRemaining > 0 || !nextPlayer) return;
      // console.log(data.payload.value)
      disp(addQueuedAction({mode: board[spaceId].type, for: [player.id], when:'end'}))
      disp(movePlayerFinal({playerId: player.id, spaceId}))
      // console.log(getState().players.reduce((acc, player)=>(acc + player.movesRemaining), 0))
      if(getState().players.reduce((acc, player)=>(acc + player.movesRemaining), 0) == 0){
        setTimeout(()=>{
          if((getState() as StoreData).game.isPaused) return;
          if(getState().players.reduce((acc, player)=>(acc + player.movesRemaining), 0) > 0) return;
          disp(triggerNextQueuedAction())
        },2000)
      }
      })
  },[players, dispatch, board, gameState.mode, gameState.isPaused, triggerSoundEffect]); 

  usePeerDataReceived<{playerId:string, value: string, action:string}>(movementListener, movementActionId)

  usePeerDataReceived<{playerId: string, value:{item:string, [x:string]:string}, target:string}>(data=>{
      dispatch(activateItem({user: data.payload.playerId,target: data.payload.target, item: data.payload.value.item, id: data.payload.value.id, value: data.payload.value}))
  }, 'activateItem')

  usePeerDataReceived<{playerId: string, value:string}>((data)=>{
    dispatch(removeEffect({playerId: data.payload.playerId, value: data.payload.value}))
  }, 'removeEffect')
  usePeerDataReceived<UnknownAction>(data=>{
    // console.log(data);
    dispatch(data.payload)
  }, 'admin')
  usePeerDataReceived<{sprite:string, playerId:string}>(data=>{
    // console.log(data);
    dispatch(changePlayerImage({playerId: data.payload.playerId, image: data.payload.sprite}))
  }, 'avatar_changed');

  useEffect(()=>{
    if(gameState.mode == 'MOVEMENT') {
      setMovementActionId('movement:'+uuidv4())
      // handledValues.current = [];
      return triggerSoundEffect(`movement`)
    }
  },[gameState.mode, triggerSoundEffect])

  // Track per-player visit state. A new visit token is generated whenever
  // spaceId or movesRemaining changes, giving each unique visit fresh option UUIDs.
  const visitStateRef = useRef<Record<string, {spaceId: string; movesRemaining: number; token: string}>>({});
  const optionsCacheRef = useRef<Record<string, ReturnType<typeof Array.prototype.map>>>({});

  useEffect(()=>{
    players.forEach((player)=>{
      if(gameState.mode !== 'MOVEMENT' || gameState.currentRound <= 0) return
      if(player.movesRemaining <= 0){
        if(player.instructions !== 'Please wait...') dispatch(setPlayerInstructions({playerId: player.id, instructions: `Please wait...`}))
        if(!isEqual(player.controls, [])) dispatch(setPlayerControls({playerId: player.id, controls:[]}));
      }else{
        const mySpace = board[player.spaceId];
        const connections = mySpace?.connections
        if(!connections) return;
        const availableSpaces = Object.values(board).filter((space)=>connections.includes(space.id));

        // Regenerate visit token whenever the player's position or move count changes
        const prev = visitStateRef.current[player.id];
        if(!prev || prev.spaceId !== player.spaceId || prev.movesRemaining !== player.movesRemaining){
          visitStateRef.current[player.id] = {spaceId: player.spaceId, movesRemaining: player.movesRemaining, token: uuidv4()};
        }
        const cacheKey = `${movementActionId}:${visitStateRef.current[player.id].token}`;

        if(!optionsCacheRef.current[cacheKey]){
          optionsCacheRef.current[cacheKey] = availableSpaces.map((connection)=>({label:connection.label, value:`${uuidv4()}:${connection.id}`, action:movementActionId, style: {backgroundColor: connection.color, fontWeight: 700, color:'white'}, className:'uppercase'}));
          if(optionsCacheRef.current[cacheKey].length == 0){
            optionsCacheRef.current[cacheKey] = [{label:mySpace.label, value:`${uuidv4()}:${mySpace.id}`, action:movementActionId, style: {backgroundColor: mySpace.color, color:'white', fontWeight:600}, className:'uppercase'}];
          }
        }
        const options = optionsCacheRef.current[cacheKey];

        const instructions = `${player.movesRemaining} moves remaining`;
        if(player.instructions !== instructions) dispatch(setPlayerInstructions({playerId: player.id, instructions}))
        if(isEqual(player.controls, options)) return;
        dispatch(setPlayerControls({playerId: player.id, controls:options}))
      }
    })
  },[currentRound, gameState.mode, gameState.currentRound, players, board, dispatch, movementActionId])

  const sendPeersMessage = usePeer((cv) => cv.sendPeersMessage) as (
    data:{type: string, payload: {value:unknown}},
  ) => void;

  const peerReady = usePeer((cv) => cv.peerReady) as boolean;

  const playersDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingPlayersRef = useRef<typeof players | null>(null);

  useEffect(()=>{
    if(!peerReady || !sendPeersMessage) return;
    pendingPlayersRef.current = players;
    if(playersDebounceRef.current) return;
    playersDebounceRef.current = setTimeout(()=>{
      playersDebounceRef.current = null;
      if(pendingPlayersRef.current)
        sendPeersMessage({type: 'players', payload: {value: pendingPlayersRef.current}});
    }, 20);
  },[peerReady, sendPeersMessage, players])

  const gameDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingGameRef = useRef<typeof gameState | null>(null);

  useEffect(()=>{
    if(!peerReady || !sendPeersMessage) return;
    pendingGameRef.current = gameState;
    if(gameDebounceRef.current) return;
    gameDebounceRef.current = setTimeout(()=>{
      gameDebounceRef.current = null;
      if(pendingGameRef.current)
        sendPeersMessage({type: 'game', payload: {value: pendingGameRef.current}});
    }, 20);
  },[peerReady, sendPeersMessage, gameState])

  const boardDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingBoardRef = useRef<typeof board | null>(null);

  useEffect(()=>{
    if(!peerReady || !sendPeersMessage) return;
    pendingBoardRef.current = board;
    if(boardDebounceRef.current) return;
    boardDebounceRef.current = setTimeout(()=>{
      boardDebounceRef.current = null;
      if(pendingBoardRef.current)
        sendPeersMessage({type: 'board', payload: {value: pendingBoardRef.current}});
    }, 20);
  },[peerReady, sendPeersMessage, board])

  return null;

};

export default HostStateManager;
