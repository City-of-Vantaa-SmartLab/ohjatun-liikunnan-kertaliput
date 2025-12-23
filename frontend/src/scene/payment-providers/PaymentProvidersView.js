import React, { Component } from 'react';
import styled from '@emotion/styled';
import Modal, { Title, Content as ModalContent } from '../../components/modal';
import { connect, withRouter } from 'utils';

const Content = styled(ModalContent)`
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    font-size: 8rem;
    font-family: GT-Walsheim, sans-serif;
    color: ${(props) => props.theme.main};
    display: flex;
    flex-direction: column;

    div {
        overflow-y: scroll;
    }

    .provider-button > img {
        width: 130px;
        height: 50px;
    }

    form {
        float: left;
        margin: 5px 10px;
    }
`;

class PaymentProvidersView extends Component {
    render() {
        const i18nContent = this.props.i18nStore.content;
        const { providers } = this.props;

        return (
            <Modal show={this.props.show} onClear={this.props.onClear}>
                <Content>
                    <Title>
                        {i18nContent.paymentConfirmationForm.selectProvider}
                    </Title>
                    <div>
                        {providers && providers.length > 0 ? (
                            providers.map((provider, index) => (
                                <form
                                    key={provider.name || index}
                                    method="POST"
                                    action={provider.url}
                                >
                                    {provider.parameters.map((param, i) => (
                                        <input
                                            key={i}
                                            type="hidden"
                                            name={param.name}
                                            value={param.value}
                                        />
                                    ))}
                                    <button
                                        className="provider-button"
                                        type="submit"
                                        aria-label={provider.name}
                                    >
                                        <img
                                            src={provider.svg}
                                            alt={provider.name}
                                        />
                                    </button>
                                </form>
                            ))
                        ) : (
                            <p style={{ fontSize: '2rem', textAlign: 'center' }}>
                                {i18nContent.paymentConfirmationForm.noProvidersAvailable}
                            </p>
                        )}
                    </div>
                </Content>
            </Modal>
        );
    }
}

export default withRouter(connect('i18nStore')(PaymentProvidersView));
