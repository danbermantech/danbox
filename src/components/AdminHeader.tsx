import { AppBar, Modal, Toolbar, Typography } from "@mui/material"
import useMe from '$hooks/useMe'
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { GAME_MODE, SpecialSelectInputParams, SpecialSelectOptions, StoreData } from "$store/types";
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
import { UnknownAction } from "@reduxjs/toolkit";
import PlayerMap from "./PlayerMap";
import { Fullscreen } from "@mui/icons-material";
import { endMinigame } from "$store/slices/gameProgressSlice";
import items from "$constants/items";
import { useAppSelector } from "$store/hooks";
import removeSpace from "$store/actions/removeSpace";
import { createPath, createSpace, moveSpace, removePath, shiftSpace } from "$store/slices/boardSlice";
import clsx from "clsx";

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
  options: {id:string, label:string}[]|SpecialSelectOptions,
}

type Input = NumberInput | TextInput | SelectInput;

type ControlDefinition<T = unknown,U = T> = {
  label: string,
  action: (payload:T)=>{type:string, payload:U},
  inputs?: Input[]
}

// const RemovePlayer:ControlDefinition 

const remove:ControlDefinition<{playerId:string}> = {
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
    {label: 'spaceId', type: InputType.SELECT, value: 'home', options: 'spaces', key:'spaceId'}
  ]
}

const moveFinal:ControlDefinition<{playerId:string, spaceId:string}, {playerId:string, spaceId:string}> = {
  label: 'Move Player Final',
  action: movePlayerFinal,
  inputs:[
    {label: 'spaceId', type: InputType.SELECT, value: 'home', options: 'spaces', key:'spaceId'}
  ]
}

const moveBoardSpace:ControlDefinition = {
  label: 'Move Space',
  action: moveSpace,
  inputs:[
    {label: 'id', type: InputType.SELECT, value: 'home', options: 'spaces', key:'id'},
    {label:'x', type: InputType.NUMBER, value: 0.5, key:'x'},
    {label:'y', type: InputType.NUMBER, value: 0.5, key:'y'},
  ]
}

const shiftBoardSpace:ControlDefinition = {
  label: 'Shift Space',
  action: shiftSpace,
  inputs:[
    {label: 'id', type: InputType.SELECT, value: 'home', options: 'spaces', key:'id'},
    {label:'x', type: InputType.NUMBER, value: 0.05, key:'x'},
    {label:'y', type: InputType.NUMBER, value: 0.05, key:'y'},
  ]
}

const createBoardPath:ControlDefinition = {
  label: 'Create Path',
  action: createPath,
  inputs:[
    {label: 'from', type: InputType.SELECT, value: 'home', options: 'spaces', key:'from'},
    {label: 'to', type: InputType.SELECT, value: 'home', options: 'spaces', key:'to'},
  ]
}

const removeBoardPath:ControlDefinition = {
  label: 'Remove Path',
  action: removePath,
  inputs:[
    {label: 'from', type: InputType.SELECT, value: 'home', options: 'spaces', key:'from'},
    {label: 'to', type: InputType.SELECT, value: 'home', options: 'spaces', key:'to'},
  ]
}

const createBoardSpace:ControlDefinition = {
  label: 'Create Space',
  action: createSpace,
  inputs:[
    {label: 'id', type: InputType.TEXT, value: 'id', key:'id'},
    {label: 'label', type: InputType.TEXT, value: 'label', key:'label'},
    {label: 'x', type: InputType.NUMBER, value: 0, key:'x'},
    {label: 'y', type: InputType.NUMBER, value: 0, key:'y'},
    {label: 'color', type: InputType.TEXT, value: '#000000', key:'color'},
    {label: 'width', type: InputType.NUMBER, value: 0.06, key:'width'},
    {label: 'height', type: InputType.NUMBER, value: 0.06, key:'height'},
    {label: 'type', type: InputType.SELECT, options: Object.entries(GAME_MODE).map(([key, value])=>({id:key, label:value})), value: GAME_MODE.TRIVIA, key:'type'},
    {label: 'Path From 1', value:'home', type: InputType.SELECT, options: 'spaces', key:'pathsFrom1'},
    {label: 'Path From 2', value:'', type: InputType.SELECT, options: 'spaces', key:'pathsFrom2'},
    {label: 'Path From 3', value:'', type: InputType.SELECT, options: 'spaces', key:'pathsFrom3'},
    {label: 'Path To 1', value:'home', type: InputType.SELECT, options: 'spaces', key:'pathsTo1'},
    {label: 'Path To 2', value:'', type: InputType.SELECT, options: 'spaces', key:'pathsTo2'},
    {label: 'Path To 3', value:'', type: InputType.SELECT, options: 'spaces', key:'pathsTo3'}
    // {label: 'connections', type: InputType.SELECT, options: 'spaces', value: [], key:'connections'},
  
  ]
}

const removeBoardSpace:ControlDefinition<{id:string}> = {
  label: 'Remove Space',
  action: removeSpace,
  inputs:[
    {label: 'id', type: InputType.SELECT, value: '', options: 'spaces_except_home', key:'id'},
  ]
}

const SpecialSelectControl = ({param, value, onChange, className}:{param:SpecialSelectInputParams, value:string, onChange:(name:string, value:string)=>void, className:string})=>{

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
        return [
          {label: 'none', value: ''},
          ...Object.values(state.board).map(space=>({label: space.label, value: space.id}))
        ]
      case 'spaces_except_home':
        return [
          {label: 'none', value: ''},
          ...Object.values(state.board).map(space=>({label: space.label, value: space.id})).filter((space)=>space.value !== 'home')
        ]
      default:
        return []
    }
    // state[param.options]
  });
  return (
    <select className={clsx(className, 'accent-blue-400')} value={value} onChange={(event)=>{onChange(param.name, event.target.value)}}>
      <option disabled>Select</option>
      {options.map(option=>{
        return <option key={option.value} value={option.value}>{option.label}</option>
    })}
    </select>
  )

}



const boardControls = [
  moveBoardSpace,
  shiftBoardSpace,
  createBoardPath,
  removeBoardPath,
  createBoardSpace,
  removeBoardSpace,
  // randomizeSpaces,
]

const playerControls = [
  remove,
  setInstructions,
  givePoints,
  giveGold,
  giveItem,
  rename,
  move,
  moveFinal
]

const Control = ({staticProps={}, control}:{staticProps:Record<string,unknown>, control:ControlDefinition})=>{
  const {label, action, inputs} = control;
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
    const payload = action({...staticProps, ... form})
    sendPeersMessage({type: 'admin', payload})
  },[sendPeersMessage, action, form, staticProps])

  const onChange = useCallback((key:string, value:string)=>{
    setForm((prevForm)=>({...prevForm, [key]:value}))
  },[setForm])

  return (
    <div className="text-center p-4 bg-slate-200 border-2 rounded border-black place-content-center place-items-center justify-center items-center content-center ">
      <details>
      <summary className="text-left">{label}</summary>
      <div className="flex flex-col text-black">
      {
        inputs?.map((input)=>{
          switch(input.type){
            case InputType.NUMBER:
              return <div key={input.key} className="flex w-full flex-col text-left font-semibold text-lg gap-2 justify-items-stretch">
                <label>{input.label}</label>
                <input className="bg-white bg-opacity-50 drop-shadow-xl rounded-xl p-4 w-full" type="number" value={form[input.key] as number} onChange={(e)=>{onChange(input.key, e.target.value)}} />
              </div>
            case InputType.TEXT:
              return <div key={input.key} className="flex w-full flex-col text-left font-semibold text-lg gap-2 justify-items-stretch">
                <label>{input.label}</label>
                <input className="bg-white bg-opacity-50 drop-shadow-xl rounded-xl p-4 w-full" type="text" value={form[input.key] as string} onChange={(e)=>{onChange(input.key, e.target.value)}} />
              </div>
            case InputType.SELECT:
              if(typeof(input.options) == 'string'){
                return (<div key={input.key} className="flex w-full flex-col text-left font-semibold text-lg gap-2 justify-items-stretch">
                <label>{input.label}</label>
                <SpecialSelectControl className="bg-white bg-opacity-50 drop-shadow-xl rounded-xl p-4 w-full" param={{...input, special:input.options, name:input.key}} value={form[input.key] as string} onChange={onChange} />
                </div>)
              }
              return <div key={input.key} className="flex w-full flex-col text-left font-semibold text-lg gap-2 justify-items-stretch">
                <label>{input.label}</label>
                <select className="bg-white bg-opacity-50 drop-shadow-xl rounded-xl p-4 w-full" value={form[input.key] as string} onChange={(e)=>{onChange(input.key, e.target.value)}}>
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
      </div>
      <button onClick={onSubmit} className=" p-2 bg-blue-400 text-white rounded-xl ">Submit</button>
      </details>
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
            <img src={me?.image} width={48} height={48} className="rounded-full w-12 h-12 " onClick={()=>setModalOpen(true)} />
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
            {boardControls.map(control=>{
              return <Control key={control.label} staticProps={{connections:[]}} control={control as ControlDefinition} />
              })
            }
            {
              players.map((player)=>{
                return <div key={player.id} className="flex justify-stretch items-center flex-col gap-2 text-lg p-2">
                  <details className="flex justify-items-center gap-2 p-2 bg-slate-400 rounded-xl flex-col justify-stretch ">
                <summary>

                  <PlayerCard player={player} className='mx-auto'/>
                  </summary>
                  <div className="flex flex-col" >

                  {playerControls.map((control)=>{
                    //@ts-expect-error I need to fix the control props or not maybe i don't care
                    return <Control key={control.label} staticProps={{playerId:player.id}} control={control} />
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