import { usePeer } from "$hooks/usePeer";
import triggerNextQueuedAction from "$store/actions/triggerNextQueuedAction";
// import triggerNextRound from "$store/actions/triggerNextRound";
import { clearAllPlayerControls, givePlayerControls } from "$store/slices/playerSlice";
import { StoreData } from "$store/types";
import { createSelector } from "@reduxjs/toolkit";
import { isEqual } from "lodash";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
// import QRCode from "react-qr-code";
import QRShare from "./QRShare";

const playerSelector = createSelector(state=>state.players, 
  (players:StoreData['players']) => players.map((player)=>({id:player.id, name:player.name, image:player.image, controls: player.controls})),
  );

const RegistrationScreen = () => {
  const players = useSelector(playerSelector);
  const myPeerId = usePeer((cv) => cv.myPeerId) as string;
  const dispatch = useDispatch();
  useEffect(()=>{
    if(players.length > 0){
      if(!isEqual(players[0].controls, [{label: 'START', value: 'start', action: 'start'}]))
      dispatch(givePlayerControls({playerId: players[0].id, controls: [{label: 'START', value: 'start', action: 'start'}]}));
    }
  },[players, dispatch])

  const onDataReceived = usePeer((cv) => cv.onDataReceived) as (
    cb: (
      data: {
        // peerId: string;
        type: string;
        payload: { action: string; value: string, peerId: string };
      }
    ) => void,
    id:string
  ) => void;

  const removeOnDataReceivedListener = usePeer((cv) => cv.removeOnDataReceivedListener) as (listenerId:string)=>void

  useEffect(()=>{
    onDataReceived &&
    onDataReceived(
      (data) => {
        console.log(data);
        if (data.type == "playerAction"){
          if(data.payload.value == "start"){
            dispatch(clearAllPlayerControls());
            dispatch(triggerNextQueuedAction());
          }
        }
      },
      'registrationScreen'
    );
    return ()=>{removeOnDataReceivedListener('registrationScreen')}
  },[onDataReceived, dispatch, removeOnDataReceivedListener])



  return (
    <div className="text-black flex flex-col gap-2">
      <h1 className="text-4xl text-bold text-black text-center">Welcome to DanBox</h1>
      <h2 className="text-2xl text-bold text-black text-center">Scan this QR code to join the game</h2> 
      <h2 className="select-text text-center">{myPeerId}</h2>
      <QRShare />
      <div className="flex flex-row justify-evenly">
      {players.map((player)=>{
        return (
          <div key={player.id} className="flex items-center flex-col">
            <h3>{player.name}</h3>
            <img src={player.image} width="50" height="50"/>
          </div>
        )
      })}
      </div>
    </div>
  );
}

export default RegistrationScreen;