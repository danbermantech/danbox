import { createAction } from "@reduxjs/toolkit";

const movePlayerFinal = createAction<{playerId:string, spaceId:string}>("movePlayerFinal");


export default movePlayerFinal;
