import { QueueAction } from "$store/types";
import { createAction } from "@reduxjs/toolkit";

const addQueuedAction = createAction<QueueAction>("addQueuedAction");

export default addQueuedAction;

export const example = {
  type: 'addQueuedAction',
  payload: {mode: 'RANDOM_ASSET_CHANGE', for: ['gary']}
}