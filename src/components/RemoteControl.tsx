import { useCallback } from "react";

const RemoteControl = ({
  onClick,
  value,
  label,
}: {
  onClick: (value: unknown) => void;
  value: string;
  label: string;
}) => {
  const onPress = useCallback(() => {
    onClick(value);
  }, [onClick, value]);

  return (
    // <div style={{width:'100%'}}>

    <button className="w-full text-2xl bg-gray-200 rounded-2xl min-h-max flex-grow border-black border-2 border-solid text-black" onClick={onPress}>
      {label}
    </button>
    // </div>
  );
};

export default RemoteControl;
