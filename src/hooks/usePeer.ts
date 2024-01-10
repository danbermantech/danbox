import { useDebugValue } from 'react'
import { useSelector } from './useSelector'
import { PeerContext, PeerContextValue } from './../contexts/PeerContext'

// type KeyOfPeerContextValue = keyof PeerContextValue;

// type ValuesTypes = PeerContextValue[KeyOfPeerContextValue]
type ValueOf<T> = T[keyof T];

// type ValueOfPeerContextValue = ValueOf<PeerContextValue>; // string | number

const usePeer = (selector:(context:PeerContextValue)=>ValueOf<PeerContextValue>) => {
  useDebugValue(selector.toString())
  return useSelector(selector, PeerContext)
}

export { usePeer }
