import React from 'react';
import styled from 'react-emotion';
import { Form, InputField, Input, FormLink } from '../../components/form';
import Button from '../../components/button';
import Modal, { Content } from '../../components/modal';
import { connect } from 'utils';
import { Link } from 'react-router-dom';
import FormState from './state';
import ConfirmationModal from './ConfirmationModal';

const FormAction = styled('div')`
    padding-top: 2rem;
    width: 100%;
    display: flex;
    justify-content: space-between flex-end;
`;
const Title = styled('h1')`
    font-size: 4rem;
    color: white;
    text-transform: uppercase;
    text-align: center;
`;
const ErrorMessage = styled('h4')`
    font-size: 2rem;
    margin: 0;
    color: yellow;
    text-align: right;
    transition: all 0.5s ease;
    opacity: ${(props) => (props.show ? 1 : 0)};
`;

class RegisterForm extends React.Component {
    state = new FormState(this.props.userStore);
    render() {
        return (
            <React.Fragment>
                <Form>
                    <Title>Register Form</Title>
                    <InputField>
                        <label htmlFor="username">
                            {this.props.i18nStore.content.signIn.form.name}
                        </label>
                        <Input
                            type="text"
                            name="username"
                            value={this.state.username}
                            onChange={this.state.setUsername}
                        />
                    </InputField>
                    <InputField
                        error={
                            this.state.phoneNumber.length > 10 &&
                            !this.state.formIsValid
                        }
                    >
                        <label htmlFor="phoneNumber">
                            {this.props.i18nStore.content.signIn.form.tel}
                        </label>
                        <Input
                            type="tel"
                            name="phoneNumber"
                            value={this.state.phoneNumber}
                            onChange={this.state.setPhoneNumber}
                        />
                    </InputField>
                    <ErrorMessage show={this.state.submitError}>
                        {'Cannot register new account. Please try again'}
                    </ErrorMessage>
                    <FormAction>
                        <Button
                            disabled={!this.state.formIsValid}
                            onClick={(e) => {
                                e.preventDefault();
                                this.state.submitData();
                            }}
                        >
                            Submit
                        </Button>
                    </FormAction>
                    <FormLink style={{ marginTop: '1rem' }}>
                        <Link to="/login">Already have an account? </Link>
                    </FormLink>
                </Form>
                <ConfirmationModal
                    show={this.state.submitSuccess}
                    username={this.props.userStore.username}
                />
            </React.Fragment>
        );
    }
}

export default connect('i18nStore', 'userStore')(RegisterForm);
