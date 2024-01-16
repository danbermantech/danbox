import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePeer } from "$hooks/usePeer";
import movePlayer from "$store/actions/movePlayer";
import { givePlayerControls } from "$store/slices/playerSlice";
import { StoreData } from "$store/types";
import triggerNextQueuedAction from "$store/actions/triggerNextQueuedAction";
import activateItem from "$store/actions/activateItem";

const HostStateManager = () => {
  const gameState = useSelector((state:StoreData) => state.game);
  const players = useSelector((state:StoreData) => state.players);
  const currentRound = useSelector((state:StoreData) => state.game.currentRound);
  const board = useSelector((state:StoreData) => state.game.board);
  const dispatch = useDispatch();
  const onDataReceived = usePeer((cv) => cv.onDataReceived) as (
    cb: (value:{type:string, payload:{action:string, playerId: string, value:string}}) => void,
    id: string
  ) => void;
  const removeOnDataReceivedListener = usePeer((cv) => cv.removeOnDataReceivedListener) as (listenerId:string)=>void

  useEffect(()=>{
    if(currentRound < 1 || gameState.mode !== 'MOVEMENT') return
      onDataReceived && onDataReceived((data)=>{
        if(data.type == 'playerAction' && data.payload){
          const player = players.find((player)=>(player.id == data.payload.playerId || player.name == data.payload.playerId));
          if(!player) return;
          if(data.payload.action == 'move'){
            dispatch(movePlayer({playerId: player.id, spaceId: data.payload.value}));
            dispatch(givePlayerControls({playerId: player.id, controls:[]}));
            if(players.filter((player)=>(player.hasMoved)).length == players.length - 1){
                dispatch(triggerNextQueuedAction())
            }
          }
          
        }
        if(data.type == 'activateItem' && data.payload){
          dispatch(activateItem({playerId: data.payload.playerId, item: data.payload.value}))
        }
      }, 'movementListener')
      players.forEach((player)=>{
        if(player.hasMoved){
          dispatch(givePlayerControls({playerId: player.id, controls:[]}));
        }else{

          const mySpace = board?.find((space)=>(space.id == player.spaceId));
          const connections = mySpace?.connections
          if(!connections) return;
          const availableSpaces = board.filter((space)=>connections.includes(space.id));
          const options = availableSpaces.map((connection)=>({label:connection.label, value:connection.id, action:'move'}));
          dispatch(givePlayerControls({playerId: player.id, controls:options}))
        }
      })
    return ()=>{removeOnDataReceivedListener('movementListener')}
  },[currentRound, gameState.mode, players, board, dispatch, onDataReceived, removeOnDataReceivedListener])

  const sendPeersMessage = usePeer((cv) => cv.sendPeersMessage) as (
    data:{type: string, payload: {value:{players:StoreData['players']}}},
  ) => void;
  const setOnConnectSendValue = usePeer((cv) => cv.setOnConnectSendValue) as (
    value: unknown,
  ) => void;
  const peerReady = usePeer((cv) => cv.peerReady) as boolean;
  useEffect(() => {
    if (!peerReady) return;
    setOnConnectSendValue && setOnConnectSendValue({state:players});
    sendPeersMessage &&
      sendPeersMessage({ type: "state", payload: { value: {players} } });
  }, [sendPeersMessage, setOnConnectSendValue, peerReady, players]);
  return null;

};

export default HostStateManager;
