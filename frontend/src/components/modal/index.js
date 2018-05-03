import React from 'react';
import styled, { css } from 'react-emotion';
import posed, { PoseGroup } from 'react-pose';
import { createPortal } from 'react-dom';
import CloseIcon from '../../common/CloseIcon';

// @TODO: clean the css mess of this file

// this class will be added to "root" element
// when the modal is open
// to simulate blur effect
const rootBlurred = css`
    filter: blur(8px);
`;
const ModalAnimatable = posed.div({
    enter: {
        scale: 1,
        opacity: 1,
        delayChildren: 100,
        staggerChildren: 100,
        y: '0%',
    },
    exit: {
        y: '30%',
        scale: 0,
        opacity: 0,
        delay: 300,
        staggerChildren: 100,
    },
});
const CloseButton = posed.span({
    enter: {
        y: 0,
        scale: 1,
    },
    exit: {
        y: -20,
        scale: 0,
    },
});
const Wrapper = styled('div')`
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10000;
    top: 0;
    left: 0;
    display: flex;
    background-color: rgba(0, 0, 0, 0.7);
    transition: all 1s ease;
    ${(props) =>
        !props.block && 'pointer-events: none; background-color: transparent'};
`;

const ModalWrapper = styled(ModalAnimatable)`
    height: 70%;
    width: 80%;
    margin: auto;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    background-color: white;
    position: relative;
    padding: 2rem;
    font-size: 2rem;
    color: rgba(0, 0, 0, 0.86);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    & > span {
        transform: scale(0);
        position: fixed;
        right: 1rem;
        top: 1rem;
        padding: 1rem;
        border-radius: 4px;
        transition: background-color 0.5s ease;

        &:hover {
            svg {
                fill: white;
            }
            background-color: #ef5350;
        }

        svg {
            width: 2rem;
            fill: red;
            transition: fill 0.5s ease;
        }
    }
`;

const ModalContentAnimatable = posed.div({
    enter: {
        y: 0,
        opacity: 1,
    },
    exit: {
        y: 20,
        opacity: 0,
    },
});

export const Content = styled(ModalContentAnimatable)`
    margin: 2rem 0;
`;
export const Title = styled('h4')`
    margin: 0 0 2rem 0;
    font-size: 3rem;
`;

class Blur extends React.Component {
    componentDidMount() {
        // apply blur effect to root
        window.setTimeout(() => {
            const root = document.querySelector('#root');
            root.className = rootBlurred;
        }, 100);
    }
    render() {
        return null;
    }
    // remove the blur effect to root
    componentWillUnmount() {
        document.querySelector('#root').className = '';
    }
}

export default class Modal extends React.Component {
    render() {
        return createPortal(
            <Wrapper block={this.props.show}>
                <PoseGroup animateOnMount>
                    {this.props.show && (
                        <ModalWrapper
                            key="modal"
                            className={this.props.className}
                        >
                            {!this.props.hideCloseButton && (
                                <CloseButton onClick={this.props.onClear}>
                                    <CloseIcon />
                                </CloseButton>
                            )}
                            {this.props.children}
                            <Blur />
                        </ModalWrapper>
                    )}
                </PoseGroup>
            </Wrapper>,
            document.querySelector('body')
        );
    }
}
