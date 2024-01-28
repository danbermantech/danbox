import { AppBar, Toolbar, Typography } from "@mui/material"
import useMe from '$hooks/useMe'
const PlayerHeader = () =>{
  const me = useMe();
  return (<AppBar  className="bg-red-400 flex-shrink">
        <Toolbar variant="dense">
          <img src={me?.image} width={48} height={48} className="rounded-full " />
          <Typography variant="h6" color="inherit" component="div">
            {me?.name}
          </Typography>
        </Toolbar>
  </AppBar>)
}
export default PlayerHeader