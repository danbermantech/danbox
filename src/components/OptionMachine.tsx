import { useCallback, useEffect, useState, forwardRef } from "react";
import { usePeer } from "$hooks/usePeer";
import { useDispatch } from "react-redux";
// import { setCurrentPlayerActions } from "$store/slices/gameProgressSlice";
import { clearAllPlayerControls, givePlayerControls } from "$store/slices/playerSlice";
import useForwardedRef from "$hooks/useForwardedRef";
const OptionMachine = forwardRef(
  (
    {
      options,
      onComplete,
      onChange,
      spinRate = 100,
      forPlayer,
      // hostMode = false
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
    },
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ): React.ReactNode => {
    const [selections, setSelections] = useState(
      Array.from({ length: options.length }, () => 0),
    );
    const [spinning, setSpinning] = useState(
      Array.from({ length: options.length }, () => false),
    );
    const [started, setStarted] = useState(false);
    const [changeSent, setChangeSent] = useState(
      Array.from({ length: options.length }, () => false),
    );
    const [completed, setCompleted] = useState(false);
    const [resultsSent, setResultsSent] = useState(false);
    const onDataReceived = usePeer((cv) => cv.onDataReceived) as (
      cb: (
        data: {
          type: string;
          payload: { action: string; value: string };
        }
      ) => void,
      id:string
    ) => void;

    const removeOnDataReceivedListener = usePeer((cv) => cv.removeOnDataReceivedListener) as (listenerId:string)=>void

    useEffect(() => {
      const interval = setInterval(() => {
        const firstSpinning = spinning.findIndex((s) => s);
        if (spinning.every((s) => !s) && started && !completed)
          return
        if (firstSpinning == -1) return;
        setSelections((prevSelections) => {
          const nextSelections = [...prevSelections];

          for (let i = firstSpinning; i < options.length; i++) {
            const values = options[i].options;
            // console.log(values, values.length);
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
          givePlayerControls({playerId: forPlayer,
            controls:[
            { label: "SPIN", value: "stop", filters: {} },
          ]}),
        );
        return;
      }
      if (started && !completed) {
        dispatch(
          givePlayerControls({playerId:forPlayer,
            controls: [
            { label: "STOP", value: "stop", filters: {} },
          ]}),
        );
        return;
      }
      dispatch(clearAllPlayerControls());
    }, [started, completed, dispatch, forPlayer]);

    const handleOnComplete = useCallback(() => {
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
      setSpinning((prevSpinning) => {
        const nextSpinning = [...prevSpinning];
        const firstSpinning = nextSpinning.findIndex((s) => s);
        console.log(firstSpinning);
        if (firstSpinning == -1) return prevSpinning.map(() => true);
        nextSpinning[firstSpinning] = false;
        return nextSpinning;
      });
      if (spinning.findIndex((x)=>x == true) == (spinning.length - 1) && started) return handleOnComplete();
        if (started == false) {
          setStarted(true);
          setCompleted(false);
          setResultsSent(false);
          return;
        }

      if (
        started
      ) {
        setChangeSent(() => spinning.map((s) => !s));
        if (spinning.every((s) => !s) || spinning.every((s) => s)) return;
        console.log('key: ',options[spinning.findIndex((isSpinning) => !isSpinning)].label,
        'value:',options[spinning.findIndex((isSpinning) => !isSpinning)].options[
          selections[spinning.findIndex((isSpinning) => !isSpinning)]
        ],)
        console.log('option machine changing ', options[spinning.findIndex((isSpinning) => !isSpinning)].label,
        options[spinning.findIndex((isSpinning) => !isSpinning)].options[
          selections[spinning.findIndex((isSpinning) => !isSpinning)]
        ],)
        onChange(
          options[spinning.findIndex((isSpinning) => !isSpinning)].label,
          options[spinning.findIndex((isSpinning) => !isSpinning)].options[
            selections[spinning.findIndex((isSpinning) => !isSpinning)]
          ],
        );
      }
    }, [
      spinning,
      setSpinning,
      started,
      setStarted,
      selections,
      onChange,
      options,
      setChangeSent,
      setCompleted,
      setResultsSent,
      handleOnComplete,
    ]);

    useEffect(() => {
      // console.log(changeSent, spinning, selections);
      onDataReceived &&
        onDataReceived(
          (data) => {
            console.log(data);
            if (data.type == "playerAction" && data.payload.value == "stop") {
              handleClick();
            }
          },
          'optionMachine'
        );
        return ()=>{removeOnDataReceivedListener('optionMachine')};
    }, [
      onDataReceived,
      removeOnDataReceivedListener,
      handleClick,
      changeSent,
      spinning,
      selections,
      setChangeSent,
      setSpinning,
      setSelections,
    ]);

    const ref = useForwardedRef(forwardedRef);
    return (
      <div
        className="contents"  
        ref={ref}
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
  },
);

export default OptionMachine;
