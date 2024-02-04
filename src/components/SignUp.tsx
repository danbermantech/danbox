import { usePeer } from "$hooks/usePeer";
import { InputLabel, Input } from "@mui/material"
import { useCallback, useEffect, useState } from "react";
import { getCookie, useCookie } from "utilities/cookies";
import sprites from "$assets/sprites";
import { useLocation, useSearchParams } from "react-router-dom";

const SignUp = ()=>{
  const connect = usePeer((cv) => cv.connect) as (
    hostId: string,
    options: {deviceName: string, image:string},
    onPeerConnect: (peer: unknown) => void,
  ) => void;
  const [searchParams] = useSearchParams();
  const [hostId, setHostId] = useState(searchParams.get("hostId") ?? '');
  const peerConnected = usePeer((cv) => cv.peerConnected) as boolean;
  const peerErrors = usePeer((cv) => cv.peerErrors) as {message:string}[];
  const [playerName, setPlayerName] = useCookie('playerName');
  const [playerSprite, setPlayerSprite] = useCookie('playerSprite');
  const [tempName, setTempName] = useState(playerName ?? '');
  const [selectedSprite, setSelectedSprite] = useState(playerSprite ?? '')

  const [alert, setAlert] = useState("");
  const myShortId = usePeer((cv) => cv.myShortId) as string;
  // const myPeerId = usePeer((cv) => cv.myPeerId) as string;
  useEffect(()=>{
    if(peerErrors.length){
      setAlert(peerErrors[peerErrors.length-1].message)
    }
  },[peerErrors])
  
  const join = useCallback(() => {
    if (typeof connect == "function" && hostId && !peerConnected) {

      if(tempName.length > 1) {
      // onPeerConnect(console.log);
      console.log('joining', tempName, selectedSprite)
      connect(hostId.toLocaleUpperCase(), {deviceName: tempName, image:selectedSprite}, (x) => {
        console.log(x);
      });
      setPlayerName(tempName);
      setPlayerSprite(selectedSprite);
      // setConnected(() => true);
    } else {
      setAlert('Please enter a name')
    }
  }
  }, [connect, hostId, peerConnected, tempName,selectedSprite, setPlayerName, setPlayerSprite ]);

  const location = useLocation();
  useEffect(()=>{
    if(location.pathname == '/play' && !peerConnected && getCookie('lastHostId') == searchParams.get('hostId') && getCookie('playerName') && getCookie('playerSprite')){
      connect(searchParams.get('hostId') as string, {deviceName: getCookie('playerName'), image: getCookie('playerSprite')}, (x) => {
        console.log(x);
      });
      // sendPeersMessage({type: 'connection_accepted', payload: {deviceName: getCookie('playerName'), image: getCookie('playerSprite')}});
    }
  }, [location.pathname, peerConnected, searchParams, connect])

  return (
    <div className="w-full flex items-center justify-items-center content-center justify-center">
      {/* <div className="flex flex-row flex-grow w-full items-center justify-items-center content-center justify-center"> */}
    <div className=" h-min my-auto p-8 rounded-xl border-green-600 border-2 border-solid bg-white flex flex-col gap-2 ">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-4xl font-bold">{myShortId}</h1>
        </div>
      <InputLabel
        htmlFor="hostIdInput"
        >Host ID: </InputLabel>
      <Input type="text" id="hostIdInput" placeholder="Please enter a host ID" value={hostId} onChange={(event)=>{setHostId(event.currentTarget.value)}} />
      <InputLabel
        htmlFor="nameInput"
        >Name: </InputLabel>
      <Input type="text" id="nameInput" placeholder="Please enter a name" value={tempName} onChange={(event)=>{setTempName(event.currentTarget.value)}} />
        <div className="grid grid-cols-3 gap-2 h-72 overflow-scroll">
    
      {Object.entries(sprites).map(([key, value])=>{
        return <img 
          key={key}
          src={value} 
          data-selected={value== selectedSprite} 
          className=" data-[selected=true]:bg-green-400 rounded-full border-2 border-black" 
          width={256} 
          height={256} 
          onClick={()=>{
            console.log(value)
            setSelectedSprite(value);
          }} 
        />
      })}
      </div>
      {alert && <p className="text-red-600">{alert}</p>}
      <button onClick={join}>Join</button>
      </div>
      {/* </div> */}
      </div>
  )
}

export default SignUp;