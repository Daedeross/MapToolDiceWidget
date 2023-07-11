import { configureStore } from '@reduxjs/toolkit';

import rollReducer from '../features/rolls/rolls-slice';
import settingsReducer from '../features/settings/settings-slice';

export const store = configureStore({
    reducer: {
        roll: rollReducer,
        settings: settingsReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default store;