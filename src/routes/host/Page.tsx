import { Suspense, lazy } from "react";
import clsx from "clsx";
import { BoardDimensionsProvider, useBoardDimensionsContext } from "$contexts/BoardDimensionsContext";
import { RegistrationProvider } from "$contexts/RegistrationContext";
import { Link } from "react-router-dom";
import Logo from "$components/Logo";
const MainGame = lazy(async()=>await import( "$components/MainGame"));
const ScoreBoard = lazy(async()=>await import( "$components/ScoreBoard"));

function PageContent(): JSX.Element {
  const { width:boardWidth, containerRef } = useBoardDimensionsContext();
  if (boardWidth > 0 && boardWidth < 600) {
    return <div className="flex flex-col items-center gap-4">
      <Logo />
      <h1 className="text-3xl text-center">
        Host mode currently only works on desktop.
      </h1>
      <Link className="bg-slate-700 rounded-xl p-4" to="/">Return to main menu</Link>
    </div>
  }
  return (
    <div className="w-full p-4 h-screen">
      <div className="flex flex-row w-full h-full" >
        <div className="pr-4 w-max">
          <ScoreBoard />
        </div>
        <div
          ref={containerRef}
          className={clsx(`rounded-xl overflow-hidden bg-gradient-radial from-pink-400 to-fuchsia-200 flex items-center place-content-center flex-1 h-full`)}
        >
          <Suspense fallback={<div className="animate-pulse min-w-full min-h-full w-full flex-grow h-full bg-gradient-radial from-pink-400 to-fuchsia-400 flex place-items-center justify-center items-center justify-items-center content-center"><div className="mx-auto my-auto text-center text-8xl font-bold">Loading...</div></div>}>
            <MainGame />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function Page(): JSX.Element {
  return (
    <RegistrationProvider>
      <BoardDimensionsProvider>
        <PageContent />
      </BoardDimensionsProvider>
    </RegistrationProvider>
  );
}

export default Page;
