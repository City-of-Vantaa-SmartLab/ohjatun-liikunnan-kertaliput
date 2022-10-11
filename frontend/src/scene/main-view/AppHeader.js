import React from 'react';
import Button from '../../components/button';
import styled from 'react-emotion';
import { connect } from 'utils';
import { Link, Redirect } from 'react-router-dom';
import BalanceView from '../balance';
import PaymentProvidersView from '../payment-providers';

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
        showPaymentProviders: false,
        paymentProviders: null,
    };
    clear = () => {
        this.setState({ show: false });
    };
    clearPayment = () => {
        this.clear();
        this.setState({
            showPaymentProviders: false,
            paymentProviders: null,
        });
    };
    show = () => {
        this.setState({ show: true });
    };
    initiatePayment = async (paymentProviders) => {
        console.log('Payment initiated from app header.');
        this.setState({
            paymentProviders: await paymentProviders,
            showPaymentProviders: true,
        });
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
                        <Button onClick={this.show}>
                            {Number(balance).toLocaleString('fi')} €
                        </Button>
                    )}
                </LogoBar>
                <BalanceView
                    show={this.state.show}
                    onClear={this.clear}
                    initiatePayment={this.initiatePayment}
                />
                {this.state.showPaymentProviders && (
                    <PaymentProvidersView
                        providers={this.state.paymentProviders}
                        onClear={this.clearPayment}
                    />
                )}
            </AppHeaderWrapper>
        );
    }
}

export default connect('i18nStore', 'userStore')(AppHeader);
