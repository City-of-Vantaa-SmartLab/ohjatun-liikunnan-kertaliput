import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SignIn from './scene/sign-in';
import MainView from './scene/main-view';
import DevTool from './scene/dev-tool';
import AppLoader from './scene/app-loader';
import styled from 'react-emotion';

const AppContainer = styled('section')`
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    position: relative;

    /* small devices */
    @media (max-width: 320px) and (max-height: 480px) {
        height: 480px;
    }
    @media only screen and (max-height: 580px) {
        height: 580px;
    }
`;

class App extends React.Component {
    render() {
        return (
            <AppContainer>
                <AppLoader />
                <Switch>
                    <Route exact path="/main" component={MainView} />
                    <Route path="/" component={SignIn} />
                    <Route exact path="/login" component={SignIn} />
                    <Route exact path="/register" component={SignIn} />
                    <Route exact path="/reset-pin" component={SignIn} />
                </Switch>
                <DevTool />
            </AppContainer>
        );
    }
}

export default App;
