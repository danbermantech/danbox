import { useState } from "react";
import PixiClient from "./pixi/PixiClient";
import { Modal } from "@mui/material";
import { Map } from "@mui/icons-material";

const PlayerMap = () => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Modal className="w-screen h-screen flex justify-items-center items-center justify-center" onClose={()=>{setIsOpen(false)}} open={isOpen}>
            <div>
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