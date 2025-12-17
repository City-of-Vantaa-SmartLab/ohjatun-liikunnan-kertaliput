import React from 'react';
import styled from '@emotion/styled';
import Modal, { Content, Title } from '../../components/modal';
import Button from '../../components/button';
import { Link } from 'react-router-dom';

const SmallModal = styled(Modal)`
    height: auto;
`;
const ModalAction = styled('div')`
    align-self: flex-end;
    margin-top: 3rem;
`;
const CustomTitle = styled(Title)`
    font-weight: 400;

    strong {
        color: ${(props) => props.theme.main};
    }
`;

export default class ConfirmationModal extends React.Component {
    render() {
        const { i18nContent, username, phoneNumber, show } = this.props;
        return (
            <SmallModal show={show} hideCloseButton>
                <div>
                    <CustomTitle>
                        {i18nContent.registrationForm.welcome}{' '}
                        <strong>{username}</strong>
                    </CustomTitle>
                    <Content>
                        <p>
                            {i18nContent.registrationForm.congratulationMessage.replace(
                                '{phoneNumber}',
                                phoneNumber
                            )}
                        </p>
                        <p>{i18nContent.registrationForm.promptPinCode}</p>
                    </Content>
                </div>
                <ModalAction>
                    <Link to="/login">
                        <Button bold>{i18nContent.appHeader.login}</Button>
                    </Link>
                </ModalAction>
            </SmallModal>
        );
    }
}
