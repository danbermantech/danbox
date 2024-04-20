import { useEffect, useRef, useCallback, useLayoutEffect, useState,  } from 'react';
import useBoolean from '$hooks/useBoolean';
// import gradientCreator from '$utils/gradientCreator';
function gradientCreator(
  angle: number|string,
  startColor: string,
  endColor: string,
  midPoint: number
): string {
  return `linear-gradient(${angle}, ${startColor} 0%, ${startColor} ${midPoint}%, ${endColor} ${midPoint}%, ${endColor} 100%)`;
}
const faderWrapperClasses = 'bottom-0 h-full w-full';

const faderControlClasses = 'grid-row-full grid-column-full w-full h-full border-2 border-solid border-text hover:will-change-[background] active:will-change-[background] focus:will-change-[background] focus:outline-none';
type FaderProps = {
  faderDirection: 'up' | 'down' | 'left' | 'right' | 'horizontalCenter' | 'verticalCenter',
  faderOffBehavior: 'snapMin'|'snapMax'|'snapCenter'|'hold',
  min: number,
  max: number,
  value: number,
  onChange: (value:number)=>void,
}

function Fader(props:FaderProps) {
  const {faderDirection, min, max, onChange, value, faderOffBehavior} = props;
  const [isPressed, , press, unPress] = useBoolean(false);
  const faderRef = useRef<HTMLDivElement|null>(null);

  // const faderInteractionMode = useMIDIComponentContext((cv) => cv.state.faderInteractionMode);
  const interact = useCallback(
    (event:React.PointerEvent<HTMLDivElement>) => {
      switch(faderDirection){
        case('right'):
        case('horizontalCenter'):{
          if(!isPressed) return;
          const {offsetWidth} = event.currentTarget;
          const offsetX = Math.min(Math.max(event.nativeEvent.offsetX, 0), offsetWidth);
          const p = Math.abs(offsetX / offsetWidth);
          const scale = max - min;
          const offset = min;
          const nextValue = Math.max((1 - p) * scale + offset, min);
          // console.log(value);
          if (value !== nextValue) {
            onChange(nextValue)
          }
          break;
        }
        case('up'):
        case('verticalCenter'):{
          if(!isPressed) return;
          const {offsetHeight} = event.currentTarget;
          const offsetY = Math.min(Math.max(event.nativeEvent.offsetY, 0), offsetHeight);
          const p = Math.abs(offsetY / offsetHeight);
          const scale = max - min;
          const offset = min;
          // console.log(p, scale)
          const nextValue = Math.max((1 - p) * scale + offset, min);
          // console.log(value)
          if (value !== nextValue) {
            onChange(nextValue)
          }
          break;
        }
        case('left'):{
          if(!isPressed) return;
          const {offsetWidth} = event.currentTarget;
          const offsetX = Math.min(Math.max(event.nativeEvent.offsetX, 0), offsetWidth);
          const p = Math.abs(offsetX / offsetWidth);
          const scale = max - min;
          const offset = min;
          // console.log(p)
          const nextValue = max - Math.max(p * scale + offset, min);
          // console.log(value)
          if (value !== nextValue) {
            onChange(nextValue)
          }
          break;
        }
        case('down'):{
          if(!isPressed) return;
          const {offsetHeight} = event.currentTarget;
          const offsetY = Math.min(Math.max(event.nativeEvent.offsetY, 0), offsetHeight);
          const p = Math.abs(offsetY / offsetHeight);
          const scale = max - min;
          const offset = min;
          const nextValue =  max - Math.max(p * scale + offset, min);
          // console.log(value)
          if (value !== nextValue) {
            onChange(nextValue)
          }
          break;
        }
        default:{
          break;
        }
      }
    },[isPressed, onChange, min, max, value, faderDirection])

    const [bgString, setBgString] = useState('#aaaaff');

  useLayoutEffect(() => {
    // switch(faderInteractionMode){
    //   case('Horizontal'):{

    switch(faderDirection){
      case('up'):{
        const nextValue = ((1 - (value - min) / (max - min)) * 100)
        const tempGradient = gradientCreator(
          '180deg',
          '#222266',
          '#aaaaff',
          nextValue
        );
        setBgString(tempGradient);
        break;
      }
      case('right'):{
        const nextValue = ((value - min) / (max - min) * 100)
        const tempGradient = gradientCreator(
          '270deg',
          '#222266',
          '#aaaaff',
          nextValue
        );
        setBgString(tempGradient);
        break;
      }
      case('down'):{
        const nextValue = ((1 - (value - min) / (max - min)) * 100)
        const tempGradient = gradientCreator(
          '180deg',
          '#aaaaff',
          '#222266',
          nextValue
        );
        setBgString(tempGradient);
        break;
      }
      case('left'):{
        const nextValue = ((value - min) / (max - min) * 100)
        const tempGradient = gradientCreator(
          '270deg',
          '#aaaaff',
          '#222266',
          nextValue
        );
        setBgString(tempGradient);
        break;
      } 
      case('horizontalCenter'):{
        const nextValue = ((value - min) / (max - min) * 100)
        // const tempGradient = gradientCreator(
        //   '270deg',
        //   '#aaaaff',
        //   '#222266',
        //   nextValue
        // );
        const tempGradient = `linear-gradient(270deg, #aaaaff 0%, #aaaaff ${nextValue-1}%, #222266 ${nextValue-1}%, #222266 ${nextValue+1}%, #aaaaff ${nextValue+1}%, #aaaaff 100%)`;
        setBgString(tempGradient);
        break;
      } 
    }
  }, [min, max, value, faderDirection]);

  const handleMouseDown = useCallback(() => {
    press();
  }, [press]);

  

  const handleMouseUp = useCallback(() => {
    switch(faderOffBehavior){
      case('snapMin'):{
        onChange(min)
        break;
      }
      case('snapMax'):{
        onChange(max)
        break;
      }
      case('snapCenter'):{
        onChange((max+min)/2)
        break;
      } 
      case('hold'):
      default:{
        break;
      }
    }
    unPress();
    // if(faderOffBehavior === 'return'){
    // }
  }, [unPress,  min, max, faderOffBehavior, onChange]);

  useEffect(() => {
    if(!faderRef.current) return;
    faderRef.current.addEventListener(
      'touchmove',
      (event) => {
        try{
          event.preventDefault();
        }catch(e){return}
      },
      { passive: false }
    );
    faderRef.current.addEventListener(
      'pointermove',
      (event) => {
        try{
          event.preventDefault();
        }catch(e){console.log(e, event)}
      },
      { passive: false }
    );
  }, []);

  return (
    <div className={faderWrapperClasses}>
      <div
        tabIndex={0}
        role="slider"
        ref={faderRef}
        aria-valuenow={value}
        style={{background: bgString}}
        className={`fader ${faderControlClasses}`}
        onPointerMove={interact}
        onPointerDown={handleMouseDown}
        onPointerUp={handleMouseUp}
      />
    </div>
  )
}

export default Fader;
