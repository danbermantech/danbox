import { usePeer } from "$hooks/usePeer";
import { useCallback, useEffect, useState } from "react";
import { getCookie, useCookie } from "utilities/cookies";
import { useLocation, useSearchParams } from "react-router-dom";
import CharacterCarousel from "./CharacterCarousel";
import clsx from "clsx";
import DriftingText from "./DritftingText";
import useMe from "$hooks/useMe";

const SignUp = () => {
  const connect = usePeer((cv) => cv.connect) as (
    hostId: string,
    options: { deviceName: string; image: string },
    onPeerConnect: (peer: unknown) => void,
  ) => void;
  const [searchParams, setSearchParams] = useSearchParams();
  const [hostId, setHostId] = useState(searchParams.get("hostId") ?? "");
  const peerConnected = usePeer((cv) => cv.peerConnected) as boolean;
  const peerReady = usePeer((cv) => cv.peerReady) as boolean;
  const peerErrors = usePeer((cv) => cv.peerErrors) as { message: string }[];
  const [playerName, setPlayerName] = useCookie("playerName");
  const [playerSprite, setPlayerSprite] = useCookie("playerSprite");
  const [tempName, setTempName] = useState(playerName ?? "");
  const [selectedSprite, setSelectedSprite] = useState(playerSprite ?? "");

  const [alert, setAlert] = useState("");
  const [connecting, setConnecting] = useState(false);
  useEffect(() => {
    if (peerErrors.length) {
      setAlert(peerErrors[peerErrors.length - 1].message);
      setConnecting(false);
    }
  }, [peerErrors]);

  useEffect(() => {
    if (peerConnected) setConnecting(false);
  }, [peerConnected]);

  const join = useCallback(() => {
    if (typeof connect == "function" && hostId && !peerConnected) {
      if (tempName.length >= 4) {
        setConnecting(true);
        setAlert("");
        connect(
          hostId.toLocaleUpperCase(),
          { deviceName: tempName, image: selectedSprite },
          (x) => {
            console.log(x);
          },
        );
        setPlayerName(tempName);
        setPlayerSprite(selectedSprite);
        setSearchParams({ hostId: hostId.toLocaleUpperCase() });
      } else {
        setAlert("Please enter a name");
      }
    }
  }, [
    connect,
    hostId,
    peerConnected,
    tempName,
    selectedSprite,
    setPlayerName,
    setPlayerSprite,
    setSearchParams,
  ]);

  const location = useLocation();
  useEffect(() => {
    if (
      location.pathname == "/play" &&
      peerReady &&
      !peerConnected &&
      getCookie("lastHostId") == searchParams.get("hostId") &&
      getCookie("playerName") &&
      getCookie("playerSprite")
    ) {
      setConnecting(true);
      connect(
        searchParams.get("hostId") as string,
        {
          deviceName: getCookie("playerName"),
          image: getCookie("playerSprite"),
        },
        (x) => {
          console.log(x);
        },
      );
    }
  }, [location.pathname, peerConnected, peerReady, searchParams, connect]);
  const me = useMe()
  return (
    <div className="w-full flex items-center p-4 justify-items-center content-center justify-center font-titan">
      {/* <div className="flex flex-row flex-grow w-full items-center justify-items-center content-center justify-center"> */}
      <div className="h-76 transition-[height] w-full lg:w-auto min-h-min  my-auto rounded-xl border-green-600 border-2 border-solid bg-white flex flex-col gap-4 items-center max-w-full bg-gradient-to-bl from-pink-200 to-fuchsia-400">
        <div className="flex flex-row justify-between items-center ">
          <h1 className="animate-fade pt-4 animate-duration-1000 text-8xl font-cursive font-bold text-center w-full text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-violet-600">
            Welcome
          <DriftingText text="Welcome" amplitude={3} speed={0.8} className="animate-fade animate-duration-1000 text-8xl font-cursive font-thin text-center w-full text-white/20 fixed left-0" />
          <DriftingText text="Welcome" amplitude={3} speed={0.8} className="animate-fade animate-duration-1000 text-8xl font-cursive font-thin text-center w-full text-black/20 fixed left-0" />
          </h1>
        </div>
        <div className="w-full px-4 gap-2 flex flex-col">
        <label
          htmlFor="hostIdInput"
          className="animate-fade px- transition-all text-transparent bg-clip-text w-full flex justify-between items-baseline bg-gradient-to-br from-pink-600 to-violet-600 text-2xl font-bold uppercase"
        >
          Host ID
          <input
            type="text"
            data-length={hostId.length}
            className="animate-fade flex-grow ml-2 tracking-wider animate-delay-500  w-32 placeholder:text-slate-600 border-b-2 text-pink-600 rounded-none text-xl bg-transparent bg-opacity-20 shadow-xl text-center uppercase font-bold"
            id="hostIdInput"
            placeholder="ABCXYZ"
            value={hostId}
            onChange={(event) => {
              setHostId(event.currentTarget.value.substring(0, 6));
            }}
          />
        </label>
        <div
          className={clsx(
            "text-red-600 text-sm ",
            hostId.length === 6 || hostId.length === 0 ? "hidden" : null,
          )}
        >
          HostID should be 6 characters long
        </div>
        <label
          data-disabled={hostId.length < 6}
          htmlFor="nameInput"
          className="animate-fade transition-all text-transparent bg-clip-text w-full flex justify-between items-baseline bg-gradient-to-br from-pink-600 to-violet-600 text-2xl font-bold uppercase"
        >
          Name
        <input
          disabled={hostId.length < 6}
          type="text"
          id="nameInput"
          className="animate-fade flex-grow ml-2 tracking-wider animate-delay-500 placeholder:text-slate-600 border-b-2 text-pink-600 rounded-none text-xl bg-transparent bg-opacity-20 shadow-xl text-center uppercase font-bold"
          placeholder="Mr. Manager"
          value={tempName}
          onChange={(event) => {
            setTempName(event.currentTarget.value.substring(0, 12));
          }}
        />
        </label>
        <div
          className={clsx(
            "text-red-600 text-sm ",
            tempName.length >= 4 || tempName.length == 0 ? "hidden" : null,
          )}
        >
          Name should be at least 4 characters long
        </div>
        <div
          data-disabled={tempName.length < 4 || hostId.length < 6}
          className="animate-fade transition-all text-transparent bg-clip-text w-full flex justify-between items-center bg-gradient-to-br from-pink-600 to-violet-600 text-2xl font-bold uppercase"
        >
          Avatar
          {/* {selectedSprite && ( */}
            <img
              src={selectedSprite || me?.image}
              className="cursor-pointer h-8 w-8 aspect-square ml-2 rounded-full border border-black snap-center select-none inline"
              width={64}
              height={64}
            />
          {/* )} */}
        </div>

        </div>
        <div
          data-disabled={tempName.length < 4 || hostId.length < 6}
          className="animate-fade w-full bg-white bg-opacity-40 rounded-xl shadow-xl data-[disabled=true]:hidden data-[disabled=true]:scale-0 transition-all"
        >
          <CharacterCarousel
            selected={selectedSprite}
            onChange={setSelectedSprite}
          />
        </div>
        {alert && <p className="text-red-600">{alert}</p>}
        <button
          className="py-4 px-8 mx-auto font-bold bg-blue-500 w-min text-white rounded-xl tracking-widest disabled:opacity-0"
          disabled={
            !selectedSprite.length || tempName.length < 4 || hostId.length < 6 || connecting
          }
          onClick={join}
        >
          {connecting ? "JOINING..." : "JOIN"}
        </button>
      </div>
      {/* </div> */}
    </div>
  );
};

export default SignUp;
