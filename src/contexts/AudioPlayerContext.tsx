import React, { createContext, useEffect, useState, useCallback } from 'react';
import fanfare1 from '$assets/audio/fanfare1.mp3';
import loss1 from '$assets/audio/loss1.mp3';
import victory1 from '$assets/audio/victory1.mp3';
import victory2 from '$assets/audio/victory2.mp3';
import victory3 from '$assets/audio/victory3.mp3';
import victory4 from '$assets/audio/victory4.mp3';
import movementSong from '$assets/audio/movementSong.mp3';
import registration from '$assets/audio/registration.mp3';
import trivia from '$assets/audio/trivia.mp3';

const audioFiles = [
  registration, 
  movementSong, 
  victory1, 
  victory2, 
  victory3, 
  victory4, 
  fanfare1, 
  loss1,
  trivia,
]


type AudioContextValue = {
  triggerSoundEffect: (name: string) => void;
  initializeAudio: () => void;
}

const AudioPlayerContext = createContext<AudioContextValue>({ triggerSoundEffect: () => { }, initializeAudio: () => { } });

function getCommonName(name:string){
  const split = name.split('/')
  return split[split.length-1].split('.')[0]
}

const AudioPlayerContextProvider = ({ children }:{children:React.ReactNode}) => {

  const [audioContext] = useState(new (window.AudioContext || (window as unknown as {webkitAudioContext:AudioContext}).webkitAudioContext)());
  const [audioBuffers, setAudioBuffers] = useState<Record<string,AudioBuffer>>({});
  const prefetchAudio = useCallback(async (name:string) => {
    try {
      const response = await fetch(name);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = await audioContext.decodeAudioData(arrayBuffer);
      const commonName = getCommonName(name)
      setAudioBuffers((prevBuffers) => ({ ...prevBuffers, [commonName]: buffer }));
    } catch (error) {
      console.error(`Error prefetching audio file ${name}:`, error);
    }
  },[audioContext]);

  const triggerSoundEffect = useCallback((name:string) => {
    console.log(name, audioBuffers[name])
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffers[name];
    source.connect(audioContext.destination);
    source.start();
    return ()=>{source.stop()}
  },[audioContext, audioBuffers]);
  const initializeAudio = () => {
    // Play a silent audio clip for initialization
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 1, audioContext.sampleRate);
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
  };
  useEffect(() => {
    audioFiles.forEach(prefetchAudio);
  }, [audioContext, prefetchAudio]); // Run only on initial render

  return (
    <AudioPlayerContext.Provider value={{ triggerSoundEffect, initializeAudio }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};


export { AudioPlayerContextProvider, AudioPlayerContext};
