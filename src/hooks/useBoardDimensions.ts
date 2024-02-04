import { useEffect, useState } from "react";

function calculateBoardWidth(){
  if(window.innerWidth >= 1024){
    return window.innerWidth -512;
  } else {
    return window.innerWidth;
  }
}

function calculateBoardHeight(){
  if(window.innerHeight >= 1024){
    return window.innerHeight - 32;
  } else {
    return window.innerWidth * 0.788;
  }
}

export default function useBoardDimensions(){
  const [width, setWidth] = useState(calculateBoardWidth);
  const [height, setHeight] = useState(calculateBoardHeight);
  useEffect(()=>{window.addEventListener('resize', ()=>{
    setWidth(calculateBoardWidth);
    setHeight(calculateBoardHeight);
  })}, [])

  return {width, height, boardWidth:width, boardHeight:height};

}