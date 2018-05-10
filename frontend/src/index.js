import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'emotion-theming';
import stores from './stores';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const theme = {
    signInBackground: '#FFC107',
    main: '#2979FF',
    complementary: '#FFEB3B',
    green: '#66BB6A',
};
const { i18nStore, userStore, courseStore } = stores;

const Root = () => (
    <BrowserRouter>
        <Provider
            i18nStore={i18nStore}
            userStore={userStore}
            courseStore={courseStore}
        >
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </Provider>
    </BrowserRouter>
);
ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
