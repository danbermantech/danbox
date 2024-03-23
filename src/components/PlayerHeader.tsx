import { lazy, useState } from "react";
import { AppBar, Modal, Toolbar, Typography } from "@mui/material"
import useMe from '$hooks/useMe'
import { Fullscreen } from "@mui/icons-material";
import CharacterCarousel from "./CharacterCarousel";
import { usePeer } from "$hooks/usePeer";
import { gold, points } from "$assets/images";

const PlayerMap = lazy(async()=>await import("./PlayerMap"));
const PlayerHeader = () =>{
  const me = useMe();

  const [modalOpen, setModalOpen] = useState(false);

  const sendPeersMessage = usePeer((peer) => peer.sendPeersMessage) as (message: unknown) => void;

  const onAvatarChanged = (sprite:string)=>{
    setModalOpen(false);
    sendPeersMessage({type: 'avatar_changed', payload: {playerId:me.id, sprite}})
  }



  return (<AppBar>
        <Toolbar variant="dense" sx={{display:'flex', justifyItems: 'stretch'}}>
          <div className="flex items-center flex-grow pt-0 gap-2">
          <button className="contents" onClick={()=>{setModalOpen(true)}}>
          <img src={me?.image} width={40} height={40} className="rounded-full " />
          <Typography variant="h5" fontWeight={800} fontFamily="dancing script" color="inherit" component="div">
            {me?.name}
          </Typography>
          </button>
          <Modal open={modalOpen} className=" p-4 flex w-full h-screen min-w-full min-h-full flex-col justify-center items-center" onClose={()=>setModalOpen(false)}>
            <div className=" bg-gradient-to-b md:max-w-xl bg-slate-800 drop-shadow w-full p-4 rounded-xl">
              <div className="text-3xl text-center text-white">Select your avatar</div>
            <CharacterCarousel selected={me?.image} onChange={onAvatarChanged} />
            </div>
          </Modal>
          </div>
          <div className="flex gap-2 px-2">

          <div className="w-max gap-2 font-bold shadow top bg-white bg-opacity-20 p-2 rounded-xl flex flex-row items-center ">
              <img src={gold} width={24} height={24} />
              <div>{me?.gold}</div>
            </div>
            <div className="w-max gap-2 font-bold shadow bg-white bg-opacity-20 p-2 rounded-xl flex flex-row items-center ">
              <img src={points} width={24} height={24} />
              <div>{me?.points}</div>
            </div>
          </div>

          <PlayerMap />
          {
            window.matchMedia("(display-mode: browser)").matches &&
            <Fullscreen className="flex-shrink" sx={{width:48, height:48}} onClick={()=>{
              if(document.fullscreenElement){
                document.exitFullscreen();
              } else {
                document.documentElement.requestFullscreen();
              }
            }} />
          }
        </Toolbar>
  </AppBar>)
}
export default PlayerHeader