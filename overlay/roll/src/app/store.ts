import { configureStore } from '@reduxjs/toolkit';

import rollReducer from '../features/rolls/rolls-slice';
import settingsReducer from '../features/settings/settings-slice';
import listenerMiddleware from './listener';

export const store = configureStore({
    reducer: {
        roll: rollReducer,
        settings: settingsReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(listenerMiddleware.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default store;