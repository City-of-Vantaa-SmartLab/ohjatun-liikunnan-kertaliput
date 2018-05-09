import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SignIn from './scene/sign-in';
import MainView from './scene/main-view';
import DevTool from './scene/dev-tool';
import styled, { injectGlobal } from 'react-emotion';

const AppContainer = styled('section')`
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    max-height: 100%;
`;

injectGlobal`
    html, body {
        min-height: ${window.screen.height}px;
    }
`;

class App extends React.Component {
    render() {
        return (
            <AppContainer>
                <Switch>
                    <Route exact path="/main" component={MainView} />
                    <Route path="/" component={SignIn} />
                    <Route exact path="/login" component={SignIn} />
                    <Route exact path="/register" component={SignIn} />
                </Switch>
                <DevTool />
            </AppContainer>
        );
    }
}

export default App;
