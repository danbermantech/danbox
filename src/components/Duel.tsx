import { useEffect, useState, useMemo, useCallback } from "react";
import { clearAllPlayerControls, setPlayerControls, givePlayerGold, givePlayerPoints, setPlayerInstructions } from "$store/slices/playerSlice";
import { Player } from "$store/types";
import triggerNextQueuedAction from "$store/actions/triggerNextQueuedAction";
import { endMinigame } from "$store/slices/gameProgressSlice";
import PlayerCard from "./PlayerCard";
import usePeerDataReceived, { PeerDataCallbackPayload } from "$hooks/useDataReceived";
import {v4 as uuidv4} from 'uuid'
import {swords} from '$assets/images.ts';

import { useAppDispatch, useAppSelector } from "$store/hooks";
import useAudio from "$hooks/useAudio";
import clsx from "clsx";

type Challenge = {
  category: string,
  name: string,
  difficulty: string,
  description: string,
  audienceDescription: string,
  audienceDelay?: number,
}

const challenges:Challenge[] = [
  {
    category: 'Megalomania',
    name: 'Tell a lie',
    difficulty: 'easy',
    description: 'Tell a lie. The player with the best lie wins.',  
    audienceDescription: 'Vote for the best lie.',
    audienceDelay: 30000,
  },
  {
    category: 'Task',
    name:'Touch a doorknob',
    difficulty: 'easy',
    description: 'Touch a doorknob. The first player to touch a doorknob wins. I kinda ran out of ideas, sorry.',
    audienceDescription: 'Who touched a doorknob first',
  },
  {
    category:'Friendship',
    name: 'Compliment someone',
    difficulty: 'medium',
    description: 'Compliment someone. The player who gives the most sincere compliment wins.',
    audienceDescription: 'Whose compliment was better?',
    audienceDelay: 30000,
  },
  {
    category: 'Party',
    name: 'Take a shot',
    difficulty: 'easy',
    description: 'Take a shot of whatever you want. Whoever takes their shot first wins.',
    audienceDescription: 'Who took their shot first?',
  },
  {
    category: 'Ego',
    name: 'Namedrop',
    difficulty: 'medium',
    description: 'Tell a story about meeting someone famous. The player with the most famous namedrop wins.',
    audienceDescription: 'Whose story was the most interesting?',
    audienceDelay: 30000,
  },
  {
    category: 'Ego',
    name: 'Namedrop',
    difficulty: 'medium',
    description: 'Tell a story about meeting someone famous. The player with the most famous namedrop wins.',
    audienceDescription: 'Whose story happened most recently?',
    audienceDelay: 30000,
  },
  {
    category: 'Party',
    name: 'Take off a piece of clothing',
    difficulty: 'medium',
    description: 'Take off a piece of clothing. The first person to remove an article of clothing wins.',
    audienceDescription: 'Whose piece of clothing was lighter?',
    audienceDelay: 20000,
  },
  {
    category: 'Party',
    name: 'Take off a piece of clothing',
    difficulty: 'medium',
    description: 'Take off a piece of clothing. The first person to remove an article of clothing wins.',
    audienceDescription: 'Whose piece of clothing was darker?',
    audienceDelay: 20000,
  },
  {
    category: 'Ego',
    name: 'Kiss an animal',
    difficulty: 'medium',
    description: 'Kiss an animal. The first player to kiss an animal wins.',
    audienceDescription: 'Who kissed an animal first?',
  },
  {
    category: 'Ego',
    name: 'Kiss an animal',
    difficulty: 'medium',
    description: 'Kiss an animal. The first player to kiss an animal wins.',
    audienceDescription: 'Whose animal was tallest?',
  },
  {
    category: 'Party',
    name: 'Dance',
    difficulty: 'medium',
    description: 'Dance. The player who does the most interesting dance wins.',
    audienceDescription: 'Whose dance was the most out of character?',
    audienceDelay: 30000,
  },
  {
    category: 'Party',
    name: 'Dance',
    difficulty: 'medium',
    description: 'Dance. The player who does the most interesting dance wins.',
    audienceDescription: 'Whose dance was the most old school?',
    audienceDelay: 30000,
  },
  {
    category: 'Party',
    name: 'Dance',
    difficulty: 'medium',
    description: 'Dance. The player who does the most interesting dance wins.',
    audienceDescription: 'Whose dance was the most athletic?',
    audienceDelay: 30000,
  },
  {
    category: 'Party',
    name: 'Dance',
    difficulty: 'medium',
    description: 'Dance. The player who does the most interesting dance wins.',
    audienceDescription: 'Whose dance was longer?',
    audienceDelay: 30000,
  },
  {
    category: 'Ego',
    name: 'Tell a joke',
    difficulty: 'medium',
    description: 'Tell a joke. The player with the funniest joke wins.',
    audienceDescription: 'Who do you feel more pity for right now?',
    audienceDelay: 30000,
  },
  {
    category: 'Task',
    name: 'Touch something blue',
    difficulty: 'medium',
    description: 'Touch something blue. The first player to touch something blue wins.',
    audienceDescription: 'Whose blue was the bluest blue?',
    audienceDelay: 20000,
  },
];

const Duel =
  () => {

    const players = useAppSelector((state) => state.players);

    const dispatch = useAppDispatch();
    
    useEffect(()=>{
      if(players.length < 3){
        dispatch(endMinigame());
        dispatch(triggerNextQueuedAction());
      }
    },[players, dispatch])
    
    const activePlayers = useAppSelector((state) => state.game.activePlayers);

    const playerA = useMemo(()=>(players.find((player)=>{
      return player.id == activePlayers[0] || player.name == activePlayers[0]
    }) as Player
    ),[players, activePlayers])

    const [playerB] = useState<Player>(()=>{
      const notA = players.filter((player)=>(player.id !== playerA.id))
        const randomIndex = Math.floor(Math.random() * notA.length);
        return notA[randomIndex];
    });

    const [audience] = useState(()=>{
      if(!playerA || !playerB) return [];
      return players.filter((player)=>(player.id !== playerA.id && player.id !== playerB?.id))
    })

    // useEffect(()=>{
    //   if(!playerA || !playerB) dispatch((disp)=>{disp(endMinigame()); disp(triggerNextQueuedAction());})
    // },[playerA, playerB, dispatch])

    const [challenge] = useState(challenges[Math.floor(Math.random() * challenges.length)])

    const [actionId] = useState(()=>uuidv4());

    const {triggerSoundEffect} = useAudio();
    


    const [playerAnswers, setPlayerAnswers] = useState<{[key:string]:string}>({});


    useEffect(()=>{
      const x = setTimeout(()=>{
        if(!playerA || !playerB) return;
        // console.log('assigning controls', playerA, playerB)

        const controls =             [
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
        ]
        // console.log(controls)

        audience.forEach((player)=>{
          dispatch(setPlayerInstructions({playerId: player.id, instructions: challenge.audienceDescription}))
          dispatch(setPlayerControls({playerId: player.id, controls}) )
        })
      }, challenge.audienceDelay ?? 1000)
      return ()=>{clearTimeout(x)};
    },[challenge.audienceDelay, dispatch, challenge.audienceDescription, audience, playerB, playerA, actionId])


    useEffect(()=>{
      if(!(playerA && playerB)) return;
      dispatch(setPlayerInstructions({playerId: playerA.id, instructions: challenge.description}))
      dispatch(setPlayerInstructions({playerId: playerB.id, instructions: challenge.description}))
    },[players, dispatch, playerA, playerB, challenge.description])

    const [winner, setWinner] = useState<Player>()

    const dataReceivedCallback = useCallback((data:PeerDataCallbackPayload, peerId:string) => {
        setPlayerAnswers((prev)=>{
          const next = {...prev};
          next[peerId] = data.payload.value;
          return next;
        })
        triggerSoundEffect(`dink`);
        dispatch(setPlayerInstructions({playerId: peerId, instructions: `Thanks for voting! Please wait for the results...`}))
        dispatch(setPlayerControls({playerId: peerId, controls:[]}) )
    }, [setPlayerAnswers, dispatch, triggerSoundEffect]);

    usePeerDataReceived(dataReceivedCallback, actionId)

    const [completed, setCompleted] = useState(false);

    useEffect(()=>{
      
      if(!completed) return triggerSoundEffect('duel');
      return triggerSoundEffect('hooray')
    },[triggerSoundEffect, completed])

    useEffect(()=>{
      const t = setTimeout(()=>{
        if(!completed)
          setCompleted(true);
      }, 60000)
      return ()=>clearTimeout(t);
    },[playerAnswers, completed])

    useEffect(()=>{
      if(!completed && playerA && playerB && audience.length && Object.keys(playerAnswers).length == audience.length){

        setCompleted(true);
        const votesA = Object.values(playerAnswers).filter((answer)=>answer == playerA.id).length;
        const votesB = Object.values(playerAnswers).filter((answer)=>answer == playerB.id).length;
        if(votesA == votesB){
          setRewardsGranted(true);
          return;
        }
  
        const winningPlayer = votesA > votesB ? playerA : playerB;
        // const losingPlayer = votesA > votesB ? playerB : playerA;
        setWinner(winningPlayer)
      }
    },[playerAnswers, players, dispatch, challenge.difficulty, setCompleted, audience, playerA, playerB, winner, completed])

    const [rewardsGranted, setRewardsGranted] = useState(false);

    const giveRewards = useCallback(()=>{
      if(!(playerA && playerB)) return;
      if(rewardsGranted) return;
      setRewardsGranted(()=>true);
      if(!winner) return;
      // console.log('giving rewards')
      // const votesA = Object.values(playerAnswers).filter((answer)=>answer == playerA.id).length;
      // const votesB = Object.values(playerAnswers).filter((answer)=>answer == playerB.id).length;
      // if(votesA == votesB){
      //   setRewardsGranted(true);
      //   return;
      // }

      // const winningPlayer = votesA > votesB ? playerA : playerB;
      // // const losingPlayer = votesA > votesB ? playerB : playerA;
      // setWinner(winningPlayer)

      const points = (()=>{
        switch(challenge.difficulty){
          case 'easy':
            return 5;
          case 'medium':
            return 10;
          case 'hard':
            return 20;
          case 'expert':
            return 50;
          default:
            return 5;
        }
      })()
      dispatch((disp)=>{
        // disp(setPlayerInstructions({playerId: winningPlayer.id, instructions: `You won! You get ${points} points and ${points} gold!`}))
        disp(givePlayerPoints({playerId: winner.id, points }));
        disp(givePlayerGold({playerId: winner.id, gold: points }));
        // disp(setPlayerInstructions({playerId: losingPlayer.id, instructions: `You lost! You get nothing!`}))
      })
      
    },[dispatch, challenge.difficulty,  playerA, playerB, rewardsGranted, winner]);

    // const endDuel = useCallback(()=>{
    //   if(!completed) return;
    //   // let t1: NodeJS.Timeout, t2: NodeJS.Timeout;
    //   const t = setTimeout(()=>{
    //     if(rewardsGranted) return;
    //     dispatch(clearAllPlayerControls());
    //     setTimeout(()=>{
    //       dispatch(endMinigame());
    //       setTimeout(()=>{
    //       dispatch(triggerNextQueuedAction());
    //       }, 500)
    //     },3000)
    //     giveRewards();
    //   }, 1000);
    //   return ()=>{clearTimeout(t);};
    // },[completed, dispatch, giveRewards, rewardsGranted])

    // useEffect(endDuel,[endDuel])

      if(completed && !rewardsGranted) {

        // let t1: NodeJS.Timeout, t2: NodeJS.Timeout;
        dispatch(clearAllPlayerControls());
        giveRewards();
        // setTimeout(()=>{
        //   // if(rewardsGranted) return;
        //   setTimeout(()=>{
        //     dispatch(endMinigame());
        //     setTimeout(()=>{
        //       dispatch(triggerNextQueuedAction());
        //     }, 500)
        //   },3000)
        // }, 1000);
      }

    if(rewardsGranted){
      setTimeout(()=>{
        dispatch(endMinigame());
        setTimeout(()=>{
          dispatch(triggerNextQueuedAction());
        }, 500)
      },3000)
    }

    if(!playerA || !playerB) return (<div></div>)

    return (
      <div
        className="flex flex-col w-full items-center max-w-[50dvw] " 
      >
        <div className="bg-slate-100 border-black rounded-t-xl w-full flex flex-col gap-2 p-2 bg-opacity-85 border-4">
        <h1 className="text-black text-center text-6xl font-extrabold">DUEL</h1>
        <h2 className="text-4xl font-bold text-black pb-2">{challenge.category}</h2>
        <h3 className="text-4xl text-black">
          {challenge.name}
        </h3>
        </div>
        <div className="bg-white border-4 rounded-b-xl border-black w-full items-center flex p-8">
        {/* <div className="grid grid-flow-dense"> */}
        {completed && winner !== undefined &&
          <div className="w-full flex flex-col">
            <h1 className="text-4xl text-black text-center">Winner!</h1>
            <div className='flex-row flex items-center justify-center w-full p-2'>
                <PlayerCard player={winner} className={'border-green-800 mx-auto bg-green-400'} />
            </div>
          </div>
        }
        {
          completed && winner == undefined &&
          <div className="w-full flex flex-col">
            <h1 className="text-4xl text-black text-center">Tie</h1>
            <div className="text-2xl text-center">
              <p>It's a tie! No one wins. Whomp whomp whomp</p>
            </div>
          </div>
        }
        {!completed &&
        <div className="flex flex-col items-center w-full"> 
        <div className="flex items-center w-full justify-center gap-8 place-content-between flex-row">
          <img src={swords} width="128" className="animate-wiggle-more animate-infinite animate-delay-500 "/>
          <PlayerCard player={playerA} className="animate-wiggle-more animate-infinite bg-gradient-radial from-red-400 to-red-600" />
          <div className="text-8xl font-extrabold text-black">VS</div>
          <PlayerCard player={playerB} className="animate-wiggle-more animate-delay-500 animate-infinite bg-gradient-radial from-red-400 to-red-600" />
          <img src={swords} width="128" className="animate-wiggle-more animate-infinite " />
        </div>
        <div className="max-w-full flex flex-col border-2 mt-8 p-4 rounded-xl w-min border-black">
          <h1 className="text-center font-bold text-2xl text-black">AUDIENCE</h1>
          <div className="w-min max-w-full flex flex-wrap items-center flex-row min-w-max gap-2 place-items-center justify-center mx-auto">
            {audience.map((player)=><PlayerCard player={player} key={player.id} className={clsx(playerAnswers[player.id] ? "bg-green-400" : "bg-blue-400")} />)}
          </div>
        </div>
        </div>}
        </div>
        {/* </div> */}
      </div>
    );
  };

export default Duel;
