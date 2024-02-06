import { lazy } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material"
import useMe from '$hooks/useMe'
import { Fullscreen } from "@mui/icons-material";

const PlayerMap = lazy(async()=>await import("./PlayerMap"));
const PlayerHeader = () =>{
  const me = useMe();
  return (<AppBar>
        <Toolbar variant="dense" sx={{display:'flex', justifyItems: 'stretch'}}>
          <div className="flex items-center flex-grow pt-2">
          <img src={me?.image} width={48} height={48} className="rounded-full " />
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