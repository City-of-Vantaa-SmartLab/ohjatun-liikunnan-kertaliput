import React from 'react';
import styled from 'react-emotion';
import { Form, InputField, Input, FormLink } from '../../components/form';
import { connect } from 'utils';
import { autorun } from 'mobx';
import { Link } from 'react-router-dom';

const PinCodeInput = styled(Input)`
    width: 7rem;
    height: 6rem;
    display: inline-block;
    text-align: center;
    text-shadow: 0 0 0 white;
    color: transparent;
    text-shadow: 0 0 0 rgba(0, 0, 0, 0.8);
`;

const pinArr = [0, 1, 2, 3];

class LoginForm extends React.Component {
    componentDidMount() {
        autorun(() => {
            if (this.props.userStore.authenticationFailed && this.input0)
                this.input0.focus();
        });
    }
    onTelephoneInputChange = (e) => {
        this.props.userStore.setPhoneNumber(e.target.value);
    };
    onPinCodeInputsChange = (key) => (e) => {
        const setResult = this.props.userStore.setInputCode(
            key,
            e.target.value
        );
        if (setResult && key !== 3) {
            if (key === 3) this[`input0`].focus();
            else this[`input${key + 1}`].focus();
        }
    };
    render() {
        const content = this.props.i18nStore.content;
        const authenticationFailed = this.props.userStore.authenticationFailed;

        return (
            <Form>
                <InputField error={authenticationFailed}>
                    <label htmlFor="telephone">
                        {authenticationFailed
                            ? content.signIn.form.telIsWrong
                            : content.signIn.form.tel}
                    </label>
                    <Input
                        name="telephone"
                        type="tel"
                        value={this.props.userStore.phoneNumber || ''}
                        onChange={this.onTelephoneInputChange}
                    />
                </InputField>
                <InputField error={authenticationFailed}>
                    <label htmlFor="pinCode">
                        {authenticationFailed
                            ? content.signIn.form.pinCodeIsWrong
                            : content.signIn.form.pinCode}
                    </label>
                    <div>
                        {pinArr.map((key) => (
                            <PinCodeInput
                                innerRef={(instance) =>
                                    (this['input' + key] = instance)
                                }
                                key={key}
                                type="password"
                                onChange={this.onPinCodeInputsChange(key)}
                                value={this.props.userStore.pinCode[key]}
                                name="pinCode"
                                inputmode="numeric"
                            />
                        ))}
                    </div>
                </InputField>
                <FormLink>
                    <Link to="/main">
                        {content.signIn.form.viewWithoutLogin}
                    </Link>
                    <Link to="/register">{content.signIn.form.register}</Link>
                    <Link to="/reset-pin">
                        {content.signIn.form.forgotPassword}
                    </Link>
                </FormLink>
            </Form>
        );
    }
}

export default connect('i18nStore', 'userStore')(LoginForm);
