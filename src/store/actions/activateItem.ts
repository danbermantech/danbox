import { createAction } from "@reduxjs/toolkit";

const activateItem = createAction<{user: string, target:string, value?:unknown, item:string}>("activateItem");

export default activateItem;
