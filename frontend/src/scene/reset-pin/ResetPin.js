import React from 'react';
import styled from 'react-emotion';
import { Form, InputField, Input, FormLink } from '../../components/form';
import { connect } from 'utils';
import { Link } from 'react-router-dom';
import Button from '../../components/button';
import FormState from './state';
import ConfirmationModal from './ConfirmationModal';
import LoadingSpinner from '../../components/spinner';

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
class ResetPin extends React.Component {
    state = new FormState(this.props.userStore);
    render() {
        const i18nContent = this.props.i18nStore.content;
        return (
            <React.Fragment>
                <Form>
                    <Title>{i18nContent.resetPinForm.title}</Title>
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
                        {i18nContent.resetPinForm.errorMessage}
                    </ErrorMessage>
                    <FormAction>
                        <Button
                            color="white"
                            hoveredTextColor="rgba(0,0,0, .8)"
                            disabled={!this.state.formIsValid}
                            onClick={(e) => {
                                e.preventDefault();
                                this.state.resetPin();
                            }}
                        >
                            {i18nContent.resetPinForm.submit}
                        </Button>
                    </FormAction>
                    <FormLink style={{ marginTop: '1rem' }}>
                        <Link to="/login">
                            {i18nContent.registrationForm.hasAccountPrompt}
                        </Link>
                    </FormLink>
                </Form>
                <LoadingSpinner
                    show={this.state.submitting}
                    text={i18nContent.resetPinForm.spinnerText}
                />
                <ConfirmationModal
                    show={this.state.submitSuccess}
                    username={this.props.userStore.username}
                    i18nContent={i18nContent}
                />
            </React.Fragment>
        );
    }
}

export default connect('i18nStore', 'userStore')(ResetPin);
