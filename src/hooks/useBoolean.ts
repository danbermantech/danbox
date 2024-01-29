import { useState } from 'react';

type state = boolean;
type toggle = () => void;
type setTrue = () => void;
type setFalse = () => void;

const useBoolean = (initialState:boolean=false):[state, toggle, setTrue, setFalse] => {
  const [state, setState] = useState<state>(initialState);

  const setTrue:setTrue = () => setState(true);
  const setFalse:setFalse = () => setState(false);
  const toggle:toggle = () => setState((prevState) => !prevState);

  return [state, toggle, setTrue, setFalse];
};

export default useBoolean;
