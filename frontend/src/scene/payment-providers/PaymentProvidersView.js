import React, { Component } from 'react';
import styled from 'react-emotion';
import Modal, { Title, Content as ModalContent } from '../../components/modal';
import { connect } from 'utils';
import { withRouter } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';

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
        const createPaymentProvidersList = (providers) => {
            try {
                return providers
                    .map(
                        (p) =>
                            `<form method='POST' action=${p.url}>
                         ${p.parameters
                             .map(
                                 (param) =>
                                     `<input type='hidden' name='${param.name}' value='${param.value}' />`
                             )
                             .join('\n')}
                         <button class='provider-button' type='submit' aria-label='${
                             p.name
                         }'><img src='${p.svg}' /></button>
                     </form>`
                    )
                    .join('\n');
            } catch (e) {
                console.error(e);
            }
        };

        return (
            <Modal show={this.props.show} onClear={this.props.onClear}>
                <Content>
                    <Title>
                        {i18nContent.paymentConfirmationForm.selectProvider}
                    </Title>
                    <div>
                        {!!this.props.providers &&
                            ReactHtmlParser(
                                createPaymentProvidersList(this.props.providers)
                            )}
                    </div>
                </Content>
            </Modal>
        );
    }
}

export default withRouter(connect('i18nStore')(PaymentProvidersView));
