import { useEffect, useState, useMemo, useCallback } from "react";
// import {  useSelector } from "react-redux";
import { clearAllPlayerControls, setPlayerControls, givePlayerGold, givePlayerPoints, setPlayerInstructions } from "$store/slices/playerSlice";
import TriviaQuestions, { TriviaQuestion } from "constants/triviaQuestions";
// import { StoreData } from "$store/types";
import triggerNextQueuedAction from "$store/actions/triggerNextQueuedAction";
import { endMinigame } from "$store/slices/gameProgressSlice";
import PlayerCard from "./PlayerCard";
import usePeerDataReceived, { PeerDataCallbackPayload } from "$hooks/useDataReceived";
import {v4 as uuidv4} from 'uuid'
import useAudio from "$hooks/useAudio";
import { useAppDispatch, useAppSelector } from "$store/hooks";

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
    const players = useAppSelector((state) => state.players);

    const dispatch = useAppDispatch();

    const answers = useMemo(()=>{
      return [triviaQuestion.answer, ...triviaQuestion.incorrect_answers]
        .sort(()=>{return Math.random() - 0.5})
        .map((answer)=>({label: answer, value: answer, action: actionId}));
    },[triviaQuestion, actionId])

    const [playerAnswers, setPlayerAnswers] = useState<{[key:string]:string}>({});

    const {triggerSoundEffect} = useAudio();



    useEffect(()=>{
      dispatch((disp)=>{

        players.forEach((player)=>{
          if(playerAnswers[player.id]){
          disp(setPlayerInstructions({playerId: player.id, instructions: 'Please wait...'}))
          disp(setPlayerControls({playerId: player.id, controls:[]}) )
        } else{
          disp(setPlayerInstructions({playerId: player.id, instructions: triviaQuestion.question}))
          disp(setPlayerControls({playerId: player.id,
            controls:answers}),
            )}
          }
          );
      })
    },[players, playerAnswers, dispatch, answers, triviaQuestion.question])


    const dataReceivedCallback = useCallback((data:PeerDataCallbackPayload, peerId:string) => {
      triggerSoundEffect(`dink${Math.floor(Math.random()*8)}`)  
      setPlayerAnswers((prev)=>{
        const next = {...prev};
        next[peerId] = data.payload.value;
        return next;
      })
    }, [setPlayerAnswers, triggerSoundEffect]);

    usePeerDataReceived(dataReceivedCallback, actionId)

    const [completed, setCompleted] = useState(false);

    const [results, setResults] = useState<{[id:string]:boolean}>({});

    useEffect(()=>{
      if(players && Object.keys(playerAnswers).length == players.length && Object.keys(results).length == 0){
        // setCompleted(true);
        setResults(()=>{
          const retVal:{[id:string]:boolean} = {};
          players.forEach((player)=>{retVal[player.id] = (playerAnswers[player.id] == triviaQuestion.answer)});
          return retVal;
        })
      } 
    },[playerAnswers, players, dispatch, setCompleted, triviaQuestion.answer, completed, results])

    useEffect(()=>{
      if(completed) return triggerSoundEffect('hooray');
      return triggerSoundEffect('trivia');
    },[triggerSoundEffect, completed]);

    const endTrivia = useCallback(()=>{
      let t1: NodeJS.Timeout
        if(!Object.keys(results).length) return;
        const t = setTimeout(()=>{
          const points = calculatePoints(triviaQuestion.difficulty);
          if(completed) return;
          players.filter((player)=>results[player.id]).forEach((winner)=>{
            dispatch(givePlayerPoints({playerId: winner.id, points }));
            dispatch(givePlayerGold({playerId: winner.id, gold: points }));
          });
          t1 = setTimeout(()=>{
            dispatch(clearAllPlayerControls())
            dispatch(endMinigame());
            setTimeout(()=>dispatch(triggerNextQueuedAction(), 1000))
          }, 3000)
        }, 1000);
        setCompleted(true);
        if(completed) return ()=>{
          console.log('returning')
          clearTimeout(t);
          clearTimeout(t1);
        }
    },[completed, results, dispatch, triviaQuestion.difficulty, players])

    useEffect(endTrivia,[endTrivia])
    
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
