import triggerNextQueuedAction from "$store/actions/triggerNextQueuedAction";
import { clearAllPlayerControls, setPlayerControls, setPlayerInstructions } from "$store/slices/playerSlice";
import { BoardSpaceConfig, StoreData } from "$store/types";
import { createSelector } from "@reduxjs/toolkit";
import { isEqual } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import useAudio from "$hooks/useAudio";
import usePeerDataReceived, { PeerDataCallbackPayload } from "$hooks/useDataReceived";
import {v4 as uuidv4} from 'uuid'
import { setBoardLayout } from "$store/slices/boardSlice";
import {boardLayout, boardLayout2, generateRandomBoard, createDemoBoard } from "$constants/boardLayout";
import Logo from "./Logo";
import { useRegistration } from "$contexts/RegistrationContext";

const playerSelector = createSelector(state=>state.players, 
  (players:StoreData['players']) => players.map((player)=>({id:player.id, name:player.name, image:player.image, controls: player.controls})),
  );

const RADIUS = 38; // % of container

const RegistrationScreen = () => {
  const players = useSelector(playerSelector);
  const dispatch = useDispatch();
  const { selectedBoard } = useRegistration();

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

  const {playBackgroundMusic, triggerSoundEffect} = useAudio();

  useEffect(()=>{if(players.length > 0) return triggerSoundEffect('victory')},[players, triggerSoundEffect])
  useEffect(()=>{ return playBackgroundMusic(); },[playBackgroundMusic])
  
  const peerDataCallback = useCallback((data:PeerDataCallbackPayload) => {
    const boardOptions:Record<string, ()=>Record<string, BoardSpaceConfig>> = {
      '1': ()=>boardLayout,
      '2': ()=>boardLayout2,
      'demo': createDemoBoard,
      'random': generateRandomBoard,
    };
    if(data.payload.value == "start"){
      dispatch(setBoardLayout(boardOptions[selectedBoard]()));
      dispatch(clearAllPlayerControls());
      dispatch(triggerNextQueuedAction());
    }
  },[dispatch, selectedBoard])

  usePeerDataReceived(peerDataCallback, actionId)

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div className="z-10 pointer-events-none select-none">
        <Logo />
      </div>
      {players.map((player, i) => {
        const angle = (i / Math.max(players.length, 1)) * 2 * Math.PI - Math.PI / 2;
        const x = 50 + RADIUS * Math.cos(angle);
        const y = 50 + RADIUS * Math.sin(angle);
        return (
          <div
            key={player.id}
            className="absolute flex flex-col items-center animate-wiggle animate-infinite animate-ease-in-out"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <img src={player.image} width={80} height={80} className="rounded-full border-4 border-white shadow-xl" />
            <span className="mt-1 font-titan font-bold text-white text-sm text-center max-w-24 truncate drop-shadow-lg">
              {player.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default RegistrationScreen;
// import { clearAllPlayerControls, setPlayerControls, setPlayerInstructions } from "$store/slices/playerSlice";
// import { BoardSpaceConfig, StoreData } from "$store/types";
// import { createSelector } from "@reduxjs/toolkit";
// import { isEqual } from "lodash";
// import { useCallback, useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux"
// import QRShare from "./QRShare";
// import useAudio from "$hooks/useAudio";
// import usePeerDataReceived, { PeerDataCallbackPayload } from "$hooks/useDataReceived";
// import {v4 as uuidv4} from 'uuid'
// import MuteToggle from "./MuteToggle";
// import { setBoardLayout } from "$store/slices/boardSlice";
// import {boardLayout, boardLayout2, generateRandomBoard, createDemoBoard } from "$constants/boardLayout";
// import Logo from "./Logo";
// // import NSFWToggle from "./NSFWToggle";
// const playerSelector = createSelector(state=>state.players, 
//   (players:StoreData['players']) => players.map((player)=>({id:player.id, name:player.name, image:player.image, controls: player.controls})),
//   );

// const RegistrationScreen = () => {
//   const players = useSelector(playerSelector);
//   const myShortId = usePeer((cv) => cv.myShortId) as string;
//   const dispatch = useDispatch();

//   const [selectedBoard, setSelectedBoard] = useState('random');
//   const [actionId] = useState(()=>uuidv4())
//   useEffect(()=>{
//     if(players.length > 0){
//       if(!isEqual(players[0].controls, [{label: 'START', value: 'start', action: actionId}]))
//       dispatch(setPlayerInstructions({playerId: players[0].id, instructions: 'Press START to begin'}));
//       players.filter((player)=>(player.id !== players[0].id)).forEach((player)=>{
//         dispatch(setPlayerInstructions({playerId: player.id, instructions: 'Please wait...'}));
//       })
//       dispatch(setPlayerControls({playerId: players[0].id, controls: [{label: 'START', value: 'start', action: actionId}]}));
//     }
//   },[players, dispatch, actionId])

//   const {playBackgroundMusic, triggerSoundEffect} = useAudio();

//   useEffect(()=>{if(players.length > 0) return triggerSoundEffect('victory')},[players, triggerSoundEffect])
//   useEffect(()=>{
//     return playBackgroundMusic();
//   },[playBackgroundMusic])
  
//   const peerDataCallback = useCallback((data:PeerDataCallbackPayload) => {
//     // console.log(data);
//     const boardOptions:Record<string, ()=>Record<string, BoardSpaceConfig>> = {
//       '1': ()=>boardLayout,
//       '2': ()=>boardLayout2,
//       'demo': createDemoBoard,
//       'random': generateRandomBoard,
//     };
//       if(data.payload.value == "start"){
//         dispatch(setBoardLayout(boardOptions[selectedBoard]()));
//         dispatch(clearAllPlayerControls());
//         dispatch(triggerNextQueuedAction());
//       }
//   },[dispatch, selectedBoard])

//   usePeerDataReceived(peerDataCallback, actionId)

//   return (
//     <div className="text-black flex flex-col gap-2 to-black-400 items-center">
//       {/* <h1 className="text-4xl text-bold text-black text-center p-4"> */}
//         <Logo />
//         {/* </h1> */}
//         <div className="flex gap-4 items-center font-titan">
//         <div className="flex gap-4 items-center flex-col bg-white p-4 rounded-xl bg-opacity-50 shadow-xl w-96 h-96 justify-center">
//           <h2 className=" text-4xl text-bold text-black text-center">Scan this QR code</h2> 
//           <QRShare />
//         </div>
//         <div className="text-3xl bg-white p-4 rounded-xl bg-opacity-50 aspect-square flex items-center justify-center font-semibold">OR</div>
//         <div className="flex gap-4 items-center flex-col bg-white p-4 rounded-xl bg-opacity-50 shadow-xl w-96 h-96 justify-center text-4xl max-w-full text-center">
//           <div className="">Visit</div> 
//           <div className="text-2xl font-bold font-mono bg-white p-2 rounded-xl bg-opacity-50 shadow-xl">
//             Danbox.DanBerman.dev 
//           </div>
//            <div> and use code</div>
//           <div className="select-text text-center font-extrabold font-mono text-8xl bg-white p-2 rounded-xl bg-opacity-50 shadow-xl">
//             {myShortId}
//           </div>
//         </div>
//         </div>
//       <MuteToggle />
//       {/* <NSFWToggle /> */}
//       <select className="mt-4" value={selectedBoard} onChange={(e) => setSelectedBoard(e.target.value)}>
//         <option value={'random'}>Random!</option>
//         <option value={'demo'}>Demo</option>
//         <option value={'1'}>Path to Heaven</option>
//         <option value={'2'}>Dream Gate</option>
//       </select>

//       <div className="flex flex-row justify-evenly">
//       {players.map((player)=>{
//         return (
//           <div key={player.id} className="animate-wiggle animate-infinite animate-ease-in-out flex p-4 border-black border-4 rounded-xl bg-gradient-radial from-slate-400 to-slate-200 items-center flex-col">
//             <h3 className="text-4xl font-bold">{player.name}</h3>
//             <img src={player.image} width="100" height="100"/>
//           </div>
//         )
//       })}
//       </div>
//     </div>
//   );
// }

// export default RegistrationScreen;