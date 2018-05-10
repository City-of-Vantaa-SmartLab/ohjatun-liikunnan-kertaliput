import React from 'react';
import Button from '../../common/Button';
import styled from 'react-emotion';
import { connect } from 'utils';
import { Link } from 'react-router-dom';
import { tween, easing, chain, delay } from 'popmotion';

const AppHeaderWrapper = styled('div')`
    width: 100%;
    background-color: white;
    padding: 2rem;
`;

const LogoBar = styled('div')`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${(props) => props.theme.main};
    a  {
        color: inherit;
    }
    button {
        border-color: ${(props) => props.theme.main};
        color: inherit;
        flex-shrink: 0;

        &:hover {
            color: white;
            background-color: ${(props) => props.theme.main};
            border-color: transparent;
        }
    }

    span {
        font-size: 2.5rem;
        font-weight: bold;
        text-transform: uppercase;
        text-align: center;
    }
`;

class AppHeader extends React.Component {
    previousBalance = 0;
    componentDidMount = () => this.animateBalance();
    componentDidUpdate = () => this.animateBalance();

    animateBalance = () => {
        if (this.balanceButton) {
            chain(
                delay(500),
                tween({
                    from: this.previousBalance,
                    to: this.props.userStore.balance,
                    duration: 3000,
                    ease: easing.easeOut,
                })
            )
                .pipe(Math.round)
                .start((v) => {
                    try {
                        this.balanceButton.textContent = '€ ' + v;
                    } catch (error) {}
                });
        }
        this.previousBalance = this.props.userStore.balance;
    };
    render() {
        const content = this.props.i18nStore.content.appHeader;
        const appName = this.props.i18nStore.content.global.appName;
        const { isAuthenticated, logout, balance } = this.props.userStore;

        return (
            <AppHeaderWrapper>
                <LogoBar>
                    {isAuthenticated ? (
                        <Button onClick={logout}>{content.logout}</Button>
                    ) : (
                        <Link to="/login">
                            <Button>{content.login}</Button>
                        </Link>
                    )}
                    <span>{appName}</span>
                    {isAuthenticated && (
                        <Button
                            innerRef={(instance) =>
                                (this.balanceButton = instance)
                            }
                            onClick={this.props.requestShowBalance}
                        >
                            0 €
                        </Button>
                    )}
                </LogoBar>
            </AppHeaderWrapper>
        );
    }
}

export default connect('i18nStore', 'userStore')(AppHeader);
