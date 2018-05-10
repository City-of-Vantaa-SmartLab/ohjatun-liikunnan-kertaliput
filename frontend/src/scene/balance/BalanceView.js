import React, { Component } from 'react';
import Modal, { Title } from '../../components/modal';

export default class BalanceView extends Component {
    render() {
        return (
            <Modal show={this.props.show} onClear={this.props.onClear}>
                <Title>Your balance</Title>
            </Modal>
        );
    }
}
