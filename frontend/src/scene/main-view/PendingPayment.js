import React, { Component } from 'react';
import styled from 'react-emotion';
import Modal, { Title, Content as ModalContent } from '../../components/modal';
import Button from '../../components/button';
import { connect } from 'utils';
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

class PendingPayment extends Component {

    clear = () => {
        this.props.userStore.pendingPayment = null;
        this.setState({ show: false});
    };
    render() {
        const pendingPayment = this.props.userStore.pendingPayment;
        const i18nContent = this.props.i18nStore.content;
        const show = !!pendingPayment;
        return (
            <Modal show = {show} onClear = {this.clear}>
                <Content>
                    <div>
                        <Title>
                            {
                                i18nContent.paymentConfirmationForm.pending.title
                            }
                        </Title>
                        <Title>
                            {
                                i18nContent.paymentConfirmationForm.pending.balanceDesc
                            }
                        </Title>
                        <span>{this.props.userStore.balance} €</span>
                    </div>
                </Content>
            </Modal>
        );
    }
}

export default connect('i18nStore', 'userStore')(PendingPayment);