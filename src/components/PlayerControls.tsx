import { usePeer } from "$hooks/usePeer";
import RemoteControl from "$components/RemoteControl";
import type { Player, PlayerActions, } from "$store/types";
import useMe from "$hooks/useMe";
import FrenzyControls from "$components/FrenzyControls";
import Shrimped from "$components/Shrimped";

function CustomControls({controls}:{controls:PlayerActions}){
  
  const sendPeersMessage = usePeer((cv) => cv.sendPeersMessage) as (
    value: unknown,
  ) => void;

  const {id} = useMe();

  if(! Array.isArray(controls)) return null  
  return (<>
  {controls.map((opt) => {
    console.log(opt)
    return (
      
      <RemoteControl
      key={opt.key ? opt.key : opt.value}
      onClick={() => {
        // console.log("sending message", opt.action, opt.value)
        sendPeersMessage({
          type: opt.action,
          payload: { playerId: id, action: opt.action, value: opt.value },
        });
      }}
      value={opt.action}
      label={opt.label}
      classNames={opt.className}
      style={opt?.style ?? {}}
      img={opt.img}
      />
      )
    }
    )}
  </>)
}

function Instructions (){
  const {instructions} = useMe();
  return (
    <h1 className="text-4xl text-center text-white">
      {instructions}
    </h1>
  )
}

function ControlWrapper({children}:{children:React.ReactNode}){
  return (
    <div className=" p-4 w-full h-[calc(100dvh - 64px)] flex-grow flex font-titan">
      
      <div
      className="flex flex-col min-h-72 gap-2 h-full flex-grow "
      >
      {children}
    </div>
    </div>
  )
}

function PlayerControls(){
  const {controls, effects} = useMe() as Player;

  if(effects && effects.findIndex((effect)=>effect == 'SHRIMPED') > -1 ) return (<Shrimped />)
  
  if(typeof controls == 'string'){
    switch(controls){
      case 'FRENZY':
        return <FrenzyControls />
      default:
        return null;
    }
  }
  return (
    <ControlWrapper>
        <Instructions />
        <CustomControls controls={controls} />
    </ControlWrapper>
  );
}

export default PlayerControls;
