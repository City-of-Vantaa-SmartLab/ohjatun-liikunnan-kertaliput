import React from 'react';
import styled from 'react-emotion';
import Logo from '../../common/Logo';
import Decorator from '../../common/Decorator';
import LoginForm from './LoginForm';
import { connect } from 'utils';

const StyledWrapper = styled('section')`
    position: relative;
    background: ${(props) => {
        const { color1, color2 } = props.theme.signInBackGround;
        return `linear-gradient(to bottom, ${color1}, ${color2})`;
    }};
    padding: 4rem;
    display: flex;
    flex-direction: column;
    height: 100%;

    form {
        margin-top: 5rem;
    }
`;
const LogoSection = styled('div')`
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 3rem;
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.23));

    div {
        flex: inherit;
        align-items: center;
        text-align: center;
    }
`;
const AppName = styled('h1')`
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: bold;
    color: white;
    margin: 0;
    letter-spacing: 4px;
`;

const AppHeadLine = styled('span')`
    font-size: 2.3rem;
    color: white;
    opacity: 0.8;
    letter-spacing: 2px;
`;

const SizedLogo = styled(Logo)`
    width: 15rem;
    height: 15rem;
    margin-bottom: 3rem;
`;
const FixedDecorator = styled(Decorator)`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    transform: scaleY(0.7);
    transform-origin: center bottom;
`;

class SignIn extends React.Component {
    render() {
        return (
            <StyledWrapper>
                <LogoSection>
                    <SizedLogo />
                    <div>
                        <AppName>
                            {this.props.ContentStore.content.global.appName}
                        </AppName>
                        <AppHeadLine>
                            {this.props.ContentStore.content.global.appHeadLine}
                        </AppHeadLine>
                    </div>
                </LogoSection>
                <LoginForm />
                <FixedDecorator />,
            </StyledWrapper>
        );
    }
}

export default connect('ContentStore')(SignIn);