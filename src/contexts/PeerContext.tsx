import { createContext, useMemo, useCallback, useState, useRef } from "react";
import { Peer } from "peerjs";
import type { DataConnection } from "peerjs";
import { addPlayer } from "../store/slices/playerSlice";
import { useDispatch } from "react-redux";
import { setCookie } from "../utilities/cookies";
export type OnDataReceivedPayload ={
  type: string;
  payload: { deviceName: string, peerId?:string};
}
export type PeerContextValue = {
  connect: (peerId: string, options: {deviceName: string}, req: unknown) => void;
  sendPeersMessage: (
    msg: unknown,
    filter: (
      value: DataConnection,
      index: number,
      connections: DataConnection[],
    ) => DataConnection[],
  ) => void;
  onDataReceived: (callback: (connection: OnDataReceivedPayload) => void, id: string) => void,
  onPeerConnect: (callback: (connection: string) => void, id: string) => void,
  peerReady: boolean;
  peerConnected: boolean;
  connections: DataConnection[];
  sendOnGuestConnected: (value: unknown) => void;
  setOnConnectSendValue: (value: unknown) => void;
  onConnectSendValue: unknown;
  myPeerId: string;
  myShortId: string;
  initialize: (func?: () => void) => void;
  peerErrors: { message: string }[];
  removeOnDataReceivedListener: (id: string) => void;
};

const defaultState:PeerContextValue = {
  connect: () => {},
  sendPeersMessage: () => {},
  onDataReceived: () => {},
  onPeerConnect: () => {},
  peerReady: false,
  peerConnected: false,
  connections: [],
  sendOnGuestConnected: () => {},
  setOnConnectSendValue: () => {},
  onConnectSendValue: null,
  myPeerId: "",
  myShortId: '',
  initialize: () => {},
  peerErrors: [],
  removeOnDataReceivedListener: () => {},
};


const PeerContext = createContext<PeerContextValue>({defaultState} as unknown as PeerContextValue);
export type PeerConnectRef = Record<string, (...args: DataConnection[]) => void>

const peerOptions = import.meta.env.VITE_DEV_MODE
  ? {
      // host: '/',
      // port: 9000,
      // path: '/',
      // debug: 2
    }
  : {};

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const idPrefix = `danbox000000000000000000000000`

function generateShortId(){
  return [...Array(6)].map(()=>(chars[Math.floor(Math.random()*chars.length)])).join('');
}
const PeerContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode => {
  // const { user } = useSupabase()
  // const myId = useMemo(() => user.id, [user]);
  // const location = useLocation();
  // console.log(location)

  // const location = useLocation();
  // const [searchParams] = useSearchParams();

  // const myShortId = useMemo(()=>{
  //   if(location.pathname == '/host') return generateShortId();
  //     if(getCookie('deviceId')) return getCookie('deviceId');
  //     const newShortId = generateShortId();
  //     setCookie('deviceId', newShortId, 14);
  //   // }
  //   return newShortId;
  // },[]);

  const myShortId= useMemo(generateShortId, []);

  const myPeerId = useMemo(()=>{
    return `${idPrefix}${myShortId}`
  },[myShortId]);

  const [connections, setConnections] = useState<DataConnection[]>([]);
  const { addNotification } = useMemo(() => {
    return {
      addNotification: (value: unknown): void => {
        console.log(value);
      },
    };
  }, []);

  const [peerReady, setPeerReady] = useState<boolean>(false);
  const [onConnectSendValue, setOnConnectSendValue] = useState<unknown | null>(
    null,
  );
  const peerRef = useRef<Peer>(null);

  const callbackRef = useRef<
    Record<string, (data:OnDataReceivedPayload, peerId?:string) => unknown>
  >({});

  const onDataReceived = useCallback(
    ( callback: (connection: OnDataReceivedPayload) => void, id: string) =>{
      callbackRef.current[id] = callback;
    },
    [callbackRef],
  );

  const onPeerConnectRef = useRef<
    Record<string,(connection: string) => void >
  >({} as Record<string,(connection: string) => void >);

  const onPeerConnect = useCallback(
    (callback: (connection: string) => void, id: string) => {
      onPeerConnectRef.current[id] = callback;
    },
    [onPeerConnectRef],
  );

  const [peerInitialized, setPeerInitialized] = useState(false);
  const [peerErrors, setPeerErrors] = useState<{ message: string }[]>([]);
  const [peerConnected, setPeerConnected] = useState(false);

  const dispatch = useDispatch();

  const removeOnDataReceivedListener = useCallback(
    (id: string) => {
      delete callbackRef.current[id];
    },
    [callbackRef],
  );

  const initialize = useCallback(
    (func?: () => void) => {
      if (peerInitialized) return;

      const initializePeer = (id?: string) => {
        const newPeer = new Peer(id ?? myPeerId, peerOptions);
        console.log(peerOptions)
  
        newPeer.on('open', () => {
          // toast.info('Opening connection');
          setPeerReady(true);
          func && func();
        });

        newPeer.on('error', (e) => {
          console.log(e)
          // setMyShortId(generateShortId());
          // initialize(func);
          addNotification({
            message: e.message,
            level: "error",
            id: "peer_error",
          });
        });
        newPeer.on('disconnected', (e) => {
          console.log(e)
          addNotification({
            message: "Disconnected",
            level: "warning",
            id: "disconnected_notification",
          });
        })
        newPeer.on("connection", (conn) => {
          conn.on("error", (err) => {
            console.warn(err);
            // toast.error(err.message);
          });
          // toast.info(
          //   `Connection initiated from ${conn.metadata?.email} - ${conn.metadata?.deviceName}`
          // );
          conn.on("open", () => {
            Object.values(onPeerConnectRef.current).forEach((cb) => {
              const result = cb(conn.peer);
              if (result as unknown) conn.send(result);
            });
            if (onConnectSendValue) {
              // console.log(onConnectSendValue);
              conn.send({ type: "state", payload: { ...onConnectSendValue } });
            }
            conn.on('data', (data) => {
              const { type, payload } = data as {
                type: string;
                payload: unknown
              };
              Object.values(callbackRef.current).forEach((cb) => {
                const result = cb(data as OnDataReceivedPayload, conn.peer);
                if (result) conn.send(result);
              });
              if (type == "connection") {
                // console.log('connection payload', payload)
                const { deviceName, image } = payload as { deviceName: string, image: string };
                
                dispatch(
                  addPlayer({
                    id: conn.peer,
                    name: deviceName,
                    image: image,
                  }),
                );
              }
              if (type === "connection_accepted") {
                const { deviceName } = payload as { deviceName: string };

                addNotification({
                  message: `You have joined - ${deviceName}`,
                });
              }
            });
            conn.send({
              type: "connection_accepted",
              payload: { deviceId: myPeerId, deviceName: "Host" },
            });
            setConnections((prev) => [...prev, conn]);
          });
          conn.on("close", () => {
            setConnections((prev) =>
              prev.filter(
                (connection) => connection.connectionId !== conn.connectionId
              )
            );
          });
        });

        newPeer.on(
          "error",
          (err: { type: string; message: string }): Peer | void => {
            console.warn(err);
            setPeerErrors((prev) => [...prev, err]);
            switch (err.type) {
              case "unavailable-id": {
                return initializePeer(`${id}-1`);
              }
              case "peer-unavailable":
                addNotification({
                  level: "error",
                  message: err.message,
                  id: "peer_error_2",
                });
                break;
              default:
                addNotification({
                  level: "error",
                  message: err.message,
                  id: "peer_error_default",
                });
                break;
            }
          });
        setPeerInitialized(true);
        return newPeer;
      };
      //@ts-expect-error - This is where peerRef should be initialized

      peerRef.current = peerRef.current || initializePeer(myPeerId);
    },
    [
      myPeerId,
      addNotification,
      callbackRef,
      onConnectSendValue,
      onPeerConnectRef,
      peerInitialized,
      dispatch,
    ],
  );

  const connect = useCallback(
    (peerId: string, options: {deviceName: string}, req: unknown) => {
      req;
      function connectToPeer() {
        if(!peerRef.current) return;
        const peer = peerRef.current;
        if (!peer) return;
        console.log("connecting to peer", `${idPrefix}${peerId}`);
        const conn = peer.connect(`${idPrefix}${peerId}`);
        conn.on("open", () => {
          // console.log("open");
          conn.send({
            type: "connection",
            payload: {...options},
          });
          // console.log("i sent a message");

          conn.on("data", (data) => {
            // console.log("data received", data);
            const { type, payload } = data as OnDataReceivedPayload & {payload:{peerId:string}};
            Object.values(callbackRef.current).forEach((cb) => {
              // console.log(cb);
              cb({type, payload:{...payload, peerId: conn.peer}});
            });
            if (type === "connection_accepted") {
              addNotification({
                message: `You have joined ${payload.deviceName}`,
              });
              setPeerConnected(()=>true);
            }
          });
          setConnections((prev) => [...prev, conn]);
        });

        conn.on("error", (err) => {
          console.warn(err);
          addNotification({
            level: "error",
            message: err.message,
            id: "outbound_connection_error",
          });
          setPeerErrors((prev) => [...prev, err]);
        });
      }
      setCookie('lastHostId', peerId, 14)
      // connectToPeer();
      if (!peerInitialized) {
        initialize(connectToPeer);
      } else {
        connectToPeer();
      }
      
    },
    [addNotification, callbackRef, peerInitialized, initialize, setPeerConnected],
  );

  const sendPeersMessage = useCallback(
    (
      msg: unknown,
      filter: (
        value: DataConnection,
        index: number,
        connections: DataConnection[],
      ) => DataConnection[],
    ) => {
      // console.log("messaging", msg);
      connections
        .filter(
          filter ??
            ((x) => {
              return x;
            }),
        )
        .forEach((conn) => {
          if (conn.open) {
            // console.log("sending ", msg, "to", conn);
            conn.send(msg);
          } else {
            addNotification({
              message: "Cannot send message, connection is not active",
              level: "warning",
              timeout: 8000,
            });
            console.warn("connection is not active");
          }
        });
    },
    [connections, addNotification],
  );

  const sendOnGuestConnected = useCallback(
    (value: unknown) => {
      if (!peerRef.current) return;
      if (peerRef.current) {
        peerRef.current.on("connection", (conn) => {
          conn.on("open", () => {
            conn.send(value);
          });
        });
      }
    },
    [peerRef],
  );



  const contextValue = useMemo(
    () => ({
      connect,
      sendPeersMessage,
      onDataReceived,
      peerReady,
      connections,
      sendOnGuestConnected,
      setOnConnectSendValue,
      onConnectSendValue,
      onPeerConnect,
      myPeerId,
      myShortId,
      initialize,
      peerErrors,
      peerConnected,
      removeOnDataReceivedListener
    }),
    [
      connect,
      sendPeersMessage,
      onDataReceived,
      peerReady,
      setOnConnectSendValue,
      onConnectSendValue,
      connections,
      sendOnGuestConnected,
      onPeerConnect,
      myPeerId,
      myShortId,
      initialize,
      peerErrors,
      peerConnected,
      removeOnDataReceivedListener
    ],
  );

  return (
    <PeerContext.Provider value={contextValue}>{children}</PeerContext.Provider>
  );
};

export default PeerContextProvider;

export { PeerContextProvider, PeerContext };
