import { useContext } from "react";
import { AudioPlayerContext } from "$contexts/AudioPlayerContext";

const useAudio = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioPlayerContextProvider');
  }
  return context;
};

export default useAudio;