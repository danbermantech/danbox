import useAudio from "$hooks/useAudio"
import { VolumeMute, VolumeUp } from "@mui/icons-material"

const MuteToggle = () =>{
  const { isMuted, muteAudio, unmuteAudio }= useAudio()
  if(isMuted) return <button onClick={unmuteAudio}><VolumeUp sx={{fontSize:'48px'}}/></button>
  return <button onClick={muteAudio}><VolumeMute sx={{fontSize:'48px'}}/></button>

}

export default MuteToggle