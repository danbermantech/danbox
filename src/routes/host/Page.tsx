import ScoreBoard from "$components/ScoreBoard";
import ModalContents from "$components/ModalContents";
import clsx from "clsx";
import { StoreData } from "$store/types";
import { useDispatch, useSelector } from "react-redux";
import { setMaxRounds } from "$store/slices/gameProgressSlice";
import useBoardDimensions from "$hooks/useBoardDimensions";

// const boardWidth = (()=>window.innerWidth - 512)();
// const boardHeight = (()=>window.innerHeight - 32)();


function Page(): JSX.Element {
  const gameMode = useSelector((state:StoreData)=>state.game.mode);
  const maxRounds = useSelector((state:StoreData)=>state.game.maxRounds);
  const dispatch = useDispatch();
  const {boardWidth, boardHeight } = useBoardDimensions();

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
        <ModalContents />
        </div>
        {/* <PixiHost /> */}
      </div>
    </div>
  );
}

export default Page;
