import {useCallback} from 'react';

const RemoteControl = ({onClick, value, label}: {onClick: (value:unknown)=>void, value:string, label:string}) => {

  const onPress = useCallback(() => {
    onClick(value);
  },[onClick, value]);

  return (
    // <div style={{width:'100%'}}>

      <button style={{width:'100%', minHeight: '4rem'}} onClick={onPress}>{label}</button>
    // </div>
  )
};

export default RemoteControl;