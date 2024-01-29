import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAllPlayerControls, setPlayerControls, givePlayerGold, givePlayerPoints, setPlayerInstructions } from "$store/slices/playerSlice";
import { Player, StoreData } from "$store/types";
import triggerNextQueuedAction from "$store/actions/triggerNextQueuedAction";
import { closeModal } from "$store/slices/gameProgressSlice";
import PlayerCard from "./PlayerCard";
import usePeerDataReceived, { PeerDataCallbackPayload } from "$hooks/useDataReceived";
import {v4 as uuidv4} from 'uuid'

type Challenge = {
  category: string,
  name: string,
  difficulty: string,
  description: string,
}

const challenges:Challenge[] = [
  {
    category: 'Megalomania',
    name: 'Tell a lie',
    difficulty: 'easy',
    description: 'Tell a lie. The player with the best lie wins.',  
  },
  {
    category: 'Party',
    name: 'Take a shot',
    difficulty: 'easy',
    description: 'Take a shot of whatever you want. Whoever takes their shot first wins.',
  },
  {
    category: 'Ego',
    name: 'Namedrop',
    difficulty: 'medium',
    description: 'Tell a story about meeting someone famous. The player with the most famous namedrop wins.',
  },
  {
    category: 'Party',
    name: 'Take off a piece of clothing',
    difficulty: 'medium',
    description: 'Take off a piece of clothing. The first person to remove an article of clothing wins.',
  },
  {
    category: 'Ego',
    name: 'Kiss an animal',
    difficulty: 'medium',
    description: 'Kiss an animal. The first player to kiss an animal wins.',
  },
  {
    category: 'Party',
    name: 'Dance',
    difficulty: 'medium',
    description: 'Dance. The player who does the most interesting dance wins.',
  },
  {
    category: 'Ego',
    name: 'Tell a joke',
    difficulty: 'medium',
    description: 'Tell a joke. The player with the funniest joke wins.',
  },
  {
    category: 'Task',
    name: 'Touch something blue',
    difficulty: 'medium',
    description: 'Touch something blue. The first player to touch something blue wins.',
  },
];

const Duel =
  () => {

    const players = useSelector((state:StoreData) => state.players);

    const dispatch = useDispatch();
    
    useEffect(()=>{
      if(players.length < 3){
        dispatch(closeModal());
        dispatch(triggerNextQueuedAction());
      }
    },[players, dispatch])
    
    const activePlayers = useSelector((state:StoreData) => state.game.activePlayers);

    const playerA = useMemo(()=>(players.find((player)=>{
      return player.id == activePlayers[0] || player.name == activePlayers[0]
    }) as Player
    ),[players, activePlayers])

    const playerB = useMemo(()=>(
      players.filter((player)=>(player.id !== playerA.id))[Math.floor(Math.random() * players.length)] as Player
    ),[players, playerA.id])

    const audience = useMemo(()=>(
      players.filter((player)=>(player.id !== playerA.id && player.id !== playerB?.id))
    ),[players, playerA, playerB])


    const challenge = useMemo(() => {
      return challenges[Math.floor(Math.random() * challenges.length)];
    }, []);

    const [actionId] = useState(()=>uuidv4());

    
    const [playerAnswers, setPlayerAnswers] = useState<{[key:string]:string}>({});

    useEffect(()=>{
      if(players.length < 3) return;
      dispatch(setPlayerInstructions({playerId: playerA.id, instructions: challenge.description}))
      dispatch(setPlayerInstructions({playerId: playerB.id, instructions: challenge.description}))
      audience.forEach((player)=>{
        if(playerAnswers[player.id]){
          dispatch(setPlayerInstructions({playerId: player.id, instructions: `Thanks for voting! Please wait for the results...`}))
          dispatch(setPlayerControls({playerId: player.id, controls:[]}) )
        } else{
          dispatch(setPlayerInstructions({playerId: player.id, instructions: challenge.description}))
          dispatch(setPlayerControls({playerId: player.id,
            controls:[
              {
                label: playerA.name,
                value: playerA.id,
                action: actionId,
                image: playerA.image
              },
              {
                label: playerB.name,
                value: playerB.id,
                action: actionId,
                image: playerB.image
              }
            ]}),
          )}
        }
      );
    },[players, playerAnswers, dispatch, actionId, audience, playerA, playerB, challenge.description])

    const [winner, setWinner] = useState<Player>()

    const dataReceivedCallback = useCallback((data:PeerDataCallbackPayload, peerId:string) => {
        setPlayerAnswers((prev)=>{
          const next = {...prev};
          next[peerId] = data.payload.value;
          return next;
        })
    }, [setPlayerAnswers]);

    usePeerDataReceived(dataReceivedCallback, actionId)

    const [completed, setCompleted] = useState(false);

    useEffect(()=>{
      if(audience.length && Object.keys(playerAnswers).length == audience.length){
        const points = (()=>{
          switch(challenge.difficulty){
            case 'easy':
              return 2;
            case 'medium':
              return 5;
            case 'hard':
              return 10;
            case 'expert':
              return 20;
            default:
              return 1;
          }
        })()
        setCompleted(true);
        const votesA = Object.values(playerAnswers).filter((answer)=>answer == playerA.id).length;
        const votesB = Object.values(playerAnswers).filter((answer)=>answer == playerB.id).length;
        
        if(votesA > votesB){
          setWinner(playerA);
          dispatch(setPlayerInstructions({playerId: playerA.id, instructions: `You won! You get ${points} points and ${points} gold!`}))
        }else if (votesB > votesA){
          setWinner(playerB)
          dispatch(setPlayerInstructions({playerId: playerB.id, instructions: `You won! You get ${points} points and ${points} gold!`}))
        }else{
          dispatch(setPlayerInstructions({playerId: playerA.id, instructions: `It's a tie! Nobody gets anything. Deal with it.`}))
          dispatch(setPlayerInstructions({playerId: playerB.id, instructions: `It's a tie! Nobody gets anything. Deal with it.`}))
        }
      let timeout2:NodeJS.Timeout, timeout3:NodeJS.Timeout;
      const timeout = setTimeout(()=>{
          if(winner) {
            dispatch(givePlayerPoints({playerId: winner.id, points }));
            dispatch(givePlayerGold({playerId: winner.id, gold: points }));
          }
          timeout2 = setTimeout(()=>{
            dispatch(clearAllPlayerControls())
            dispatch(closeModal());
            timeout3 = setTimeout(()=>{
              dispatch(triggerNextQueuedAction());
            },1000)
          }, 2000)
        }, 2000);
        return ()=>{
          clearTimeout(timeout);
          clearTimeout(timeout2);
          clearTimeout(timeout3);
        }
      }
    },[playerAnswers, players, dispatch, challenge.difficulty, setCompleted, audience, playerA, playerB, winner])

    
    return (
      <div
        className="flex flex-col w-full gap-4 items-center max-w-[50dvw]" 
      >
        <h1 className="text-4xl font-bold text-black text-center pb-2">{challenge.category}</h1>
        <h2 className="text-4xl text-black max-w-screen">
          {challenge.name}
        </h2>
        <div className="grid grid-flow-dense">
        {completed && winner !== undefined &&
          <div>
            <h1 className="text-4xl text-black text-center">Winner: {winner.name}</h1>
            <div className='flex flex-row items-center justify-center  p-2'>
                <PlayerCard player={winner} className={'border-green-800 bg-green-400'} />
            </div>
          </div>
        }
        {
          completed && winner !== undefined &&
          <div>
            <h1 className="text-4xl text-black text-center">Tie</h1>
            <div className="text-2xl">
            Nobody gets anything. Deal with it.
            </div>
          </div>
        }
        {!completed && 
        <div className="flex flex-row gap-2">
          <PlayerCard player={playerA} className="" />
          <PlayerCard player={playerB} className="" />
        </div>}
        </div>
      </div>
    );
  };

export default Duel;
