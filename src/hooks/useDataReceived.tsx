import { useEffect } from "react";
import { usePeer } from "./usePeer";

export type PeerDataPayload = {
  action: string;
  value: string;
  peerId: string;
};

export type PeerDataCallbackPayload<T=PeerDataPayload> = {
    type: string;
    payload: T;
  }


function usePeerDataReceived<T=PeerDataPayload> (callback: (data:PeerDataCallbackPayload<T>, peerId:string)=>void, id:string){
  const onDataReceived = usePeer((cv) => cv.onDataReceived) as (
    cb: (
      data: {type:string, payload:T},
      peerId: string
    ) => void,
    id:string
  ) => void;

  const removeOnDataReceivedListener = usePeer((cv) => cv.removeOnDataReceivedListener) as (listenerId:string)=>void
  
  useEffect(()=>{
    onDataReceived &&
    onDataReceived((data, peerId)=>{
      if(data.type == id){
       return callback(data, peerId)
      }
    }, id);
    return ()=>{removeOnDataReceivedListener(id)}
  })
}

export default usePeerDataReceived;