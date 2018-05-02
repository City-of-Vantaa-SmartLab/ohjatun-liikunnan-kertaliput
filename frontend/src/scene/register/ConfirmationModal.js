import React from 'react';
import styled from 'react-emotion';
import Modal, { Content, Title } from '../../components/modal';
import Button from '../../components/button';
import { Link } from 'react-router-dom';

const SmallModal = styled(Modal)`
    height: 40%;
    display: flex;
`;

const ModalAction = styled('div')`
    align-self: flex-end;
`;

export default class ConfirmationModal extends React.Component {
    render() {
        return (
            <SmallModal show={this.props.show} hideCloseButton>
                <div>
                    <Title>
                        Welcome, <strong>{this.props.username}</strong>
                    </Title>
                    <Content>
                        <p>
                            Congratualtions, you have made an account. A PIN
                            code has been sent to the phone number you gave us
                        </p>
                        <p>
                            Enter the four digit PIN code you received to login!
                        </p>
                    </Content>
                </div>
                <ModalAction>
                    <Link to="/login">
                        <Button bold>Sign In</Button>
                    </Link>
                </ModalAction>
            </SmallModal>
        );
    }
}
