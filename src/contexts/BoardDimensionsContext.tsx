import { createContext, useCallback, useContext, useRef, useState, type RefCallback } from "react";

interface BoardDimensions {
  width: number;
  height: number;
  containerRef: RefCallback<HTMLDivElement>;
}

export const BoardDimensionsContext = createContext<BoardDimensions | null>(null);

export function BoardDimensionsProvider({ children }: { children: React.ReactNode }) {
  const observerRef = useRef<ResizeObserver | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const containerRef = useCallback((el: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (!el) {
      setSize({ width: 0, height: 0 });
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    observerRef.current = observer;
  }, []);

  return (
    <BoardDimensionsContext.Provider value={{ ...size, containerRef }}>
      {children}
    </BoardDimensionsContext.Provider>
  );
}

export function useBoardDimensionsContext(): BoardDimensions {
  const ctx = useContext(BoardDimensionsContext);
  if (!ctx) throw new Error("useBoardDimensionsContext must be used within BoardDimensionsProvider");
  return ctx;
}
