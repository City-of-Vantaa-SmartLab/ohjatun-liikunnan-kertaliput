import React from 'react';
import styled from 'react-emotion';
import Modal, { Content, Title } from '../../components/modal';
import Button from '../../components/button';
import { Link } from 'react-router-dom';
import stringInterpolator from 'interpolate';

const SmallModal = styled(Modal)`
    height: 40%;
    display: flex;
`;

const ModalAction = styled('div')`
    align-self: center;
    margin-bottom: 5rem;
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
                            {stringInterpolator(
                                i18nContent.registrationForm
                                    .congratulationMessage,
                                {
                                    phoneNumber,
                                }
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
