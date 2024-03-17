import { Suspense, lazy } from "react";
import clsx from "clsx";
import type { StoreData } from "$store/types";
import { useDispatch, useSelector } from "react-redux";
import { setMaxRounds } from "$store/slices/gameProgressSlice";
import useBoardDimensions from "$hooks/useBoardDimensions";
import { Link } from "react-router-dom";
import Logo from "$components/Logo";
const MainGame = lazy(async()=>await import( "$components/MainGame"));
const ScoreBoard = lazy(async()=>await import( "$components/ScoreBoard"));

// const boardWidth = (()=>window.innerWidth - 512)();
// const boardHeight = (()=>window.innerHeight - 32)();


function Page(): JSX.Element {
  const gameMode = useSelector((state:StoreData)=>state.game.mode);
  const maxRounds = useSelector((state:StoreData)=>state.game.maxRounds);
  const dispatch = useDispatch();
  const {boardWidth, boardHeight } = useBoardDimensions();
  if (boardWidth < 600) {
    return <div className="flex flex-col items-center gap-4">
      <Logo />
      <h1 className="text-3xl text-center">
        Host mode currently only works on desktop.
      </h1>
      <Link className="bg-slate-700 rounded-xl p-4" to="/">Return to main menu</Link>
    </div>
  }
  return (
    <div className="w-full p-4 ">
      <div className="flex flex-row w-full" >
      </div>
      <div className="flex flex-row w-full" >
        <div className=" pr-4 w-full flex-grow" >
        {
          gameMode == 'REGISTRATION' ? 
          <div className="w-full flex h-full bg-gradient-to-bl p-4 from-pink-200 to-fuchsia-400 rounded-xl">
            <div className="">
              <div className="flex flex-row w-full gap-2">
                <label htmlFor="maxRoundsInput" className="text-white font-bold text-2xl">Game Length</label>
                <input id="maxRoundsInput" className=" text-2xl bg-transparent font-bold text-white border-4 border-white rounded pl-2" type="number" value={maxRounds} onChange={(e)=>{dispatch(setMaxRounds((e.target.value)))}} />
              </div>
            </div>
          </div>
          :<ScoreBoard />
        }  
        </div>
        <div className={clsx(`w-[${boardWidth}px] rounded-xl overflow-hidden bg-gradient-radial from-pink-400 to-fuchsia-200 flex items-center place-content-center`)}
        style={{width:boardWidth, minWidth: boardWidth, maxWidth: boardWidth, height: boardHeight }}>
        <Suspense fallback={<div className="animate-pulse min-w-full min-h-full w-full h-full bg-gradient-radial from-pink-400 to-fuchsia-400 flex place-items-center justify-center items-center justify-items-center content-center"><div className="mx-auto my-auto text-center text-8xl font-bold">Loading...</div></div>}>
          <MainGame />
        </Suspense>
        </div>
        {/* <PixiHost /> */}
      </div>
    </div>
  );
}

export default Page;
