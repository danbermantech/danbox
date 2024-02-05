import { AppBar, Modal, Toolbar, Typography } from "@mui/material"
import useMe from '$hooks/useMe'
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { StoreData } from "$store/types";
import { 
  removePlayer, 
  givePlayerGold, 
  givePlayerPoints, 
  givePlayerItem,
  renamePlayer, 
  setPlayerInstructions, 
} from '$store/slices/playerSlice'
import { usePeer } from "$hooks/usePeer";
import movePlayer from '$store/actions/movePlayer'
import movePlayerFinal from '$store/actions/movePlayerFinal'
import triggerNextQueuedAction from "$store/actions/triggerNextQueuedAction";
import PlayerCard from "./PlayerCard";
import boardLayout from "$constants/boardLayout";
import { UnknownAction } from "@reduxjs/toolkit";
import PlayerMap from "./PlayerMap";
import { Fullscreen } from "@mui/icons-material";
import { endMinigame } from "$store/slices/gameProgressSlice";
import items from "$constants/items";

enum InputType {
  TEXT = 'text',
  NUMBER = 'number',
  SELECT = 'select',
}

type NumberInput = {
  label: string,
  type: InputType.NUMBER,
  value: number,
  key: string,
}

type TextInput = {
  label: string,
  type: InputType.TEXT,
  value: string,
  key: string,
}

type SelectInput = {
  label: string,
  type: InputType.SELECT,
  value: string,
  key: string,
  options: {id:string, label:string}[]
}

type Input = NumberInput | TextInput | SelectInput;

type ControlDefinition<T = unknown,U = T> = {
  label: string,
  action: (payload:T)=>{type:string, payload:U},
  inputs?: Input[]
}

// const RemovePlayer:ControlDefinition 

const remove:ControlDefinition<{playerId:string}, {playerId:string}> = {
  label: 'Remove Player',
  action: removePlayer, 
  inputs:[]
}

const setInstructions:ControlDefinition<{playerId:string, instructions:string}> = {
  label: 'Set Player Instructions',
  action: setPlayerInstructions,
  inputs:[
    {label: 'instructions', type: InputType.TEXT, value: 'Hello World', key: 'instructions'}
  ]
}

const givePoints:ControlDefinition<{playerId:string, points:number}, {playerId:string, points:number}> = {
  label: 'Give Player Points', 
  action: givePlayerPoints,
  inputs:[
    {label: 'points', type: InputType.NUMBER, value: 0, key:'points'}
  ]
}

const giveGold:ControlDefinition<{playerId:string, gold:number}, {playerId:string, gold:number}> = {
  label: 'Give Player Gold',
  action: givePlayerGold,
  inputs:[
    {label: 'gold', type: InputType.NUMBER, value: 0, key:'gold'}
  ]
}

const giveItem:ControlDefinition<{playerId:string, item:string}, {playerId:string, item:string}> = {
  label: 'Give Player Item',
  action: givePlayerItem,
  inputs:[
    {label: 'item', type: InputType.SELECT, value:"", options: items.map((item)=>({id:item.name, label:item.name,})), key:'item'}
  ]
}

const rename:ControlDefinition<{playerId:string, name:string}, {playerId:string, name:string}> = {
  label: 'Rename Player',
  action: renamePlayer,
  inputs:[
    {label: 'name', type: InputType.TEXT, value: 'Hello World', key:'name'}
  ]
}

const move:ControlDefinition<{playerId:string, spaceId:string}, {playerId:string, spaceId:string}> = {
  label: 'Move Player',
  action: movePlayer,
  inputs:[
    {label: 'spaceId', type: InputType.SELECT, value: 'home', options: boardLayout, key:'spaceId'}
  ]
}

const moveFinal:ControlDefinition<{playerId:string, spaceId:string}, {playerId:string, spaceId:string}> = {
  label: 'Move Player Final',
  action: movePlayerFinal,
  inputs:[
    {label: 'spaceId', type: InputType.SELECT, value: 'home', options: boardLayout, key:'spaceId'}
  ]
}

const controls = [
  remove,
  setInstructions,
  givePoints,
  giveGold,
  giveItem,
  rename,
  move,
  moveFinal
]

const Control = (props:{playerId:string, control:ControlDefinition})=>{
  const {label, action, inputs} = props.control;
  // const dispatch = useDispatch();
  const sendPeersMessage = usePeer((peer)=>(peer.sendPeersMessage)) as (
    data: {type: string, payload: UnknownAction},
  ) => void;

  const [form, setForm] = useState<{[key:string]:unknown}>(()=>{
    const form:{[key:string]:unknown} = {};
    inputs?.forEach((input)=>{
      form[input.key] = input.value;
    })
    return form;
  
  });

  const onSubmit = useCallback(()=>{
    const payload = action({playerId: props.playerId, ... form})
    sendPeersMessage({type: 'admin', payload})
  },[sendPeersMessage, action, form, props.playerId])

  const onChange = useCallback((key:string, value:string)=>{
    setForm((prevForm)=>({...prevForm, [key]:value}))
  },[setForm])

  return (
    <div className="text-center p-4 bg-slate-200 border-2 rounded border-black place-content-center place-items-center justify-center items-center content-center ">
      <div>{label}</div>
      {
        inputs?.map((input)=>{
          switch(input.type){
            case InputType.NUMBER:
              return <div key={input.key} className="flex flex-row gap-2 justify-items-stretch w-max">
                <label>{input.label}</label>
                <input type="number" value={form[input.key] as number} onChange={(e)=>{onChange(input.key, e.target.value)}} />
              </div>
            case InputType.TEXT:
              return <div key={input.key} className="flex flex-row gap-2 justify-items-stretch w-max">
                <label>{input.label}</label>
                <input type="text" value={form[input.key] as string} onChange={(e)=>{onChange(input.key, e.target.value)}} />
              </div>
            case InputType.SELECT:
              return <div key={input.key} className="flex flex-row gap-2 justify-items-stretch w-max">
                <label>{input.label}</label>
                <select value={form[input.key] as string} onChange={(e)=>{onChange(input.key, e.target.value)}}>
                  {
                    input.options.map((option)=>{
                      return <option key={option.id} value={option.id}>{option.label}</option>
                    })
                  }
                </select>
              </div>
          }
        })
      }
      <button onClick={onSubmit} className=" p-2 bg-blue-400 text-white rounded-xl ">Submit</button>
    </div>
  )



}

const AdminHeader = () =>{
  const [modalOpen, setModalOpen] = useState(false);
  const me = useMe();
  const players = useSelector((state:StoreData)=>state.players);

  const sendPeersMessage = usePeer((peer)=>(peer.sendPeersMessage)) as (
    data:{type: string, payload: unknown},
  ) => void;

  return (<AppBar sx={{background: 'red', bg: 'red'}}>
        <Toolbar variant="dense" sx={{display:'flex', justifyItems: 'stretch'}}>
          <div className="flex items-center flex-grow pt-2">
            <img src={me?.image} width={48} height={48} className="rounded-full " onClick={()=>setModalOpen(true)} />
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
        <Modal className="md-w-1/2 mx-auto my-auto h-1/2" open={modalOpen} onClose={()=>{setModalOpen(false)}}>
          <div className="border-2 h-full w-full border-black flex items-center place-items-center place-content-center justify-center">
            <div className="flex max-h-full w-full overflow-scroll max-w-[95dvw] flex-col gap-4 bg-slate-600 rounded-xl">
            <button className="border-black w-max mx-auto bg-slate-200 p-2 rounded-xl text-black" onClick={()=>{sendPeersMessage({type:'admin', payload:triggerNextQueuedAction()})}}>Trigger next action</button>
            <button className="border-black w-max mx-auto bg-slate-200 p-2 rounded-xl text-black" onClick={()=>{sendPeersMessage({type:'admin', payload:endMinigame()})}}>close modal</button>
            {
              players.map((player)=>{
                return <div key={player.id} className="flex justify-stretch items-center flex-col gap-2 text-lg p-2">
                  <details className="flex justify-items-center gap-2 p-2 bg-slate-400 rounded-xl flex-col justify-stretch ">
                <summary>

                  <PlayerCard player={player} className='mx-auto'/>
                  </summary>
                  <div className="flex flex-col" >

                  {controls.map((control)=>{
                    //@ts-expect-error I need to fix the control props or not maybe i don't care
                    return <Control key={control} playerId={player.id} control={control} />
                  })}
                  </div>
                  </details>
                </div>
              })
            }
            </div>
          </div>
        </Modal>
        
  </AppBar>)
}
export default AdminHeader