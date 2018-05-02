import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SignIn from './scene/sign-in';
import MainView from './scene/main-view';
import DevTool from './scene/dev-tool';
import styled from 'react-emotion';

const AppContainer = styled('section')`
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;

    div::first-child,
    section::first-child {
        width: 100%;
        height: 100%;
    }
`;

class App extends React.Component {
    render() {
        return (
            <AppContainer>
                <Switch>
                    <Route exact path="/" component={MainView} />
                    <Route exacg path="/main" component={MainView} />
                    <Route exact path="/login" component={SignIn} />
                    <Route exact path="/register" component={SignIn} />
                </Switch>
                <DevTool />
            </AppContainer>
        );
    }
}

export default App;
