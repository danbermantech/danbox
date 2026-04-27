import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type RefCallback } from "react";

interface BoardDimensions {
  width: number;
  height: number;
  containerRef: RefCallback<HTMLDivElement>;
}

export const BoardDimensionsContext = createContext<BoardDimensions | null>(null);

export function BoardDimensionsProvider({ children }: { children: React.ReactNode }) {
  const observerRef = useRef<ResizeObserver | null>(null);
  const observedElementRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const latestRectRef = useRef<{ width: number; height: number } | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });

  const containerRef = useCallback((el: HTMLDivElement | null) => {
    if (observedElementRef.current === el) {
      return;
    }

    observedElementRef.current = el;

    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (!el) {
      latestRectRef.current = null;
      sizeRef.current = { width: 0, height: 0 };
      setSize((prev) => (prev.width === 0 && prev.height === 0 ? prev : { width: 0, height: 0 }));
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      latestRectRef.current = {
        width: Math.round(width),
        height: Math.round(height),
      };

      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        const next = latestRectRef.current;
        if (!next) {
          return;
        }
        const prev = sizeRef.current;
        if (prev.width === next.width && prev.height === next.height) {
          return;
        }
        sizeRef.current = next;
        setSize(next);
      });
    });
    observer.observe(el);
    observerRef.current = observer;
  }, []);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      observerRef.current?.disconnect();
      observerRef.current = null;
      observedElementRef.current = null;
    };
  }, []);

  const contextValue = useMemo(
    () => ({ ...size, containerRef }),
    [size, containerRef],
  );

  return (
    <BoardDimensionsContext.Provider value={contextValue}>
      {children}
    </BoardDimensionsContext.Provider>
  );
}

export function useBoardDimensionsContext(): BoardDimensions {
  const ctx = useContext(BoardDimensionsContext);
  if (!ctx) throw new Error("useBoardDimensionsContext must be used within BoardDimensionsProvider");
  return ctx;
}
