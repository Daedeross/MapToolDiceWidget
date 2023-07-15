import { addListener, createListenerMiddleware } from "@reduxjs/toolkit";
import type { TypedStartListening, TypedAddListener } from '@reduxjs/toolkit'

import { AppDispatch, RootState } from "./store";
import { isSettingsChanged, pushChangesToMapTool } from "./update-settings";

export const listenerMiddleware = createListenerMiddleware();

export type AppStartListening = TypedStartListening<RootState, AppDispatch>

export const startAppListening =
  listenerMiddleware.startListening as AppStartListening;

export const addAppListener = addListener as TypedAddListener<
  RootState,
  AppDispatch
>

startAppListening({
  predicate: isSettingsChanged,
  effect: pushChangesToMapTool
})

export default listenerMiddleware;