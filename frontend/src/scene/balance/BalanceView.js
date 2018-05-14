import React, { Component } from 'react';
import styled from 'react-emotion';
import Modal, { Title, Content as ModalContent } from '../../components/modal';
import Button from '../../components/button';
import {
    Form as DefaultForm,
    Input,
    InputField as DefaultInputField,
} from '../../components/form';
import posed, { PoseGroup } from 'react-pose';
import { connect } from 'utils';
import BalanceViewState from './state';

const Content = styled(ModalContent)`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: baseline;
    align-items: center;
    flex-direction: column;
    margin-top: 10rem;

    div {
        display: inherit;
        flex-direction: column;
        text-align: center;
        margin: 4rem;

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

const BalanceInfoArea = posed.div({
    show: {
        y: -50,
    },
    normal: {
        y: 0,
    },
});
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
        y: 300,
        opacity: 0,
    },
});

const Form = styled(DefaultForm)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-top: 5px ${(props) => props.theme.main} solid;
    width: auto;
    margin: 0 !important;

    button {
        padding: 2rem !important;
        width: auto;
        align-self: center;
    }
`;
const InputField = styled(DefaultInputField)`
    margin: 2rem 0 !important;
    align-self: stretch;
    label {
        color: rgba(0, 0, 0, 0.7);
        text-align: left;
    }
    input {
        border: 1px ${(props) => props.theme.main} solid;
        width: auto;
    }
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
                show={this.props.show}
                onClear={() => {
                    this.props.onClear();
                    this.state.hideForm();
                }}
            >
                <Content>
                    <BalanceInfoArea pose={formShown ? 'show' : 'normal'}>
                        <Title>{i18nContent.sectionTitle}</Title>
                        <span>{balance} €</span>
                        {!formShown && (
                            <Button bold onClick={this.state.showForm}>
                                {i18nContent.topUp}
                            </Button>
                        )}
                    </BalanceInfoArea>
                    <PoseGroup animateOnMount>
                        {formShown && (
                            <FormWarpper
                                key="1"
                                style={{ margin: 0, width: '90%' }}
                            >
                                <Form>
                                    <InputField
                                        error={this.state.formIncorrect}
                                    >
                                        <label htmlFor="amount">
                                            {i18nContent.amount}
                                        </label>
                                        <Input
                                            name="amount"
                                            onFocus={this.state.startValidate}
                                            type="number"
                                            value={this.state.amount}
                                            onChange={this.setAmount}
                                        />
                                    </InputField>
                                    <Button
                                        bold
                                        onClick={this.onConfirm}
                                        disabled={this.state.formIncorrect}
                                    >
                                        {i18nContent.confirm}!
                                    </Button>
                                </Form>
                            </FormWarpper>
                        )}
                    </PoseGroup>
                </Content>
            </Modal>
        );
    }
}

export default connect('userStore', 'i18nStore')(BalanceView);
