import { PeerDataCallbackPayload } from "$hooks/useDataReceived";
import useMe from "$hooks/useMe"
import { usePeer } from "$hooks/usePeer";
import { useCallback, useMemo, useState } from "react";
import { itemPlaceholder } from "$assets/images";
import { Item } from "$store/types";
import { Modal } from "@mui/material";
import { useAppSelector } from "$store/hooks";
import type { SelectInputParams, SpecialSelectInputParams, StandardSelectInputParams, UserControlledParam } from "$store/types";
import clsx from "clsx";
// import activateItem from "$store/actions/activateItem";


const ItemStandardParamSelectControl = ({param, value, onChange, className}:{param:StandardSelectInputParams, value:string, onChange:(name:string, value:string)=>void, className: string})=>{
  
  return (
    <select className={className} value={value} onChange={(event)=>{onChange(param.name, event.target.value)}}>
      {param.options.map(option=>{
        if(typeof option == 'string') return <option key={option} value={option}>{option}</option>
        return <option key={option.value} value={option.label}>{option.label}</option>
    })}
    <option key="default" value="" selected disabled>Select</option>
    </select>
  )
}

const ItemParamSpecialSelectControl = ({param, value, onChange, className}:{param:SpecialSelectInputParams, value:string, onChange:(name:string, value:string)=>void, className: string})=>{

  const {id, teamId} = useMe()
  const options = useAppSelector((state) => {
    switch(param.special){
      case 'players':
        return state.players.map(player=>({label: player.name, value: player.id}))
      case 'opponents':
        return state.players.filter(player=>player.id != id).map(player=>({label: player.name, value: player.id}))
      case 'teammates':
        return state.players.filter(player=>player.teamId == teamId).map(player=>({label: player.name, value: player.id}))
      case 'teams':
        return state.teams.map(team=>({label: team.name, value: team.id}))
      case 'spaces':
        return Object.values(state.board).map(space=>({label: space.label, value: space.id}))
      default:
        return []
    }
    // state[param.options]
  });
  return (
    <select className={className} value={value} onChange={(event)=>{onChange(param.name, event.target.value)}}>
      <option value="" selected disabled>Select</option>
      {options.map(option=>{
        return <option key={option.value} value={option.value}>{option.label}</option>
    })}
    </select>
  )

}

const ItemParamSelectControl = ({param, value,  onChange, className}:{param:SelectInputParams, value:string, onChange: (name:string, value:string)=>void, className:string})=>{

  if('special' in param){
    return <ItemParamSpecialSelectControl value={value}  param={param} onChange={onChange} className={className} />
  }
  return <ItemStandardParamSelectControl value={value} param={param} onChange={onChange} className={className} />

}

const ItemParamControl = ({param, value, onChange, className}:{param:UserControlledParam,value:string, onChange:(name:string, value:string)=>void, className:string}) =>{
  switch(param.type){
    case 'string':
      return <input type="text" value={value} onChange={(event)=>{onChange(param.name, event.target.value)}} className={className}/>
    case 'number':
      return <input type="number" value={value} onChange={(event)=>{onChange(param.name, event.target.value)}} className={className} />
    case 'color':
      return <input type="color" value={value} onChange={(event)=>{onChange(param.name, event.target.value)}} className={clsx('h-12 w-full',className)} />
    case 'select':
      return <ItemParamSelectControl param={param} value={value} onChange={onChange} className={className}/>
    default:
       return null;
  }
}


const ItemControl = ({item}:{item:Item})=>{
  const sendPeersMessage = usePeer((cv) => cv.sendPeersMessage) as (message:PeerDataCallbackPayload<{playerId:string, target:string, action:string, value:Record<string,string>}>)=>void;
  const me = useMe();
  // const players = useAppSelector((state) => state.players);
  const [modalOpen, setModalOpen] = useState(false);

  const [state, setState] = useState(()=>{
    if(!item.params) return {}
    const temp:Record<string,string> = {}
    item.params.forEach((param)=>{temp[param.name] = ''})
    return temp;
  })

  const handleParamChanged = useCallback((name:string, value:string)=>{
    setState((prev)=>({...prev, [name]: value}))
  },[setState])
  // console.log(state, Object.values(state).every((value)=>value.length !== 0))
  return (
    <>
      <button 
      disabled={item.name.length == 0} 
      className=" text-xl font-bold disabled:bg-gray-400 text-black border-black border-2 bg-white rounded-xl p-4 flex flex-col items-center justify-center place-content-stretch"
      onClick={()=>{
        setModalOpen(true);
      }} >
        <img 
        src={item.image} 
        height={48} 
        width={48} 
        />
        
        {item.name}
      </button>
      <Modal open={modalOpen} className=" flex w-full h-full min-w-full min-h-full overflow-auto" onClose={()=>setModalOpen(false)}>
          <div className="mx-auto min-w-max max-w-full my-auto p-4 bg-slate-50 rounded-xl w-min flex flex-col text-black">
          {/* <h1 className="text-3xl p-2 text-center text-black">Select your target</h1> */}
          <div className="text-lg text-black">{item.description}</div>
          <div className="flex flex-col flex-wrap gap-2 p-4">
          {
            item.params !== undefined && item.params.map((param)=>{
              return <div key={param.name} className="flex flex-col">
                <div className="uppercase font-semibold">{param.name}</div>
                <ItemParamControl className="drop-shadow-xl p-2 rounded" param={param} value={state[param.name]} onChange={handleParamChanged} />
                </div>
            })
          }
          <button 
          className="rounded shadow bg-blue-500 text-white p-2"
          disabled={Object.keys(state) && !(Object.values(state).every((value)=>value.length !== 0))}
          onClick={()=>{
            // console.log(state);
            sendPeersMessage({type: 'activateItem', payload: {playerId:me.id, target:state.target ?? me.id, action: 'activateItem',  value:{item:item.name,...state,id: item.id}}})
            setModalOpen(false);
          }} >SUBMIT</button>
          </div>
        </div>
      </Modal>
    </>
  )
}

const PlayerItemControls = ()=>{
  const me = useMe();
  const items = useMemo(()=>{
    if(!me?.items) return Array(3).fill({name: '', image: itemPlaceholder})
    const temp = [...me.items];
    while(temp.length < 3){
      temp.push({name: '', image: itemPlaceholder, id: `empty-${temp.length}`, description: '', price:0, weight:1})
    }
    return temp
  },[me?.items])
  return (<div className="flex-shrink bottom-0 w-full bg-blue-600 h-32 flex items-center place-content-center gap-4">
      {items.map(item=>{
        return (
        <ItemControl key={item.id} item={item} />
      )})}
      </div>)
}

export default PlayerItemControls