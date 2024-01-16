import { createAction } from "@reduxjs/toolkit";
import type { StoreData } from "../types";

const setState = createAction<StoreData>("setState");

export default setState;
