import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAllPlayerControls, setPlayerControls, givePlayerGold, givePlayerPoints } from "$store/slices/playerSlice";
import TriviaQuestions from "constants/triviaQuestions";
import { StoreData } from "$store/types";
import triggerNextQueuedAction from "$store/actions/triggerNextQueuedAction";
import { closeModal } from "$store/slices/gameProgressSlice";
import PlayerCard from "./PlayerCard";
import usePeerDataReceived, { PeerDataCallbackPayload } from "$hooks/useDataReceived";
import {v4 as uuidv4} from 'uuid'
import useAudio from "$hooks/useAudio";
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
    },[]);

    useEffect(()=>{
      players.forEach((player)=>{
        if(playerAnswers[player.id]){
          dispatch(setPlayerControls({playerId: player.id, controls:[]}) )
        } else{
          dispatch(setPlayerControls({playerId: player.id,
            controls:answers}),
          )}
        }
      );
    },[players, playerAnswers, dispatch, answers])


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
      if(players.length && Object.keys(playerAnswers).length == players.length){
        const points = (()=>{
          switch(triviaQuestion.difficulty){
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
        setTimeout(()=>{
          players.filter((player)=>playerAnswers[player.id] == triviaQuestion.answer).forEach((winner)=>{
            dispatch(givePlayerPoints({playerId: winner.id, points }));
            dispatch(givePlayerGold({playerId: winner.id, gold: points }));
          });
          setTimeout(()=>{
            dispatch(clearAllPlayerControls())
            dispatch(closeModal());
            setTimeout(()=>{
              dispatch(triggerNextQueuedAction());
            },1000)
          }, 2000)
        }, 2000);
      }
    },[playerAnswers, players, dispatch, triviaQuestion.answer, triviaQuestion.difficulty, setCompleted])

    
    return (
      <div
        className="flex flex-col w-full gap-4 items-center max-w-[50dvw]" 
      >
        <h1 className="text-4xl font-bold text-black text-center pb-2">{triviaQuestion.category}</h1>
        <h2 className="text-4xl text-black max-w-screen">
          {triviaQuestion.question}
        </h2>
        <div className="grid grid-flow-dense">
        {completed &&
          <div>
            <h1 className="text-4xl text-black text-center">Correct Answer: {triviaQuestion.answer}</h1>
            <div className="flex flex-row gap-2">
              {players.map((player)=>(
                <div key={player.name} className="w-full flex items-center justify-items-center content-center justify-center">
                <PlayerCard player={player} className={playerAnswers[player.id] == triviaQuestion.answer ? 'border-green-800 bg-green-400' : 'border-red-800 bg-red-400'} />
                </div>  
              ))}
              
              </div>
          </div>
        }
        {!completed &&answers.map(({ label }) => (
          <div
            key={label as string}
            style={{
              textAlign: "center",
              width: "100%",
              border: "2px solid white",
              borderRadius: "12px",
              fontSize: "clamp(2rem, 100rem, 4rem)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              userSelect: "none",
              minWidth: "400px",
              color: 'white',
              background:  "black",
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
