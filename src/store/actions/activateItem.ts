import { createAction } from "@reduxjs/toolkit";

const activateItem = createAction<{playerId: string, item:string}>("activateItem");

export default activateItem;
