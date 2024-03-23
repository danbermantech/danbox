import React, { createContext, useEffect, useState, useCallback } from 'react';
import sounds from '$assets/sounds.ts'

type AudioContextValue = {
  triggerSoundEffect: (name: string) => (()=>void)|void;
  muteAudio: ()=>void;
  unmuteAudio: ()=>void;
  isMuted: boolean;
  playBackgroundMusic: ()=>void;
  volume: number;
  setVolume: (volume:number)=>void;
}

const AudioPlayerContext = createContext<AudioContextValue>({
  playBackgroundMusic:()=>{}, 
  triggerSoundEffect: () => { }, 
  muteAudio: ()=>{}, 
  unmuteAudio: ()=>{}, 
  isMuted: true,
  volume: 1,
  setVolume: ()=>{}
});

const AudioPlayerContextProvider = ({ children }:{children:React.ReactNode}) => {

  const [audioContext] = useState(new (window.AudioContext || (window as unknown as {webkitAudioContext:AudioContext}).webkitAudioContext)());

  const [soundBuffers, setSoundBuffers] = useState<Record<string,AudioBuffer[]>>({});

  const prefetchSound = useCallback(async (url:string) => {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = await audioContext.decodeAudioData(arrayBuffer);
      return buffer;
  },[audioContext]);

  useEffect(() => {
    Object.entries(sounds).forEach(async ([k,v])=>{
      const buffers = await Promise.all(v.map(async(item)=>await prefetchSound(item)))
      setSoundBuffers((prevBuffers)=>({...prevBuffers, [k]:buffers}))
    });
  }, [audioContext, prefetchSound]); // Run only on initial render


  const [isMuted, setIsMuted] = useState(true);

  const triggerSoundEffect = useCallback((name:string)=>{
    if(!isMuted && soundBuffers[name]){
      const source = audioContext.createBufferSource();
      source.buffer = soundBuffers[name][Math.floor(Math.random()*soundBuffers[name].length)];
      source.connect(audioContext.destination);
      source.start();
      return ()=>{source.stop()}
    }
  },[audioContext, soundBuffers, isMuted]);
  
  const [outputGainNode] = useState(audioContext.createGain());

  useEffect(()=>{
    outputGainNode.gain.setValueAtTime(1, audioContext.currentTime);
    outputGainNode.connect(audioContext.destination);
  },[outputGainNode, audioContext])

  const setVolume = useCallback((volume:number)=>{
    outputGainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  },[outputGainNode, audioContext])

  const volume = outputGainNode.gain.value;

  const playNote = useCallback(()=>{
    // Create a gain node to control the volume
    const gainNode = audioContext.createGain();

    // Connect the AudioBuffer source to the gain node
    const source = audioContext.createBufferSource();
    source.buffer = soundBuffers.notes[Math.floor(Math.random()*soundBuffers.notes.length)];

    source.connect(gainNode);

    // Set the initial volume level
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

    // Define the envelope points and their timings
    const points = [
      { time: 0, value: 0.1 },   // Start at 0.1 volume
      { time: 0.1, value: 0.2 },     // Increase to full volume at 1 second
      { time: 2, value: 0.02 },   // Decrease to half volume at 3 seconds
      { time: 4, value: 0 },     // Fade out completely at 5 seconds
    ];

    // Apply the envelope using linearRampToValueAtTime
    points.forEach(point => {
      gainNode.gain.linearRampToValueAtTime(point.value, audioContext.currentTime + point.time);
    });

    // Connect the gain node to the audio context destination (e.g., speakers)
    // gainNode.connect(audioContext.destination);
    gainNode.connect(outputGainNode);
    source.start();
    return ()=>{source.stop()}
  },[soundBuffers, audioContext, outputGainNode])

  const playBackgroundMusic = useCallback(()=>{
    const noteRefs:(()=>void)[] = []
    const i = setInterval(()=>{
      if(!isMuted){
        noteRefs.push(playNote())
      }
    }, 500);
    return ()=>{clearInterval(i); noteRefs.forEach((ref)=>{ref()})}
  },[isMuted, playNote])

  const muteAudio = useCallback(() => {
    audioContext.suspend();
    setIsMuted(true)
  }, [audioContext]);

  const unmuteAudio = useCallback(() => {
    audioContext.resume();
    setIsMuted(false);
  }, [audioContext]);

  return (
    <AudioPlayerContext.Provider value={{ triggerSoundEffect, muteAudio, unmuteAudio, isMuted, playBackgroundMusic, volume, setVolume }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};


export { AudioPlayerContextProvider, AudioPlayerContext};
