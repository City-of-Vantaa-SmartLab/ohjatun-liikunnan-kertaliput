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
    state = {
        showForm: false,
        amount: 0,
    };

    showForm = () => this.setState({ showForm: true });
    setAmount = (e) => this.setState({ amount: e.target.value });
    onConfirm = (e) => {
        e.preventDefault();
        this.props.userStore.requestAddBalance(this.state.amount);
    };

    render() {
        const showForm = this.state.showForm;
        const balance = this.props.userStore.balance;
        const i18nContent = this.props.i18nStore.content.balanceView;
        return (
            <Modal
                show={this.props.show}
                onClear={() => {
                    this.props.onClear();
                    this.setState({ showForm: false });
                }}
            >
                <Content>
                    <BalanceInfoArea pose={showForm ? 'show' : 'normal'}>
                        <Title>{i18nContent.sectionTitle}</Title>
                        <span>{balance} €</span>
                        {!showForm && (
                            <Button bold onClick={this.showForm}>
                                {i18nContent.topUp}
                            </Button>
                        )}
                    </BalanceInfoArea>
                    <PoseGroup animateOnMount>
                        {showForm && (
                            <FormWarpper style={{ margin: 0, width: '90%' }}>
                                <Form key="1">
                                    <InputField>
                                        <label htmlFor="amount">
                                            {i18nContent.amount}
                                        </label>
                                        <Input
                                            type="number"
                                            defaultValue="0"
                                            value={this.state.amount}
                                            onChange={this.setAmount}
                                        />
                                    </InputField>
                                    <Button bold onClick={this.onConfirm}>
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
