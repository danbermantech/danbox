import { usePeer } from "$hooks/usePeer";
import { useCallback, useEffect, useState } from "react";
import { getCookie, useCookie } from "utilities/cookies";
// import { characters } from "$assets/images.ts";
import { useLocation, useSearchParams } from "react-router-dom";
import CharacterCarousel from "./CharacterCarousel";
import clsx from "clsx";

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
      // console.log('joining', tempName, selectedSprite)
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
        // console.log(x);
      });
      // sendPeersMessage({type: 'connection_accepted', payload: {deviceName: getCookie('playerName'), image: getCookie('playerSprite')}});
    }
  }, [location.pathname, peerConnected, searchParams, connect])

  return (
    <div className="w-full flex items-center justify-items-center content-center justify-center font-titan">
      {/* <div className="flex flex-row flex-grow w-full items-center justify-items-center content-center justify-center"> */}
    <div className="h-76 transition-[height] min-h-min  my-auto rounded-xl border-green-600 border-2 border-solid bg-white flex flex-col gap-4 items-center max-w-full bg-gradient-to-bl p-4 from-pink-200 to-fuchsia-400">
      <div className="flex flex-row justify-between items-center ">
        <h1 className="animate-fade animate-duration-1000 text-8xl font-cursive font-bold text-center w-full text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-violet-600">Welcome</h1>
      </div>
      <label htmlFor="hostIdInput" className="animate-fade animate-delay-1000 transition-all text-transparent bg-clip-text bg-gradient-to-br from-pink-600 to-violet-600 text-2xl font-bold uppercase">Host ID</label>
      <input type="text" data-length={hostId.length} className="animate-fade animate-delay-1000 text-black w-64 placeholder:text-slate-600 under text-xl bg-white bg-opacity-20 p-2 rounded-xl shadow-xl text-center uppercase font-bold" id="hostIdInput" placeholder="Please enter a host ID" value={hostId} onChange={(event)=>{setHostId(event.currentTarget.value.substring(0,6))}} />
      <div className={clsx("text-red-600 text-sm ", (hostId.length === 6 || hostId.length === 0) ? 'hidden' : null)}>HostID should be 6 characters long</div>
      <label data-disabled={hostId.length < 6} htmlFor="nameInput" className="animate-fade  transition-all text-transparent bg-clip-text bg-gradient-to-br from-pink-600 to-violet-600 text-2xl font-bold uppercase data-[disabled=true]:scale-0">Name</label>
      <input disabled={hostId.length <6} type="text" id="nameInput" className="animate-fade  text-black w-64 placeholder:text-slate-400 under text-xl bg-white bg-opacity-20 p-2 rounded-xl shadow-xl text-center disabled:scale-0" placeholder="Please enter a name" value={tempName} onChange={(event)=>{setTempName(event.currentTarget.value.substring(0,12))}} />
      <div className={clsx("text-red-600 text-sm ", (tempName.length >= 3 || tempName.length == 0) ? 'hidden' : null)}>Name should be at least 3 characters long</div>
      <div data-disabled={tempName.length < 3 || hostId.length < 6} className="animate-fade  text-transparent bg-clip-text bg-gradient-to-br from-pink-600 to-violet-600 text-2xl font-semibold data-[disabled=true]:scale-0 transition-all">Avatar</div>
      <div data-disabled={tempName.length < 3 || hostId.length < 6} className="animate-fade w-full p-4 bg-white bg-opacity-40 rounded-xl shadow-xl data-[disabled=true]:hidden data-[disabled=true]:scale-0 transition-all">
      <CharacterCarousel selected={selectedSprite} onChange={setSelectedSprite} />

      </div>
        {alert && <p className="text-red-600">{alert}</p>}
        <button className="py-4 px-8 mx-auto font-bold bg-blue-500 w-min text-white rounded-xl tracking-widest disabled:opacity-0" disabled={!selectedSprite.length || tempName.length < 4 || hostId.length < 4} onClick={join}>JOIN</button>
      </div>
      {/* </div> */}
      </div>
  )
}

export default SignUp;