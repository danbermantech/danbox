import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearAllPlayerControls, setPlayerControls } from "$store/slices/playerSlice";
import usePeerDataReceived from "$hooks/useDataReceived";
import { v4 as uuidv4 } from "uuid";

const OptionMachine =
  (
    {
      options,
      onComplete,
      onChange,
      spinRate = 100,
      forPlayer,
    }: {
      options: { label: string; options: string[] }[];
      onComplete: (value: {
        indexes?: number[];
        values?: string[];
        obj: Record<string, string>;
        
      }) => void;
      onChange: (key: string, value: string) => void;
      spinRate?: number;
      forPlayer: string
    }
  ): React.ReactNode => {
    const [selections, setSelections] = useState(
      Array.from({ length: options.length }, () => 0),
    );
    const [spinning, setSpinning] = useState(
      Array.from({ length: options.length }, () => false),
    );
    const [started, setStarted] = useState(false);

    const [completed, setCompleted] = useState(false);
    const [resultsSent, setResultsSent] = useState(false);

    const [actionId] = useState(()=>uuidv4());
    useEffect(() => {
      const interval = setInterval(() => {
        const firstSpinning = spinning.findIndex((s) => s);
        console.log(firstSpinning, started, completed)
        if (!started ||  firstSpinning == -1 || completed) return;
        setSelections((prevSelections) => {
          const nextSelections = [...prevSelections];

          for (let i = firstSpinning; i < options.length; i++) {
            const values = options[i].options;
            nextSelections[i] = (nextSelections[i] + 1) % values.length;
          }
          return nextSelections;
        });
      }, spinRate);
      return () => clearInterval(interval);
    }, [
      selections,
      setSelections,
      spinning,
      setSpinning,
      options,
      completed,
      spinRate,
      started,
    ]);

    const dispatch = useDispatch();
    useEffect(() => {
      if (!started && !completed) {
        dispatch(clearAllPlayerControls());
        dispatch(
          setPlayerControls({playerId: forPlayer,
            controls:[
            { label: "SPIN!", value: "stop", action:actionId, className:'text-4xl bg-green-600 text-white', filters: {} },
          ]}),
        );
        return;
      }
      if (started && !completed) {
        dispatch(
          setPlayerControls({playerId:forPlayer,
            controls: [
            { label: "STOP!", value: "stop",action:actionId, className:'text-4xl bg-red-600 text-white',  filters: {} },
          ]}),
        );
        return;
      }
      dispatch(clearAllPlayerControls());
    }, [started, completed, dispatch, forPlayer, actionId]);

    const handleOnComplete = useCallback(() => {
      setCompleted(true);
      console.log(completed, resultsSent);
        console.log("completed");
        setResultsSent(true);
        const obj: Record<string, string> = {};
        options.forEach(({ label }, i) => {
          obj[label] = options[i].options[selections[i]];
        });
        dispatch(clearAllPlayerControls());
        onComplete({
          indexes: selections,
          values: selections.map((s, i) => options[i].options[s]),
          obj,
        });
    }, [
      completed,
      selections,
      options,
      onComplete,
      resultsSent,
      setResultsSent,
      dispatch
    ]);

    const handleClick = useCallback(() => {
      console.log('clicked')
      let _nextSpinning = [...spinning];
      setSpinning((prevSpinning) => {
        const nextSpinning = [...prevSpinning];
        const firstSpinning = nextSpinning.findIndex((s) => s);
        nextSpinning[firstSpinning] = false;
        _nextSpinning = nextSpinning
        if (firstSpinning == -1) {
          _nextSpinning = nextSpinning.map(() => true);
          return nextSpinning.map(() => true);
        }
        return nextSpinning;
      });
      if(!started) return setStarted(true)
      if (_nextSpinning.findIndex((x)=>x) == (spinning.length - 1) && started) return handleOnComplete();
      if (!started) return
      // setChangeSent(() => _nextSpinning.map((s) => !s));
      console.log(_nextSpinning)
      if (_nextSpinning.every((s) => !s) ) return;
      onChange(
        options[spinning.findIndex((x)=>x)].label,
        options[spinning.findIndex((x)=>x)].options[
          selections[spinning.findIndex((x)=>x)]
        ],
      );
      return;
    }, [
      spinning,
      setSpinning,
      started,
      setStarted,
      selections,
      onChange,
      options,
      // setChangeSent,
      handleOnComplete,
    ]);

    // const dataReceivedCallback = useCallback((data:{type:string, payload:{value:string}}) => {
    //     handleClick();
    //   }
    // }, [handleClick]);

    usePeerDataReceived(handleClick,actionId)

    return (
      <div
        className="contents"  
        onClick={handleClick}
      >
        {options.map(({ label, options }, i) => (
          <div
            key={label}
            style={{
              textAlign: "center",
              width: "100%",
              height: "300px",
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
              color: spinning[i]
                ? `rgb(${Math.floor(Math.random() * 100) + 50}, 
                ${Math.floor(Math.random() * 100) + 50}, 
                ${Math.floor(Math.random() * 100) + 50})`
                : "white",
              background: spinning[i] ? "#333333" : "black",
              filter: spinning[i]
                ? "drop-shadow(4px 4px 10px #ffffff)"
                : "none",
            }}
          >
            <div style={{ textTransform: "capitalize" }}>
              {started ? options[selections[i]] : '???'}
            </div>
          </div>
        ))}
      </div>
    );
  };

export default OptionMachine;
