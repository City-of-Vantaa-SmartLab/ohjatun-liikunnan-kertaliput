import React from 'react';
import styled from 'react-emotion';
import Modal, { Content, Title } from '../../components/modal';
const SmallModal = styled(Modal)`
    height: 40%;
    display: flex;
    text-align: center;
    div {
        font-size: 2.5rem;
    }
`;
const CustomTitle = styled(Title)`
    font-weight: 400;

    strong {
        color: ${(props) => props.theme.main};
    }
`;

const Spinner = styled(Content)`
    div,
    div:after {
        border-radius: 50%;
        width: 10em;
        height: 10em;
    }
    div {
        margin: 0rem auto;
        font-size: 1.5rem;
        position: relative;
        padding: 0rem;
        border-top: 1.1em solid #abb2b9;
        border-right: 1.1em solid #abb2b9;
        border-bottom: 1.1em solid #abb2b9;
        border-left: 1.1em solid #ffffff;
        transform: translateZ(0);
        animation: load8 1.1s infinite linear;
    }
    @-webkit-keyframes load8 {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    @keyframes load8 {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

export default class LoadingSpinner extends React.Component {
    render() {
        const { show, text } = this.props;
        return (
            <SmallModal show={show} hideCloseButton>
                <div>
                    <p>{text}</p>
                </div>
                <Spinner>
                    <div />
                </Spinner>
            </SmallModal>
        );
    }
}
