import { createAction } from "@reduxjs/toolkit";

const movePlayer = createAction<{playerId:string, spaceId:string}>("movePlayer");


export default movePlayer;
