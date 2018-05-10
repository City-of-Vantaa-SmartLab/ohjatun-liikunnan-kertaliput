import React from 'react';
import styled from 'react-emotion';
import Logo from '../../common/Logo';
import LoginForm from './LoginForm';
import AppBrand from './AppBrand';
import RegisterForm from '../register';
import { withRouter } from 'react-router-dom';
import posed, { PoseGroup } from 'react-pose';
import { Redirect } from 'react-router-dom';
import { connect } from 'utils';

const AnimatableContainer = posed.div({
    preEnter: {
        x: '-200%',
    },
    enter: {
        x: '0',
    },
    exit: {
        x: '200%',
    },
});
const Container = styled(AnimatableContainer)`
    margin: none;
    padding: none;
    display: inherit;
    width: 100%;
`;

const StyledWrapper = styled('section')`
    position: relative;
    background-color: ${(props) => props.theme.signInBackground};
    padding: 4rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
`;

const SizedLogo = styled(Logo)`
    width: 13rem;
    height: 13rem;
`;

class SignIn extends React.Component {
    render() {
        const location = this.props.location.pathname;
        // this view is forbidden for authenticated user
        if (this.props.userStore.isAuthenticated) {
            return <Redirect to="/main" />;
        }
        return (
            <StyledWrapper>
                <AppBrand />
                <PoseGroup preEnterPose="preEnter">
                    {location === '/register' ? (
                        <Container key="RegisterForm">
                            <RegisterForm />
                        </Container>
                    ) : (
                        <Container key="loginForm">
                            <LoginForm />
                        </Container>
                    )}
                </PoseGroup>
                <SizedLogo />
            </StyledWrapper>
        );
    }
}

export default withRouter(connect('userStore')(SignIn));
