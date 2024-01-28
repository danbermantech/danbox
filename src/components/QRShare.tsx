import { usePeer } from "$hooks/usePeer";
import clsx from "clsx";
import { useMemo } from "react";
import QRCode from "react-qr-code";


const QRShare = ({className}:{className?:string}) => {
  const myShortId = usePeer((cv) => cv.myShortId) as string;
  const qrValue = useMemo(
    () => `${window.location.host}/play?hostId=${myShortId}`,
    [myShortId]
  );
  return (<QRCode
  value={qrValue}
  className={clsx('p-2 rounded-xl border-black border-4 bg-white mx-auto', className)}
  />)
}

export default QRShare;