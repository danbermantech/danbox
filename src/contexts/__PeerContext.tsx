import { createContext, useMemo, useCallback, useState, useRef } from "react";
import { Peer } from "peerjs";
// import PropTypes from 'prop-types'
import { v4 as uuidv4 } from "uuid";
import type { DataConnection } from "peerjs";
// import { useMIDI } from 'react-midi-context';

export type PeerContextValue = {
  connect: (peerId: string, req?: unknown) => void;
  sendPeersMessage: (
    msg: unknown,
    filter: (
      value: DataConnection,
      index: number,
      connections: DataConnection[],
    ) => DataConnection[],
  ) => void;
  onDataReceived: (
    callback: (connection: DataConnection) => void,
    id: string,
  ) => void;
  onPeerConnect: (
    callback: (connection: DataConnection) => void,
    id: string,
  ) => void;
  peerReady: boolean;
  connections: DataConnection[];
  sendOnGuestConnected: (value: unknown) => void;
  setOnConnectSendValue: (value: unknown) => void;
  myPeerId: string;
  initialize: (func?: () => void) => void;
};

const PeerContext = createContext<PeerContextValue>({});

const peerOptions = import.meta.env.VITE_DEV_MODE
  ? {
      // host: '/',
      // port: 9000,
      // path: '/',
      // debug: 2
    }
  : {};

const PeerContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode => {
  // const { user } = useSupabase()
  // const myId = useMemo(() => user.id, [user]);
  const myPeerId = useMemo(uuidv4, []);
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
  // const peerRef = useRef<{value:Peer|null}>({value:null})
  const [peer, setPeer] = useState<Peer | null>(null);

  const callbackRef = useRef<
    Record<string, (...args: DataConnection[]) => unknown>
  >({});

  const onDataReceived = useCallback(
    (callback: (connection: DataConnection) => void, id: string) => {
      callbackRef.current[id] = callback;
    },
    [callbackRef],
  );

  const onPeerConnectRef = useRef<{
    values: Record<string, (...args: DataConnection[]) => void>;
  }>({});

  const onPeerConnect = useCallback(
    (callback: (connection: DataConnection) => void, id: string) => {
      peer?.on("connection", (conn) => {
        // conn.on('open', () => {
        callback(conn);
        // })
      });
      // onPeerConnectRef.current.values[id] = callback
    },
    [onPeerConnectRef, peer],
  );

  const [peerInitialized, setPeerInitialized] = useState(false);

  const initialize = useCallback(
    (func?: () => void) => {
      if (peerInitialized) return;

      const initializePeer = (id: string): Peer => {
        console.log("initializing peer", id);
        const newPeer = new Peer(id, peerOptions);

        newPeer.on("open", () => {
          addNotification({
            message: "Opening connection",
            level: "success",
            id: "open_notification",
          });
          setPeerReady(true);
          func && func();
        });

        newPeer.on("connection", (conn) => {
          conn.on("error", (err) => {
            console.warn(err);
            addNotification({
              level: "error",
              message: err.message,
              id: "conn_error_",
            });
          });
          addNotification({
            level: "info",
            message: conn,
          });
          console.log("connectered");
          conn.on("open", (...v) => {
            console.log(v);
            console.log("i am open");
            Object.values(onPeerConnectRef.current).forEach((cb) => {
              const result = cb(conn.peer);
              // console.log('send result')
              if (result) conn.send(result);
            });
            console.log(onConnectSendValue);
            if (onConnectSendValue) {
              console.log(onConnectSendValue);
              conn.send({ type: "state", payload: { ...onConnectSendValue } });
            }
            conn.on("data", (data): void => {
              console.log(data);
              const { type, payload } = data as {
                type: string;
                payload: unknown;
              };
              Object.values(callbackRef.current).forEach((cb) => {
                console.log(cb, data);
                const result = cb(data, conn.peer);
                console.log(result);
                if (result) conn.send(result);
              });
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
                (connection) => connection.connectionId !== conn.connectionId,
              ),
            );
          });
        });

        newPeer.on(
          "error",
          (err: { type: string; message: string }): Peer | void => {
            console.warn(err);
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
          },
        );

        setPeerInitialized(true);
        return newPeer;
      };

      if (!peer) setPeer(initializePeer(myPeerId));

      // peerRef.current.value = peerRef.current.value || initializePeer(myPeerId)
    },
    [
      myPeerId,
      addNotification,
      callbackRef,
      onConnectSendValue,
      onPeerConnectRef,
      peerInitialized,
      peer,
    ],
  );

  const connect = useCallback(
    (peerId: string, req: unknown) => {
      function connectToPeer() {
        // const peer = peerRef.current.value;
        if (!peer) return;
        console.log("connecting to peer", peerId);
        const conn = peer.connect(peerId);
        conn.on("open", () => {
          console.log("open");
          conn.send({
            type: "connection",
            payload: { deviceName: "hello" },
          });
          console.log("i sent a message");

          conn.on("data", (data) => {
            const { type, payload } = data as {
              type: string;
              payload: { deviceName: string };
            };
            Object.values(callbackRef.current).forEach((cb) =>
              cb({ type, payload }),
            );
            if (type === "connection_accepted") {
              addNotification({
                message: `You have joined ${payload.deviceName}`,
              });
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
        });
      }

      // connectToPeer();
      if (!peerInitialized) {
        initialize(connectToPeer);
      } else {
        connectToPeer();
      }
    },
    [addNotification, callbackRef, peerInitialized, initialize, peer],
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
      console.log("messaging", msg);
      connections
        .filter(
          filter ??
            ((x) => {
              return x;
            }),
        )
        .forEach((conn) => {
          if (conn.open) {
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
      if (!peer) return;
      if (peer) {
        peer.on("connection", (conn) => {
          conn.on("open", () => {
            conn.send(value);
          });
        });
      }
    },
    [peer],
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
      onPeerConnect,
      myPeerId,
      initialize,
    }),
    [
      connect,
      sendPeersMessage,
      onDataReceived,
      peerReady,
      setOnConnectSendValue,
      connections,
      sendOnGuestConnected,
      onPeerConnect,
      myPeerId,
      initialize,
    ],
  );

  return (
    <PeerContext.Provider value={contextValue}>{children}</PeerContext.Provider>
  );
};

export default PeerContextProvider;

export { PeerContextProvider, PeerContext };
