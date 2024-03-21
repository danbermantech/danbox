import { lazy, useState } from "react";
import { AppBar, Modal, Toolbar, Typography } from "@mui/material"
import useMe from '$hooks/useMe'
import { Fullscreen } from "@mui/icons-material";
import CharacterCarousel from "./CharacterCarousel";
import { usePeer } from "$hooks/usePeer";

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
          <div className="flex items-center flex-grow pt-2">
          <button onClick={()=>{setModalOpen(true)}}>
          <img src={me?.image} width={48} height={48} className="rounded-full " />
          </button>
          <Modal open={modalOpen} className=" p-4 flex w-full h-screen min-w-full min-h-full flex-col justify-center items-center" onClose={()=>setModalOpen(false)}>
            <div className=" bg-gradient-to-b md:max-w-xl bg-slate-800 drop-shadow w-full p-4 rounded-xl">
              <div className="text-3xl text-center text-white">Select your avatar</div>
            <CharacterCarousel selected={me?.image} onChange={onAvatarChanged} />
            </div>
          </Modal>
          <Typography variant="h4" fontWeight={800} fontFamily="dancing script" color="inherit" component="div">
            {me?.name}
          </Typography>
          </div>
          <PlayerMap />
          <Fullscreen className="flex-shrink" sx={{width:48, height:48}} onClick={()=>{
            if(document.fullscreenElement){
              document.exitFullscreen();
            } else {
              document.documentElement.requestFullscreen();
            }
          }} />
        </Toolbar>
  </AppBar>)
}
export default PlayerHeader