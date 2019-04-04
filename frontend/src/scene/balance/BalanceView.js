import React, { Component } from 'react';
import styled from 'react-emotion';
import BaseModal, {
    Title,
    Content as ModalContent,
} from '../../components/modal';
import Button from '../../components/button';
import {
    Form as DefaultForm,
    Input,
    InputField as DefaultInputField,
} from '../../components/form';
import posed, { PoseGroup } from 'react-pose';
import { connect, composeFunction } from 'utils';
import BalanceViewState from './state';

const Modal = styled(BaseModal)`
    justify-content: center;
`;
const Content = styled(ModalContent)`
    display: flex;
    flex-direction: column;

    div {
        display: inherit;
        flex-direction: column;
        text-align: center;
        justify-content: center;

        h4 {
            text-transform: uppercase;
        }
        * {
            margin: 1rem;
        }
        span {
            font-size: 7rem;
            font-family: GT-Walsheim, sans-serif;
            color: ${(props) => props.theme.main};
        }
    }
`;

const BalanceInfoAreaAnimation = posed.div({
    show: {
        top: true,
    },
});
const BalanceInfoArea = styled(BalanceInfoAreaAnimation)`
    align-self: center;
`;
const FormWarpper = posed.div({
    preEnter: {
        y: 300,
        opacity: 0,
    },
    enter: {
        y: 0,
        opacity: 1,
    },
    exit: {
        y: 280,
        opacity: 0,
    },
});
const Form = styled(DefaultForm)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-top: 5px ${(props) => props.theme.main} solid;
    margin: 0 !important;
`;
const InputField = styled(DefaultInputField)`
    margin: 2rem 0 !important;
    align-self: stretch;
    label {
        color: rgba(0, 0, 0, 0.7);
        text-align: left;
    }
    input {
        width: auto;
        border: 1px ${(props) => props.theme.main} solid;
        width: auto;
    }
`;
const SubmitButton = styled(Button)`
    align-self: center;
`;

class BalanceView extends Component {
    state = new BalanceViewState();

    setAmount = (e) => this.state.setAmount(e.target.value);
    onConfirm = (e) => {
        e.preventDefault();
        if (this.state.formIncorrect) return;
        this.props.userStore.requestAddBalance(this.state.amount);
    };

    render() {
        const formShown = this.state.formShown;
        const balance = this.props.userStore.balance;
        const i18nContent = this.props.i18nStore.content.balanceView;
        return (
            <Modal
                show={this.props.show || this.props.isShown}
                onClear={() => {
                    this.state.hideForm();
                    this.props.onClear();
                }}
            >
                <Content>
                    <BalanceInfoArea pose={'show'}>
                        <Title>{i18nContent.sectionTitle}</Title>
                        <span>{Number(balance).toLocaleString('fi')} €</span>
                        {!formShown &&
                            !this.props.isShown && (
                                <Button onClick={this.state.showForm}>
                                    {i18nContent.topUp}
                                </Button>
                            )}
                    </BalanceInfoArea>
                    <PoseGroup animateOnMount>
                        {(formShown || this.props.isShown) && (
                            <FormWarpper key="1">
                                <Form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                    }}
                                >
                                    <InputField
                                        error={this.state.formIncorrect}
                                    >
                                        <label htmlFor="amount">
                                            {i18nContent.amount}
                                        </label>
                                        <Input
                                            id="coincard"
                                            name="amount"
                                            type="number"
                                            value={this.state.amount}
                                            onChange={composeFunction(
                                                this.state.startValidate,
                                                this.setAmount
                                            )}
                                        />
                                    </InputField>
                                </Form>
                                <SubmitButton
                                    bold
                                    onClick={this.onConfirm}
                                    disabled={
                                        this.state.formIncorrect ||
                                        !this.state.amount
                                    }
                                >
                                    {i18nContent.confirm}
                                </SubmitButton>
                            </FormWarpper>
                        )}
                    </PoseGroup>
                </Content>
            </Modal>
        );
    }
}

export default connect('userStore', 'i18nStore')(BalanceView);
