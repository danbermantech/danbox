import { useState } from "react";
import PixiClient from "./pixi/PixiClient";
import { Modal } from "@mui/material";
import { Map } from "@mui/icons-material";
import { useBoardDimensionsContext } from "$contexts/BoardDimensionsContext";

const PlayerMap = () => {

  const [isOpen, setIsOpen] = useState(false);
  const {containerRef} = useBoardDimensionsContext();

  return (
    <div>
      <Modal className="w-screen h-screen flex justify-items-center items-center justify-center" onClose={()=>{setIsOpen(false)}} open={isOpen}>
            <div ref={containerRef} className="w-1/2 h-4/5 flex-grow">
            <PixiClient />
            </div>
      </Modal>
      <Map className="flex-grow" sx={{width:48, height:48}} onClick={()=>{
        setIsOpen(true);
      }} />
    </div>
  );


}

export default PlayerMap