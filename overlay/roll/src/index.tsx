import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { store } from './app/store';
import Rolls from './features/rolls/rolls';

// Importing the Bootstrap CSS
import './resources/styles.scss';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

root.render(
    <Provider store={store}>
        <Rolls />
    </Provider>
);

