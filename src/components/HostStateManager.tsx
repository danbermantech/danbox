import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePeer } from "$hooks/usePeer";
import movePlayer from "$store/actions/movePlayer";
import { setPlayerControls } from "$store/slices/playerSlice";
import { StoreData } from "$store/types";
import triggerNextQueuedAction from "$store/actions/triggerNextQueuedAction";
import activateItem from "$store/actions/activateItem";
import usePeerDataReceived from "$hooks/useDataReceived";
import useAudio from "$hooks/useAudio";
import {v4 as uuidv4 } from 'uuid'

const HostStateManager = () => {
  const gameState = useSelector((state:StoreData) => state.game);
  const players = useSelector((state:StoreData) => state.players);
  const currentRound = useSelector((state:StoreData) => state.game.currentRound);
  const board = useSelector((state:StoreData) => state.game.board);
  const dispatch = useDispatch();

  const [movementActionId] = useState(()=>uuidv4())

  const movementListener = useCallback((data:{type:string, payload:{action:string, playerId: string, value:string}})=>{
    const player = players.find((player)=>(player.id == data.payload.playerId || player.name == data.payload.playerId));
    if(!player) return;
    dispatch(movePlayer({playerId: player.id, spaceId: data.payload.value}));
    dispatch(setPlayerControls({playerId: player.id, controls:[]}));
    if(players.filter((player)=>(player.hasMoved)).length == players.length - 1){
        dispatch(triggerNextQueuedAction())
    }
  },[players, dispatch]); 

  usePeerDataReceived<{playerId:string, value: string, action:string}>(movementListener, movementActionId)

  usePeerDataReceived<{playerId: string, value:string}>(data=>{
      dispatch(activateItem({user: data.payload.playerId,target: data.payload.playerId, item: data.payload.value}))
  }, 'activateItem')

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
      if(player.hasMoved){
        dispatch(setPlayerControls({playerId: player.id, controls:[]}));
      }else{
        const mySpace = board?.find((space)=>(space.id == player.spaceId));
        const connections = mySpace?.connections
        if(!connections) return;
        const availableSpaces = board.filter((space)=>connections.includes(space.id));
        const options = availableSpaces.map((connection)=>({label:connection.label, value:connection.id, action:movementActionId}));
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
      sendPeersMessage({ type: "state", payload: { value: {players, game: gameState} } });
  }, [sendPeersMessage, setOnConnectSendValue, peerReady, players, gameState]);
  return null;

};

export default HostStateManager;
