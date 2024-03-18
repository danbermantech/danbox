import clsx from "clsx";
import { useCallback } from "react";

const RemoteControl = ({
  onClick,
  value,
  label,
  img,
  classNames,
}: {
  onClick: (value: unknown) => void;
  value: string;
  label: string;
  img?: string;
  classNames?: {button:string, image:string} | string;
}) => {
  const onPress = useCallback(() => {
    onClick(value);
  }, [onClick, value]);

  return (
    <button 
      className={clsx([
        "w-full text-2xl bg-gray-200 rounded-2xl min-h-max flex-grow border-black border-2 border-solid text-black",
        typeof classNames == 'string' && classNames,
        typeof classNames == 'object' && classNames.button
      ])} onClick={onPress}>
      {img && 
      <img src={img} alt={label} 
        className={clsx(["w-full h-full object-contain", 
        typeof classNames == 'object' && classNames.image])} 
      />}
      {label}
    </button>
  );
};

export default RemoteControl;
