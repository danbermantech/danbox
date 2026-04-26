import useAudio from "$hooks/useAudio"
import { VolumeMute, VolumeUp } from "@mui/icons-material"

const MuteToggle = () =>{
  const { isMuted, muteAudio, unmuteAudio }= useAudio()
  if(isMuted) return <button onClick={unmuteAudio}><VolumeMute sx={{fontSize:'24px'}}/></button>
  return <button onClick={muteAudio}><VolumeUp sx={{fontSize:'24px'}}/></button>

}

export default MuteToggle