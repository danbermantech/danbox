import { useEffect, useState, useMemo } from "react";
import { usePeer } from "$hooks/usePeer";
import { useDispatch, useSelector } from "react-redux";
import { clearAllPlayerControls, givePlayerControls, givePlayerGold, givePlayerPoints } from "$store/slices/playerSlice";
import TriviaQuestions from "constants/triviaQuestions";
import { StoreData } from "$store/types";
import triggerNextQueuedAction from "$store/actions/triggerNextQueuedAction";
import { closeModal } from "$store/slices/gameProgressSlice";
import PlayerCard from "./PlayerCard";

const Trivia =
  () => {
    const onDataReceived = usePeer((cv) => cv.onDataReceived) as (
      cb: (
        data: {
          // peerId: string;
          type: string;
          payload: { action: string; value: string, peerId: string };
        },
        peerId: string
      ) => void,
      id: string,
    ) => void;

    const removeOnDataReceivedListener = usePeer((cv) => cv.removeOnDataReceivedListener) as (listenerId:string)=>void

    const triviaQuestion = useMemo(() => {
      const triviaQuestion = TriviaQuestions[Math.floor(Math.random() * TriviaQuestions.length)];
      return triviaQuestion;
    }, []);

    const players = useSelector((state:StoreData) => state.players);

    const dispatch = useDispatch();

    const answers = useMemo(()=>{
      return [triviaQuestion.answer, ...triviaQuestion.incorrect_answers]
        .sort(()=>{return Math.random() - 0.5})
        .map((answer)=>({label: answer, value: answer, action: 'triviaVote'}));
    },[triviaQuestion])

    const [playerAnswers, setPlayerAnswers] = useState<{[key:string]:string}>({});

    useEffect(()=>{
      players.forEach((player)=>{
        if(playerAnswers[player.id]){
          dispatch(givePlayerControls({playerId: player.id, controls:[]}) )
        } else{
          dispatch(givePlayerControls({playerId: player.id,
            controls:answers}),
          )}
        }
      );
    },[players, playerAnswers, dispatch, answers])

    useEffect(() => {
      onDataReceived &&
      onDataReceived(
        (data, peerId) => {
          console.log(data, peerId);
          if (data.type == "playerAction"){
            setPlayerAnswers((prev)=>{
              const next = {...prev};
              next[peerId] = data.payload.value;
              return next;
            })
          }
        },'trivia'
        );

      return ()=>{removeOnDataReceivedListener('trivia')}
    }, [removeOnDataReceivedListener, onDataReceived, setPlayerAnswers, dispatch]);

    const [completed, setCompleted] = useState(false);

    useEffect(()=>{
      if(players.length && Object.keys(playerAnswers).length == players.length){
        // console.log('winners:', Object.keys(playerAnswers).filter((player)=>playerAnswers[player] == triviaQuestion.answer))
        // console.log('losers', Object.keys(playerAnswers).filter((player)=>playerAnswers[player] != triviaQuestion.answer))
        // setWinners(players.filter((player)=>{
        //   const answer = playerAnswers[player.id];
        //   return answer == triviaQuestion.answer;
        // }))
          // Object.keys(playerAnswers).filter((player)=>playerAnswers[player] == triviaQuestion.answer)});
        // const losers = Object.keys(playerAnswers).filter((player)=>playerAnswers[player] != triviaQuestion.answer);
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
        // onComplete({obj: playerAnswers});
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
            {/* <h2 className="text-4xl text-black text-center">Winners</h2> */}
            <div className="flex flex-row gap-2">
              {players.map((player)=>(
                <div className="w-full flex items-center justify-items-center content-center justify-center">
                <PlayerCard player={player} className={playerAnswers[player.id] == triviaQuestion.answer ? 'border-green-800 bg-green-400' : 'border-red-800 bg-red-400'} />
                </div>  
                // <div 
                // className="text-4xl  text-black w-full text-center flex items-center flex-col font-bold mb-4">
                //   <div 
                //   data-winner={triviaQuestion.answer == playerAnswers[player.id]} 
                //   className="bg-white p-4 rounded-2xl border-black border-4 data-[winner=true]:border-green-800 data-[winner=true]:bg-green-400">
                //     <h2>
                //       {player.name.toLocaleUpperCase()}
                //     </h2>
                //     <img src={player.image} width="400" height="400" className="w-32 h-32 rounded-full" />
                //   </div>
                // </div>
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
              // height: "300px",
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
