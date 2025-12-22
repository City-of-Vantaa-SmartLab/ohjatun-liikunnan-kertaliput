import React from 'react';
import styled from '@emotion/styled';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '../../common/CloseIcon';

const Wrapper = styled(motion.div)`
    position: absolute;
    width: 100%;
    min-width: 100%;
    height: 100%;
    z-index: 10000;
    top: 0;
    left: 0;
    display: flex;
    background-color: rgba(0, 0, 0, 0.7);
    transition: all 1s ease;
    @media only screen and (min-width: 600px) {
        border-radius: 2rem;
    }
    ${(props) =>
        !props.block && 'pointer-events: none; background-color: transparent'};
`;

const ModalWrapper = styled(motion.div)`
    width: 80%;
    height: 70%;
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
    @media only screen and (max-height: 580px) {
        height: auto;
    }

    & > span {
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

export const Content = styled('div')`
    margin: 0 0 2rem 0;
`;
export const Title = styled('h4')`
    margin: 0 0 2rem 0;
    font-size: 3rem;
`;

export default class Modal extends React.Component {
    render() {
        return createPortal(
            <AnimatePresence>
                {this.props.show && (
                    <Wrapper
                        block={this.props.show}
                        initial={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
                        animate={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                        exit={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
                        transition={{ duration: 0.3 }}
                    >
                        <ModalWrapper
                            key="modal"
                            className={this.props.className}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {!this.props.hideCloseButton && (
                                <span onClick={this.props.onClear}>
                                    <CloseIcon />
                                </span>
                            )}
                            {this.props.children}
                        </ModalWrapper>
                    </Wrapper>
                )}
            </AnimatePresence>,
            document.querySelector('body')
        );
    }
}
