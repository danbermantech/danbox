import { useCallback, useEffect, useRef, useState } from "react";
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

    const selectionsRef = useRef(selections);
    useEffect(() => { selectionsRef.current = selections; }, [selections]);

    const spinningRef = useRef(spinning);
    useEffect(() => { spinningRef.current = spinning; }, [spinning]);

    useEffect(() => {
      const interval = setInterval(() => {
        const firstSpinning = spinning.findIndex((s) => s);
        // console.log(firstSpinning, started, completed)
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
      if (resultsSent) return;
      setCompleted(true);
      setResultsSent(true);
      const sel = selectionsRef.current;
      const obj: Record<string, string> = {};
      options.forEach(({ label }, i) => {
        obj[label] = options[i].options[sel[i]];
      });
      dispatch(clearAllPlayerControls());
      onComplete({
        indexes: sel,
        values: sel.map((s, i) => options[i].options[s]),
        obj,
      });
    }, [options, onComplete, resultsSent, dispatch]);

    const handleClick = useCallback(() => {
      if (!started) {
        setStarted(true);
        setSpinning(prev => prev.map(() => true));
        return;
      }
      const currentSpinning = spinningRef.current;
      const firstSpinning = currentSpinning.findIndex((s) => s);
      if (firstSpinning === -1) return;
      const nextSpinning = currentSpinning.map((s, i) => i === firstSpinning ? false : s);
      setSpinning(nextSpinning);
      if (nextSpinning.every((s) => !s)) {
        handleOnComplete();
      } else {
        onChange(
          options[firstSpinning].label,
          options[firstSpinning].options[selectionsRef.current[firstSpinning]],
        );
      }
    }, [started, onChange, options, handleOnComplete]);

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
              height: "200px",
              border: "2px solid white",
              borderRadius: "12px",
              fontSize: "clamp(2rem, 100rem, 4rem)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              userSelect: "none",
              minWidth: "300px",
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
