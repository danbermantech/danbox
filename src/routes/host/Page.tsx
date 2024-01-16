import PixiHost from "$components/pixi/PixiHost";
import HostModal from "$components/HostModal";
import ScoreBoard from "$components/ScoreBoard";

function Page(): JSX.Element {

  return (
    <div className="w-full p-4">
      <div className="flex flex-row w-full" >
        <HostModal />
      </div>
      <div className="flex flex-row w-full" >
        <div className=" pr-4 w-full flex-grow" >
          <ScoreBoard />
        </div>
        <PixiHost />
      </div>
    </div>
  );
}

export default Page;
