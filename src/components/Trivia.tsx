import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAllPlayerControls, setPlayerControls, givePlayerGold, givePlayerPoints, setPlayerInstructions } from "$store/slices/playerSlice";
import TriviaQuestions, { TriviaQuestion } from "constants/triviaQuestions";
import { StoreData } from "$store/types";
import triggerNextQueuedAction from "$store/actions/triggerNextQueuedAction";
import { closeModal } from "$store/slices/gameProgressSlice";
import PlayerCard from "./PlayerCard";
import usePeerDataReceived, { PeerDataCallbackPayload } from "$hooks/useDataReceived";
import {v4 as uuidv4} from 'uuid'
import useAudio from "$hooks/useAudio";

function calculatePoints(difficulty:TriviaQuestion['difficulty']):number{
  switch(difficulty){
    case 'easy':
      return 5;
    case 'medium':
      return 10;
    case 'hard':
      return 25;
    case 'expert':
      return 50;
    default:
      return 1;
  }
}


const Trivia =
  () => {

    const triviaQuestion = useMemo(() => {
      const triviaQuestion = TriviaQuestions[Math.floor(Math.random() * TriviaQuestions.length)];
      return triviaQuestion;
    }, []);

    const [actionId] = useState(()=>uuidv4());
    const players = useSelector((state:StoreData) => state.players);

    const dispatch = useDispatch();

    const answers = useMemo(()=>{
      return [triviaQuestion.answer, ...triviaQuestion.incorrect_answers]
        .sort(()=>{return Math.random() - 0.5})
        .map((answer)=>({label: answer, value: answer, action: actionId}));
    },[triviaQuestion, actionId])

    const [playerAnswers, setPlayerAnswers] = useState<{[key:string]:string}>({});

    const {triggerSoundEffect} = useAudio();

    useEffect(()=>{
      return triggerSoundEffect('trivia');
    },[triggerSoundEffect]);

    useEffect(()=>{
      players.forEach((player)=>{
        if(playerAnswers[player.id]){
          dispatch(setPlayerInstructions({playerId: player.id, instructions: 'Please wait...'}))
          dispatch(setPlayerControls({playerId: player.id, controls:[]}) )
        } else{
          dispatch(setPlayerInstructions({playerId: player.id, instructions: triviaQuestion.question}))
          dispatch(setPlayerControls({playerId: player.id,
            controls:answers}),
          )}
        }
      );
    },[players, playerAnswers, dispatch, answers, triviaQuestion.question])


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
      if(players && Object.keys(playerAnswers).length == players.length && !completed){
        const points = calculatePoints(triviaQuestion.difficulty);
        setCompleted(true);
        setTimeout(()=>{
          players.filter((player)=>playerAnswers[player.id] == triviaQuestion.answer).forEach((winner)=>{
            dispatch(givePlayerPoints({playerId: winner, points }));
            dispatch(givePlayerGold({playerId: winner, gold: points }));
          });
        }, 2000);
        setTimeout(()=>{
          dispatch(clearAllPlayerControls())
          dispatch(closeModal());
        }, 4000)
        setTimeout(()=>{
          dispatch(triggerNextQueuedAction());
        },5000)
      }
    },[playerAnswers, players, dispatch, triviaQuestion.answer, triviaQuestion.difficulty, setCompleted, completed])

    
    return (
      <div
        className="flex flex-col w-full gap-4 items-center max-w-[50dvw]" 
      >
        <h1 className="text-4xl font-bold text-black text-center pb-2">{triviaQuestion.category}</h1>
        <h2 className="text-4xl text-black max-w-screen">
          {triviaQuestion.question}
        </h2>
        <div className="grid grid-flow-dense gap-2">
        {completed &&
          <div>
            <h1 className="text-4xl text-black text-center">Correct Answer: {triviaQuestion.answer}</h1>
            <div className="flex flex-row gap-2">
              {players.map((player)=>{
                return (
                  <div key={player.name} className="w-full flex items-center justify-items-center content-center justify-center">
                    <PlayerCard 
                    player={{...player}} 
                    showPoints={true} 
                    showGold={true} 
                    className={playerAnswers[player.id] == triviaQuestion.answer ? 'border-green-800 bg-green-400' : 'border-red-800 bg-red-400'} 
                    />
                  </div>
                )
              })}
              
              </div>
          </div>
        }
        {!completed &&answers.map(({ label }) => (
          <div
            key={label as string}
            className="text-center w-full border-2 border-white rounded-xl px-4 overflow-hidden text-ellipsis flex justify-center items-center select-none min-w-96 bg-black text-white"
            style={{
              fontSize: "clamp(2rem, 100rem, 4rem)",
              filter:  "drop-shadow(4px 4px 10px #ffffff)",
            }}
          >
            <div style={{ textTransform: "capitalize" }}>
              {label}
            </div>
          </div>
        ))}
        </div>
      </div>
    );
  };

export default Trivia;
