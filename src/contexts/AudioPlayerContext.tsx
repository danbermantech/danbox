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
import note0 from '$assets/audio/notes/note0.wav';
import note1 from '$assets/audio/notes/note1.wav';
import note2 from '$assets/audio/notes/note2.wav';
import note3 from '$assets/audio/notes/note3.wav';
import note4 from '$assets/audio/notes/note4.wav';
import note5 from '$assets/audio/notes/note5.wav';
import note6 from '$assets/audio/notes/note6.wav';
import note7 from '$assets/audio/notes/note7.wav';
import note8 from '$assets/audio/notes/note8.wav';
import note9 from '$assets/audio/notes/note9.wav';


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
  note0,
  note1,
  note2,
  note3,
  note4,
  note5,
  note6,
  note7,
  note8,
  note9,
]


type AudioContextValue = {
  triggerSoundEffect: (name: string) => void;
  muteAudio: ()=>void;
  unmuteAudio: ()=>void;
  isMuted: boolean;
  playBackgroundMusic: ()=>void;
}

const AudioPlayerContext = createContext<AudioContextValue>({playBackgroundMusic:()=>{}, triggerSoundEffect: () => { }, muteAudio: ()=>{}, unmuteAudio: ()=>{}, isMuted: true });

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

  const [isMuted, setIsMuted] = useState(true);

  
  const triggerSoundEffect = useCallback((name:string) => {
    // console.log(name, audioBuffers[name])
    if(!isMuted && audioBuffers[name]){
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffers[name];
      console.log(source.buffer)
      source.connect(audioContext.destination);
      source.start();
      return ()=>{source.stop()}
    }
  },[audioContext, audioBuffers, isMuted]);

  const playNote = useCallback((note:string)=>{
    // Create a gain node to control the volume
    const gainNode = audioContext.createGain();

    // Connect the AudioBuffer source to the gain node
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffers[note];
    console.log(note, audioBuffers, audioBuffers[note])
    // source.connect(audioContext.destination)
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
    gainNode.connect(audioContext.destination);
    console.log(gainNode, source)
    // Start the playback
    source.start();
    return ()=>{source.stop()}
  },[audioBuffers, audioContext])

  const playBackgroundMusic = useCallback(()=>{
    const noteRefs:(()=>void)[] = []
    const i = setInterval(()=>{
      if(!isMuted){
        const note = `note${Math.floor(Math.random()*10)}`
        console.log('playing', note)
        noteRefs.push(playNote(note))
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
  useEffect(() => {
    audioFiles.forEach(prefetchAudio);
  }, [audioContext, prefetchAudio]); // Run only on initial render

  return (
    <AudioPlayerContext.Provider value={{ triggerSoundEffect, muteAudio, unmuteAudio, isMuted, playBackgroundMusic }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};


export { AudioPlayerContextProvider, AudioPlayerContext};
