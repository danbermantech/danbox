import { createAction } from "@reduxjs/toolkit";

const removeSpace = createAction<{id:string}>("removeSpace");

export default removeSpace;
