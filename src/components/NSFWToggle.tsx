import { useAppDispatch, useAppSelector } from "$store/hooks";
import { setNSFW } from "$store/slices/gameProgressSlice";
const NSFWToggle = () => {
  const nsfw  = useAppSelector((state) => state.game.nsfw);
  const dispatch = useAppDispatch();
  return (
    // <div className="flex items-center place-content-center gap-2 border-2 border-black w-min p-2 rounded-xl">
      <label className="text-4xl font-bold font-sans flex flex-row items-center gap-2 border-black border-2 rounded-xl p-2 align-middle">
      <input
        type="checkbox"
        className="w-8 h-8 mt-1"
        checked={nsfw}
        onChange={(e) => dispatch(setNSFW((e.target.checked)))}
      />
        NSFW</label>
    // </div>
  );
}

export default NSFWToggle;