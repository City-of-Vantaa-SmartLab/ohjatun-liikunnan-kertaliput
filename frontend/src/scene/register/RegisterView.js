import React from 'react';
import styled from 'react-emotion';
import { Form, InputField, Input, FormLink } from '../../components/form';
import Button from '../../components/button';
import { connect } from 'utils';
import { Link } from 'react-router-dom';
import FormState from './state';
import ConfirmationModal from './ConfirmationModal';

const FormAction = styled('div')`
    align-self: stretch;
    display: flex;
    justify-content: flex-end;
    margin: 2rem;
`;
const Title = styled('h1')`
    margin: 0;
    font-size: 3rem;
    color: white;
    text-align: center;
`;
const ErrorMessage = styled('span')`
    display: flex;
    font-size: 2rem;
    margin: 0 2rem;
    color: ${(props) => props.theme.error};
    font-weight: bold;
    display: ${(props) => (props.show ? 'flex' : 'none')};
`;

class RegisterForm extends React.Component {
    state = new FormState(this.props.userStore);
    render() {
        const i18nContent = this.props.i18nStore.content;
        return (
            <React.Fragment>
                <Form>
                    <Title>{i18nContent.registrationForm.title}</Title>
                    <InputField>
                        <label htmlFor="username">
                            {i18nContent.signIn.form.name}
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
                            this.state.phoneNumber.length > 9 &&
                            !this.state.formIsValid
                        }
                    >
                        <label htmlFor="phoneNumber">
                            {i18nContent.signIn.form.tel}
                        </label>
                        <Input
                            type="tel"
                            name="phoneNumber"
                            value={this.state.phoneNumber}
                            onChange={this.state.setPhoneNumber}
                        />
                    </InputField>
                    <ErrorMessage show={this.state.submitError}>
                        {this.state.submitError === 'alreadyExist'
                            ? i18nContent.registrationForm
                                  .phoneNumberAlreadyExists
                            : i18nContent.registrationForm.errorMessage}
                    </ErrorMessage>

                    {this.state.submitError !== 'alreadyExist' && (
                        <FormAction>
                            <Button
                                disabled={!this.state.formIsValid}
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.state.submitData();
                                }}
                            >
                                {i18nContent.registrationForm.submit}
                            </Button>
                        </FormAction>
                    )}
                    <FormLink style={{ marginTop: '1rem' }}>
                        {this.state.submitError === 'alreadyExist' && (
                            <Link to="/reset-pin">
                                {i18nContent.signIn.form.forgotPassword}
                            </Link>
                        )}
                        <Link to="/login">
                            {i18nContent.registrationForm.hasAccountPrompt}{' '}
                        </Link>
                    </FormLink>
                </Form>
                <ConfirmationModal
                    show={this.state.submitSuccess}
                    username={this.state.username}
                    i18nContent={i18nContent}
                    phoneNumber={this.state.phoneNumber}
                />
            </React.Fragment>
        );
    }
}

export default connect('i18nStore', 'userStore')(RegisterForm);
