import { useState, useCallback, useEffect } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { usePeer } from "../../hooks/usePeer";
import { AppBar, IconButton, Input, Modal, Toolbar, Typography, InputLabel } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {  useSelector } from "react-redux";
import { StoreData } from "$store/types";
import sprites from "$assets/sprites";
// import activateItem from "$store/actions/activateItem";
// import { getCookie } from "../../utilities/cookies";
const Layout = (): React.ReactNode => {
  const [searchParams] = useSearchParams();

  const [hostId] = useState(searchParams.get("hostId"));
  const connect = usePeer((cv) => cv.connect) as (
    hostId: string,
    options: {deviceName: string, image:string},
    onPeerConnect: (peer: unknown) => void,
  ) => void;
  const [connected, setConnected] = useState(false);
  const peerConnected = usePeer((cv) => cv.peerConnected) as boolean;
  const peerErrors = usePeer((cv) => cv.peerErrors) as {message:string}[];
  const [tempName, setTempName] = useState("");
  const [alert, setAlert] = useState("");
  
  const [joinModalOpen, setJoinModalOpen] = useState(true);
  // const deviceId = useMemo(() => {
  //   return getCookie("deviceId");
  // },[]);
  const [selectedSprite, setSelectedSprite] = useState('')
  
  const join = useCallback(() => {
    if (typeof connect == "function" && hostId && !connected) {

      if(tempName.length > 1) {
      // onPeerConnect(console.log);
      console.log('joining', tempName, selectedSprite)
      connect(hostId, {deviceName: tempName, image:selectedSprite}, (x) => {
        console.log(x);
      });
      setConnected(() => true);
      // setJoinModalOpen(false);
    } else {
      // setAlert('Please enter a name')
    }
  }
  }, [connect, hostId, connected, tempName,selectedSprite ]);

  console.log(peerConnected)
  useEffect(()=>{
    if(peerConnected) {
      setJoinModalOpen(false);
    }
  },[peerConnected, setJoinModalOpen])

  useEffect(()=>{
    if(peerErrors.length){
      setAlert(peerErrors[peerErrors.length-1].message)
    }
  },[peerErrors])

  const myPeerId = usePeer((cv) => cv.myPeerId) as string;
  const me = useSelector((state:StoreData)=>state.players.find((player)=>player.id == myPeerId));
  // const dispatch = useDispatch();
  const sendPeersMessage = usePeer((cv) => cv.sendPeersMessage) as (
    value: { type: string; payload: { playerId: string; action: string, value: string }},
  ) => void;


  return (
    <div className="h-screen">
      <AppBar position="static" className="bg-red-400">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" color="inherit" component="div">
            {me?.name}
          </Typography>
          <div className="w-full flex flex-row justify-items-stretch justify-around items-center">

          {me?.items.map(item=>{
            return <img src={item.image} height={36} width={36} onClick={()=>{
              sendPeersMessage({type: 'activateItem', payload: {playerId: me.id, action:'activateItem', value: item.name}})
              // dispatch(activateItem({playerId: me.id, item: item.name}))
            }} />
          })}
          </div>
        </Toolbar>
      </AppBar>
      {/* <h1>CLIENT</h1> */}
      <Modal className="flex w-full items-center justify-items-center justify-center" open={joinModalOpen}>
        <div className="w-1/2 h-min p-8 rounded-xl border-green-600 border-2 border-solid bg-white flex flex-col gap-2 ">
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
      </Modal>
      <Outlet />
    </div>
  );
};

export default Layout;
