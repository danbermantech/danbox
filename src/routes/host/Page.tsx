import ScoreBoard from "$components/ScoreBoard";
import ModalContents from "$components/ModalContents";
import clsx from "clsx";

const boardWidth = (()=>window.innerWidth - 512)();
const boardHeight = (()=>window.innerHeight - 32)();


function Page(): JSX.Element {

  return (
    <div className="w-full p-4">
      <div className="flex flex-row w-full" >
      </div>
      <div className="flex flex-row w-full" >
        <div className=" pr-4 w-full flex-grow" >
          <ScoreBoard />
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
