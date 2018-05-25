import React from 'react';
import Button from '../../components/button';
import styled from 'react-emotion';
import { connect } from 'utils';
import { Link, Redirect } from 'react-router-dom';
import BalanceView from '../balance';

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
        flex-shrink: 0;
    }

    span {
        font-size: 2.5rem;
        font-weight: bold;
        text-transform: uppercase;
        text-align: center;
    }
`;

class AppHeader extends React.Component {
    state = {
        show: false,
        redirect: false,
    };
    clear = () => {
        this.setState({ show: false });
    };
    show = () => {
        this.setState({ show: true });
    };

    render() {
        const content = this.props.i18nStore.content.appHeader;
        const appName = this.props.i18nStore.content.global.appName;
        const { isAuthenticated, logout, balance } = this.props.userStore;
        if (this.state.redirect) return <Redirect to="/login" />;
        return (
            <AppHeaderWrapper>
                <LogoBar>
                    {isAuthenticated ? (
                        <Button
                            onClick={async (e) => {
                                await logout();
                                this.setState({ redirect: true });
                            }}
                        >
                            {content.logout}
                        </Button>
                    ) : (
                        <Link to="/login">
                            <Button>{content.login}</Button>
                        </Link>
                    )}
                    <span>{appName}</span>
                    {isAuthenticated && (
                        <Button onClick={this.show}>{balance} €</Button>
                    )}
                </LogoBar>
                <BalanceView show={this.state.show} onClear={this.clear} />
            </AppHeaderWrapper>
        );
    }
}

export default connect('i18nStore', 'userStore')(AppHeader);
