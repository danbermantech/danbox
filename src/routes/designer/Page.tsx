import { Board, BoardSpaceConfig, GAME_MODE } from "$store/types";
import { boardLayout, boardLayout2, generateRandomBoard } from "$constants/boardLayout";
import { BoardDimensionsProvider, useBoardDimensionsContext } from "$contexts/BoardDimensionsContext";
import PixiHost from "$components/pixi/PixiClient";
import { useAppDispatch } from "$store/hooks";
import { setBoardLayout } from "$store/slices/boardSlice";
import clsx from "clsx";
import {
  DragEvent,
  PointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Tool = "move" | "path";

type DragState = {
  id: string;
  pointerId: number;
};

const STORAGE_KEY = "danbox-board-designer-v1";
const STORAGE_INDEX_KEY = `${STORAGE_KEY}:index`;
const STORAGE_ITEM_PREFIX = `${STORAGE_KEY}:item:`;

type SavedBoardEntry = {
  key: string;
  name: string;
  updatedAt: number;
};

const typePresets: Record<
  GAME_MODE,
  { label: string; color: string; width: number; height: number; note: string }
> = {
  [GAME_MODE.MOVEMENT]: { label: "Movement", color: "#64748b", width: 0.05, height: 0.05, note: "Generic movement/event space." },
  [GAME_MODE.REGISTRATION]: { label: "Registration", color: "#64748b", width: 0.05, height: 0.05, note: "Not normally used as board space." },
  [GAME_MODE.GAME_OVER]: { label: "Game Over", color: "#475569", width: 0.05, height: 0.05, note: "End-state marker space." },
  [GAME_MODE.RESULTS]: { label: "Results", color: "#475569", width: 0.05, height: 0.05, note: "Results marker space." },
  [GAME_MODE.TRIVIA]: { label: "Trivia", color: "#8888ff", width: 0.055, height: 0.055, note: "Question prompt space." },
  [GAME_MODE.SLOTS]: { label: "Slots", color: "#aa6622", width: 0.055, height: 0.055, note: "Casino/slots mini-game space." },
  [GAME_MODE.HOME]: { label: "Home", color: "#ff00ff", width: 0.065, height: 0.065, note: "Usually the starting hub." },
  [GAME_MODE.DUEL]: { label: "Duel", color: "#558826", width: 0.055, height: 0.055, note: "Head-to-head challenge space." },
  [GAME_MODE.EVENT]: { label: "Event", color: "#0ea5e9", width: 0.05, height: 0.05, note: "Custom one-off events." },
  [GAME_MODE.ITEM]: { label: "Item", color: "#22c55e", width: 0.05, height: 0.05, note: "Item reward/interaction space." },
  [GAME_MODE.SHOP]: { label: "Shop", color: "#00dddd", width: 0.05, height: 0.05, note: "Buy and trade items." },
  [GAME_MODE.BANK]: { label: "Bank", color: "#14b8a6", width: 0.05, height: 0.05, note: "Currency/economy interaction space." },
  [GAME_MODE.START]: { label: "Start", color: "#84cc16", width: 0.06, height: 0.06, note: "Alternative game entry point." },
  [GAME_MODE.END]: { label: "End", color: "#ef4444", width: 0.06, height: 0.06, note: "Alternative game finish point." },
  [GAME_MODE.FRENZY]: { label: "Frenzy", color: "#35a6b2", width: 0.05, height: 0.05, note: "Rapid-action phase trigger." },
  [GAME_MODE.GET_ASSET]: { label: "Get Asset", color: "#22ff22", width: 0.05, height: 0.05, note: "Positive reward/asset gain." },
  [GAME_MODE.LOSE_ASSET]: { label: "Lose Asset", color: "#ff2222", width: 0.05, height: 0.05, note: "Penalty/asset loss." },
  [GAME_MODE.IMPLORE]: { label: "Implore", color: "#aa22aa", width: 0.05, height: 0.05, note: "Special traversal choke-point." },
};

const modeOptions = Object.values(GAME_MODE);

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function isValidHexColor(value: string): boolean {
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

function createSpace(type: GAME_MODE, x: number, y: number): BoardSpaceConfig {
  const preset = typePresets[type];
  const id = `${type.toLowerCase()}-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 9)}`;
  return {
    id,
    type,
    x,
    y,
    width: preset.width,
    height: preset.height,
    color: preset.color,
    label: preset.label,
    connections: [],
  };
}

function normalizeBoard(board: Board): Board {
  return Object.fromEntries(
    Object.entries(board).map(([id, space]) => [
      id,
      {
        ...space,
        x: clamp(space.x, 0, 1),
        y: clamp(space.y, 0, 1),
        width: clamp(space.width, 0.02, 0.2),
        height: clamp(space.height ?? space.width, 0.02, 0.2),
        connections: Array.from(new Set(space.connections)).filter((connId) => connId !== id),
      },
    ]),
  );
}

function loadSavedBoardIndex(): SavedBoardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_INDEX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedBoardEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((entry) => entry && typeof entry.key === "string" && typeof entry.name === "string")
      .sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

function makeSaveKey(name: string): string {
  const normalized = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return normalized || "board";
}

const BoardDesignerPageContent = () => {
  const [board, setBoard] = useState<Board>(() => normalizeBoard(boardLayout));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tool, setTool] = useState<Tool>("move");
  const [pathStartId, setPathStartId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [message, setMessage] = useState("");
  const [connectionDraft, setConnectionDraft] = useState("");
  const [colorDraft, setColorDraft] = useState("");
  const [saveName, setSaveName] = useState("My Board");
  const [savedBoards, setSavedBoards] = useState<SavedBoardEntry[]>(() => loadSavedBoardIndex());
  const [selectedSaveKey, setSelectedSaveKey] = useState("");
  const dispatch = useAppDispatch();
  const { containerRef } = useBoardDimensionsContext();
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const selectedSpace = selectedId ? board[selectedId] : null;

  useEffect(() => {
    setColorDraft(selectedSpace?.color ?? "");
  }, [selectedSpace?.id, selectedSpace?.color]);

  const incomingConnections = useMemo(() => {
    if (!selectedSpace) return [] as BoardSpaceConfig[];
    return Object.values(board).filter((space) => space.connections.includes(selectedSpace.id));
  }, [board, selectedSpace]);

  useEffect(() => {
    dispatch(setBoardLayout({ __wrapped: true, board, preserveConnections: true }));
  }, [board, dispatch]);

  useEffect(() => {
    if (!selectedSaveKey && savedBoards.length > 0) {
      setSelectedSaveKey(savedBoards[0].key);
    }
  }, [savedBoards, selectedSaveKey]);

  const updateSpace = useCallback((id: string, update: Partial<BoardSpaceConfig>) => {
    setBoard((prev) => {
      const existing = prev[id];
      if (!existing) return prev;
      const next = {
        ...existing,
        ...update,
      };
      if (update.x !== undefined) next.x = clamp(update.x, 0, 1);
      if (update.y !== undefined) next.y = clamp(update.y, 0, 1);
      if (update.width !== undefined) next.width = clamp(update.width, 0.02, 0.2);
      if (update.height !== undefined) next.height = clamp(update.height, 0.02, 0.2);
      return {
        ...prev,
        [id]: next,
      };
    });
  }, []);

  const handleCanvasDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const mode = event.dataTransfer.getData("application/x-danbox-space") as GAME_MODE;
      if (!mode || !modeOptions.includes(mode)) return;
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = clamp((event.clientX - rect.left) / rect.width, 0.02, 0.98);
      const y = clamp((event.clientY - rect.top) / rect.height, 0.02, 0.98);
      const space = createSpace(mode, x, y);
      setBoard((prev) => ({ ...prev, [space.id]: space }));
      setSelectedId(space.id);
      setMessage(`Added ${space.label}`);
    },
    [],
  );

  const handleCanvasDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleNodePointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>, spaceId: string) => {
      event.stopPropagation();
      setSelectedId(spaceId);
      if (tool !== "move") return;
      setDragState({ id: spaceId, pointerId: event.pointerId });
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [tool],
  );

  const handleNodePointerUp = useCallback(
    (event: PointerEvent<HTMLButtonElement>, spaceId: string) => {
      if (dragState && dragState.pointerId === event.pointerId) {
        setDragState(null);
      }
      if (tool !== "path") return;
      setSelectedId(spaceId);
      if (!pathStartId) {
        setPathStartId(spaceId);
        setMessage("Path start selected. Click another space to connect.");
        return;
      }
      if (pathStartId === spaceId) {
        setPathStartId(null);
        setMessage("Path start cleared.");
        return;
      }
      setBoard((prev) => {
        const source = prev[pathStartId];
        if (!source || !prev[spaceId]) return prev;
        const alreadyExists = source.connections.includes(spaceId);
        const nextConnections = alreadyExists
          ? source.connections.filter((id) => id !== spaceId)
          : [...source.connections, spaceId];
        return {
          ...prev,
          [pathStartId]: {
            ...source,
            connections: nextConnections,
          },
        };
      });
      setPathStartId(null);
      setMessage(`Path updated: ${pathStartId} -> ${spaceId}`);
    },
    [dragState, pathStartId, tool],
  );

  useEffect(() => {
    const onPointerMove = (event: globalThis.PointerEvent) => {
      if (!dragState) return;
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = clamp((event.clientX - rect.left) / rect.width, 0.02, 0.98);
      const y = clamp((event.clientY - rect.top) / rect.height, 0.02, 0.98);
      updateSpace(dragState.id, { x, y });
    };

    const onPointerUp = () => {
      setDragState(null);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [dragState, updateSpace]);

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    setBoard((prev) => {
      const next = { ...prev };
      delete next[selectedId];
      Object.keys(next).forEach((id) => {
        next[id] = {
          ...next[id],
          connections: next[id].connections.filter((targetId) => targetId !== selectedId),
        };
      });
      return next;
    });
    setPathStartId((prev) => (prev === selectedId ? null : prev));
    setSelectedId(null);
    setMessage("Space deleted.");
  }, [selectedId]);

  const saveToLocalStorage = useCallback(() => {
    const trimmedName = saveName.trim();
    if (!trimmedName) {
      setMessage("Please enter a board name before saving.");
      return;
    }
    const key = makeSaveKey(trimmedName);
    const storageItemKey = `${STORAGE_ITEM_PREFIX}${key}`;
    localStorage.setItem(storageItemKey, JSON.stringify(board));

    const nextEntry: SavedBoardEntry = {
      key,
      name: trimmedName,
      updatedAt: Date.now(),
    };

    const existing = loadSavedBoardIndex().filter((entry) => entry.key !== key);
    const nextIndex = [nextEntry, ...existing].sort((a, b) => b.updatedAt - a.updatedAt);
    localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(nextIndex));
    setSavedBoards(nextIndex);
    setSelectedSaveKey(key);
    setMessage(`Saved board as "${trimmedName}".`);
  }, [board, saveName]);

  const loadFromLocalStorage = useCallback(() => {
    if (!selectedSaveKey) {
      setMessage("Select a saved board to load.");
      return;
    }
    try {
      const raw = localStorage.getItem(`${STORAGE_ITEM_PREFIX}${selectedSaveKey}`);
      if (!raw) {
        setMessage("Selected save could not be found.");
        return;
      }
      const parsed = JSON.parse(raw) as Board;
      const normalized = normalizeBoard(parsed);
      setBoard(normalized);
      setSelectedId(null);
      setPathStartId(null);
      const selectedEntry = savedBoards.find((entry) => entry.key === selectedSaveKey);
      if (selectedEntry) {
        setSaveName(selectedEntry.name);
      }
      setMessage("Board loaded.");
    } catch {
      setMessage("Saved board is invalid JSON.");
    }
  }, [savedBoards, selectedSaveKey]);

  const deleteSavedBoard = useCallback(() => {
    if (!selectedSaveKey) {
      setMessage("Select a saved board to delete.");
      return;
    }
    localStorage.removeItem(`${STORAGE_ITEM_PREFIX}${selectedSaveKey}`);
    const nextIndex = loadSavedBoardIndex().filter((entry) => entry.key !== selectedSaveKey);
    localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(nextIndex));
    setSavedBoards(nextIndex);
    setSelectedSaveKey(nextIndex[0]?.key ?? "");
    setMessage("Saved board deleted.");
  }, [selectedSaveKey]);

  const loadTemplate = useCallback((template: Board) => {
    setBoard(normalizeBoard(template));
    setSelectedId(null);
    setPathStartId(null);
    setMessage("Template loaded.");
  }, []);

  const addConnectionDraft = useCallback(() => {
    if (!selectedSpace) return;
    if (!connectionDraft || !board[connectionDraft]) return;
    if (connectionDraft === selectedSpace.id) return;
    if (selectedSpace.connections.includes(connectionDraft)) return;
    updateSpace(selectedSpace.id, {
      connections: [...selectedSpace.connections, connectionDraft],
    });
    setConnectionDraft("");
  }, [board, connectionDraft, selectedSpace, updateSpace]);

  return (
    <div className="h-[100dvh] w-full p-4 text-white bg-slate-900">
      <div className="h-full grid grid-cols-1 lg:grid-cols-[220px_1fr_320px] gap-4">
        <section className="bg-slate-800 rounded-xl p-3 overflow-auto">
          <h1 className="text-xl font-bold mb-3">Board Designer</h1>
          <div className="flex gap-2 mb-4">
            <button
              className={clsx("px-3 py-2 rounded text-sm font-semibold", tool === "move" ? "bg-blue-500" : "bg-slate-700")}
              onClick={() => setTool("move")}
            >
              Move Tool
            </button>
            <button
              className={clsx("px-3 py-2 rounded text-sm font-semibold", tool === "path" ? "bg-green-600" : "bg-slate-700")}
              onClick={() => setTool("path")}
            >
              Path Tool
            </button>
          </div>

          <div className="text-xs uppercase tracking-wider text-slate-300 mb-2">Drag New Spaces</div>
          <div className="grid grid-cols-2 gap-2">
            {modeOptions.map((mode) => (
              <button
                key={mode}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData("application/x-danbox-space", mode);
                }}
                className="rounded px-2 py-2 text-xs font-bold border border-slate-600"
                style={{ background: typePresets[mode].color, color: "black" }}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <input
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1"
              placeholder="Board name"
              value={saveName}
              onChange={(event) => setSaveName(event.target.value)}
            />
            <button className="w-full bg-indigo-600 rounded py-2 font-semibold" onClick={saveToLocalStorage}>Save As</button>
            <select
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1"
              value={selectedSaveKey}
              onChange={(event) => setSelectedSaveKey(event.target.value)}
            >
              <option value="">Select saved board</option>
              {savedBoards.map((entry) => (
                <option key={entry.key} value={entry.key}>
                  {entry.name}
                </option>
              ))}
            </select>
            <button className="w-full bg-indigo-500 rounded py-2 font-semibold" onClick={loadFromLocalStorage}>Load Selected</button>
            <button className="w-full bg-red-800 rounded py-2 font-semibold" onClick={deleteSavedBoard}>Delete Selected Save</button>
            <button className="w-full bg-slate-700 rounded py-2 font-semibold" onClick={() => loadTemplate(boardLayout)}>Template: Board 1</button>
            <button className="w-full bg-slate-700 rounded py-2 font-semibold" onClick={() => loadTemplate(boardLayout2)}>Template: Board 2</button>
            <button className="w-full bg-slate-700 rounded py-2 font-semibold" onClick={() => loadTemplate(generateRandomBoard(14))}>Template: Random</button>
            <button className="w-full bg-red-700 rounded py-2 font-semibold disabled:opacity-50" disabled={!selectedId} onClick={deleteSelected}>Delete Selected</button>
          </div>

          <div className="mt-4 text-xs text-slate-300 min-h-6">{message}</div>
        </section>

        <section className="bg-slate-800 rounded-xl p-3 flex flex-col min-h-0">
          <div className="text-sm text-slate-300 mb-2">
            {tool === "move" ? "Move tool: drag spaces around." : "Path tool: click source then target to add/remove a directed path."}
            {pathStartId ? ` Path source: ${pathStartId}` : ""}
          </div>
          <div ref={containerRef} className="relative flex-1 rounded-lg bg-slate-900 border border-slate-700 overflow-hidden">
            <PixiHost />
            <div
              ref={canvasRef}
              onDrop={handleCanvasDrop}
              onDragOver={handleCanvasDragOver}
              onPointerDown={() => {
                if (tool === "path") {
                  setPathStartId(null);
                }
              }}
              className="absolute inset-0"
            >
              {Object.values(board).map((space) => (
                <button
                  key={space.id}
                  onPointerDown={(event) => handleNodePointerDown(event, space.id)}
                  onPointerUp={(event) => handleNodePointerUp(event, space.id)}
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedId(space.id);
                  }}
                  className={clsx(
                    "absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-transparent",
                    selectedId === space.id ? "ring-4 ring-white" : "",
                    pathStartId === space.id ? "ring-4 ring-emerald-300" : "",
                  )}
                  style={{
                    left: `${space.x * 100}%`,
                    top: `${space.y * 100}%`,
                  }}
                >
                  <span
                    className={clsx(
                      "pointer-events-none inline-block rounded-full border-2 text-[9px] font-bold text-white px-1 py-0.5 bg-black/30 border-black/60",
                      selectedId === space.id ? "border-white bg-black/50" : "",
                    )}
                  >
                    {space.id}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-800 rounded-xl p-3 overflow-auto">
          <h2 className="text-lg font-bold mb-2">Properties</h2>
          {!selectedSpace && <div className="text-slate-300 text-sm">Select a space to edit properties.</div>}
          {selectedSpace && (
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-slate-300 mb-1">Space Id</label>
                <div className="px-2 py-1 rounded bg-slate-900 border border-slate-700 break-all">{selectedSpace.id}</div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Type</label>
                <select
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1"
                  value={selectedSpace.type}
                  onChange={(event) => {
                    const nextType = event.target.value as GAME_MODE;
                    updateSpace(selectedSpace.id, { type: nextType });
                  }}
                >
                  {modeOptions.map((mode) => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>

              <button
                className="w-full bg-slate-700 rounded px-2 py-1"
                onClick={() => {
                  const preset = typePresets[selectedSpace.type];
                  updateSpace(selectedSpace.id, {
                    label: preset.label,
                    color: preset.color,
                    width: preset.width,
                    height: preset.height,
                  });
                }}
              >
                Apply Type Defaults
              </button>

              <div className="text-xs text-slate-300 bg-slate-900 border border-slate-700 rounded p-2">
                {typePresets[selectedSpace.type].note}
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Label</label>
                <input
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1"
                  value={selectedSpace.label}
                  onChange={(event) => updateSpace(selectedSpace.id, { label: event.target.value })}
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Color</label>
                <input
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1"
                  value={colorDraft}
                  onChange={(event) => {
                    const next = event.target.value;
                    setColorDraft(next);
                    if (isValidHexColor(next)) {
                      updateSpace(selectedSpace.id, { color: next.trim() });
                    }
                  }}
                  onBlur={() => {
                    if (!isValidHexColor(colorDraft)) {
                      setColorDraft(selectedSpace.color);
                    }
                  }}
                />
                {colorDraft.length > 0 && !isValidHexColor(colorDraft) && (
                  <div className="text-xs text-red-300 mt-1">Use a valid hex code like #fff or #a1b2c3.</div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">X</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    max={1}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1"
                    value={selectedSpace.x}
                    onChange={(event) => updateSpace(selectedSpace.id, { x: Number(event.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Y</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    max={1}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1"
                    value={selectedSpace.y}
                    onChange={(event) => updateSpace(selectedSpace.id, { y: Number(event.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Width</label>
                  <input
                    type="number"
                    step="0.005"
                    min={0.02}
                    max={0.2}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1"
                    value={selectedSpace.width}
                    onChange={(event) => updateSpace(selectedSpace.id, { width: Number(event.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Height</label>
                  <input
                    type="number"
                    step="0.005"
                    min={0.02}
                    max={0.2}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1"
                    value={selectedSpace.height ?? selectedSpace.width}
                    onChange={(event) => updateSpace(selectedSpace.id, { height: Number(event.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Outgoing Connections</label>
                <div className="flex gap-2 mb-2">
                  <select
                    className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1"
                    value={connectionDraft}
                    onChange={(event) => setConnectionDraft(event.target.value)}
                  >
                    <option value="">Select target</option>
                    {Object.values(board)
                      .filter((space) => space.id !== selectedSpace.id)
                      .map((space) => (
                        <option key={space.id} value={space.id}>{space.label} ({space.id})</option>
                      ))}
                  </select>
                  <button className="bg-blue-600 rounded px-2" onClick={addConnectionDraft}>Add -&gt;</button>
                </div>
                <div className="space-y-1">
                  {selectedSpace.connections.map((connectionId) => (
                    <div key={connectionId} className="flex items-center justify-between rounded bg-slate-900 border border-slate-700 px-2 py-1">
                      <span className="text-xs break-all">{connectionId}</span>
                      <button
                        className="text-red-300"
                        onClick={() => {
                          updateSpace(selectedSpace.id, {
                            connections: selectedSpace.connections.filter((id) => id !== connectionId),
                          });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Incoming Connections</label>
                <div className="space-y-1">
                  {incomingConnections.length === 0 && (
                    <div className="text-xs text-slate-400">None</div>
                  )}
                  {incomingConnections.map((sourceSpace) => (
                    <div key={sourceSpace.id} className="flex items-center justify-between rounded bg-slate-900 border border-slate-700 px-2 py-1">
                      <span className="text-xs break-all">{sourceSpace.label} ({sourceSpace.id})</span>
                      <button
                        className="text-red-300"
                        onClick={() => {
                          updateSpace(sourceSpace.id, {
                            connections: sourceSpace.connections.filter((id) => id !== selectedSpace.id),
                          });
                        }}
                      >
                        Remove -&gt;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const BoardDesignerPage = () => {
  return (
    <BoardDimensionsProvider>
      <BoardDesignerPageContent />
    </BoardDimensionsProvider>
  );
};

export default BoardDesignerPage;
