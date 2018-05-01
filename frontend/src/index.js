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
    signInBackGround: {
        color1: '#3F8EDB',
        color2: '#3F8EDB',
    },
    main: '#3F8EDB',
    mainDark: '#183552',
    complementary: '#F9E51E',
    green: '#66BB6A',
};

const Root = () => (
    <BrowserRouter>
        <Provider
            ContentStore={stores.contentStore}
            UserStore={stores.userStore}
            CourseStore={stores.courseStore}
        >
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </Provider>
    </BrowserRouter>
);
ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
