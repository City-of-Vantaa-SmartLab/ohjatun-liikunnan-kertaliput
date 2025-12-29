import React from 'react';
import styled from '@emotion/styled';
import Logo from '../../common/Logo';
import LoginForm from './LoginForm';
import AppBrand from './AppBrand';
import RegisterForm from '../register';
import ResetPinForm from '../reset-pin';
import { Navigate } from 'react-router-dom';
import { connect } from 'utils';

import { withRouter } from '../../utils/withRouter';
const Container = styled.div`
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
            return <Navigate to="/main" replace />;
        }
        return (
            <StyledWrapper>
                <AppBrand />
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
                <SizedLogo />
                <h4 style={{ color: 'white' }}>v2</h4>
            </StyledWrapper>
        );
    }
}

export default withRouter(connect('userStore')(SignIn));
