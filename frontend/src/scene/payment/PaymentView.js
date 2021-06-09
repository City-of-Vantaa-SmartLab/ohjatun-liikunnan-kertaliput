import React, { Component } from 'react';
import styled from 'react-emotion';
import Modal, { Title, Content as ModalContent } from '../../components/modal';
import Button from '../../components/button';
import { connect } from 'utils';
import PaymentState from './state';
import { withRouter, Redirect } from 'react-router-dom';

const Content = styled(ModalContent)`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 5rem;

    div {
        display: inherit;
        flex-direction: column;
        text-align: center;
        margin: 2rem;

        * {
            margin: 1rem;
        }
        span {
            font-size: 8rem;
            font-family: GT-Walsheim, sans-serif;
            color: ${(props) => props.theme.main};
        }
    }
`;

class PaymentView extends Component {
    state = new PaymentState(this.props.userStore);

    clear = (e) => {
        this.setState({ requestToClose: true });
    };
    render() {
        if (this.state.requestToClose) {
            return <Redirect to="/main" />;
        }
        const show = this.props.location.pathname === '/payment-complete';
        const i18nContent = this.props.i18nStore.content;
        const params = this.props.location.search;
        const parsed = this.state.validateRequest(params);

        return (
            <Modal show={show} onClear={this.clear}>
                <Content>
                    {!this.state.paymentFailed && (
                        <div>
                            <Title>
                                {
                                    i18nContent.paymentConfirmationForm.success
                                        .title
                                }
                            </Title>
                            <Title>
                                {
                                    i18nContent.paymentConfirmationForm.success
                                        .newBalanceDesc
                                }
                            </Title>
                            <span>{parsed.balance} €</span>
                        </div>
                    )}
                    {this.state.paymentFailed && (
                        <div>
                            <Title>
                                {
                                    i18nContent.paymentConfirmationForm.failure
                                        .title
                                }
                            </Title>
                            <Title>
                                {
                                    i18nContent.paymentConfirmationForm.failure
                                        .balanceDesc
                                }
                            </Title>
                            <span>{this.props.userStore.balance} €</span>
                        </div>
                    )}
                    <Button bold onClick={this.clear}>
                        {i18nContent.paymentConfirmationForm.dismiss}
                    </Button>
                </Content>
            </Modal>
        );
    }
}

export default withRouter(connect('i18nStore', 'userStore')(PaymentView));
