import { Modal } from "@mui/material";
import ModalContents from "./ModalContents";
import { useSelector } from "react-redux";
import { StoreData } from "$store/types";

const HostModal = ()=>{

  const modalOpen = useSelector((state:StoreData)=>state.game.modalOpen);
  
return (<Modal className="w-screen h-screen flex justify-items-center items-center justify-center" open={modalOpen}>
<div className="flex max-w-fit w-max min-w-max bg-gray-300 min-h-[300px] h-max border-8 border-solid p-8 rounded-2xl border-green-700 overflow-hidden text-ellipsis justify-center items-center gap-4">
  <div className="contents select-none">
  <ModalContents />
  </div>
</div>
</Modal>)
}

export default HostModal