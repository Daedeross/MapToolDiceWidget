'use strict'
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { store } from './app/store';
import Rolls from './features/rolls/rolls';

// Importing the Bootstrap CSS
import './resources/styles.scss';
import { updateSettings, useAppDispatch } from './app/hooks';
import { useEffect } from 'react';
import { settingsActions } from './features/settings/settings-slice';
import { SettingsDto } from './features/settings/settings-model';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

// const FETCH_URI = "lib://daedeross.roll/macro/getSettings";
// const FETCH_URI = "macro:getSettings@this";
// const FETCH_URI = "macro:getSettings@daedeross.roll";
const FETCH_URI = "macro:getSettings@lib:daedeross.roll";

function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        fetch(FETCH_URI, {method: 'POST' })
            .then(//r => console.log("R: " + r),
                (response) => response.json()
                    .then(dto => dispatch(settingsActions.setSettings(dto as SettingsDto))),
                (error) => console.log("<ERROR>" + error + "</ERROR>")
            ).catch(e => console.log(e));
        return () => { };
    }, [])

    return (
        <Rolls />
    );
}

root.render(
    <Provider store={store}>
        <App />
    </Provider>
);

export const pushUpdate = updateSettings ;