import { Suspense, useEffect, useRef, useState } from "react";
import PixiClient from "./pixi/PixiClient";
import { Modal } from "@mui/material";
import { Map } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { StoreData } from "$store/types";

const PlayerMap = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [openCount, setOpenCount] = useState(0);
  const [canMountPixi, setCanMountPixi] = useState(false);
  const rafRef = useRef<number | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const width = mapSize.width;
  const height = mapSize.height;
  const hasBoardData = useSelector((state: StoreData) => Object.keys(state.board).length > 0);
  const isBoardReady = width > 0 && height > 0;
  const shouldRenderPixi = isOpen && isBoardReady && hasBoardData && canMountPixi;
  const loadingMessage = hasBoardData ? "Loading map..." : "Syncing game state...";
  const loadingView = <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-600">{loadingMessage}</div>;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) {
      setMapSize({ width: 0, height: 0 });
      return;
    }

    observerRef.current?.disconnect();
    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = Math.round(entry.contentRect.width);
      const nextHeight = Math.round(entry.contentRect.height);
      setMapSize((prev) => {
        if (prev.width === nextWidth && prev.height === nextHeight) {
          return prev;
        }
        return { width: nextWidth, height: nextHeight };
      });
    });
    observer.observe(el);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isBoardReady) {
      setCanMountPixi(false);
      return;
    }
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(() => {
        setCanMountPixi(true);
      });
    });
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isOpen, isBoardReady, openCount]);

  return (
    <div>
      <Modal keepMounted className="w-screen h-screen flex justify-items-center items-center justify-center" onClose={()=>{setIsOpen(false)}} open={isOpen}>
        <div ref={containerRef} className="w-1/2 h-4/5 flex-grow overflow-hidden rounded-xl">
          {shouldRenderPixi ? <Suspense fallback={loadingView}><PixiClient key={openCount} /></Suspense> : loadingView}
        </div>
      </Modal>
      <Map className="flex-grow" sx={{width:48, height:48}} onClick={()=>{
        setOpenCount((count) => count + 1);
        setIsOpen(true);
      }} />
    </div>
  );


}

export default PlayerMap