import React from 'react';
import styled from '@emotion/styled';
import Logo from '../../common/Logo';
import LoginForm from './LoginForm';
import AppBrand from './AppBrand';
import RegisterForm from '../register';
import ResetPinForm from '../reset-pin';
import { withRouter } from 'react-router-dom';
import posed, { PoseGroup } from 'react-pose';
import { Redirect } from 'react-router-dom';
import { connect } from 'utils';
import { spring } from 'popmotion';

const AnimatableContainer = posed.div({
    preEnter: {
        x: '-150%',
        transition: (props) =>
            spring({ ...props, stiffness: 200, damping: 50 }),
    },
    enter: {
        x: '0',
        transition: (props) =>
            spring({ ...props, stiffness: 200, damping: 50 }),
    },
    exit: {
        x: '150%',
        transition: (props) =>
            spring({ ...props, stiffness: 200, damping: 50 }),
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
    width: 10rem;
    height: 10rem;
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
                        <Container key="register">
                            <RegisterForm />
                        </Container>
                    ) : location === '/reset-pin' ? (
                        <Container key="resetpin">
                            <ResetPinForm />
                        </Container>
                    ) : (
                        <Container key="LoginForm">
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
