import { Modal } from "@mui/material";

const PlayerSettings = ({ open }: { open: boolean }) => {
  return (
    <Modal open={open}>
      <div>
        <h1>Player Settings</h1>
      </div>
    </Modal>
  );
};

export default PlayerSettings;
