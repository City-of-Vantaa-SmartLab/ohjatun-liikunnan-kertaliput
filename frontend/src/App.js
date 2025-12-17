import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SignIn from './scene/sign-in';
import MainView from './scene/main-view';
import DevTool from './scene/dev-tool';
import CookieBanner from './scene/cookie-banner';
import AppLoader from './scene/app-loader';
import styled from '@emotion/styled';

const AppContainer = styled('section')`
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    min-height: 480px;
    position: relative;
`;

class App extends React.Component {
    render() {
        return (
            <AppContainer>
                <AppLoader />
                <Switch>
                    <Route exact path="/main" component={MainView} />
                    <Route path="/payment-complete" component={MainView} />
                    <Route path="/" component={SignIn} />
                    <Route exact path="/login" component={SignIn} />
                    <Route exact path="/register" component={SignIn} />
                    <Route exact path="/reset-pin" component={SignIn} />
                </Switch>
                <DevTool />
                <CookieBanner />
            </AppContainer>
        );
    }
}

export default App;
