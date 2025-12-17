import React from 'react';
import styled from '@emotion/styled';
import Modal, { Content, Title } from '../../components/modal';
import Button from '../../components/button';
import { Link } from 'react-router-dom';

const SmallModal = styled(Modal)`
    height: auto;
`;
const ModalAction = styled('div')`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
        const { i18nContent, show } = this.props;
        return (
            <SmallModal show={show} hideCloseButton>
                <div>
                    <CustomTitle>
                        {i18nContent.resetPinForm.welcome}
                    </CustomTitle>
                    <Content>
                        <p>{i18nContent.resetPinForm.congratulationMessage}</p>
                        <p>{i18nContent.resetPinForm.promptPinCode}</p>
                    </Content>
                    <ModalAction>
                        <Link to="/login">
                            <Button bold>{i18nContent.appHeader.login}</Button>
                        </Link>
                    </ModalAction>
                </div>
            </SmallModal>
        );
    }
}
