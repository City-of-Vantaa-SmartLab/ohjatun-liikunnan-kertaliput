import React from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { connect } from 'utils';

const Wrapper = styled(motion.div)`
    font-size: 2rem;
    padding: 1.5rem;
    position: fixed;
    right: 2rem;
    bottom: 2rem;
    box-shadow: 0px 12px 32px rgba(0, 0, 0, 0.25);
    z-index: 90000;
    background-color: #ffeb3b;
`;

class DevTool extends React.Component {
    render() {
        const show = this.props.courseStore.useMockCourse;
        if (import.meta.env.DEV) {
            return ReactDOM.createPortal(
                <AnimatePresence>
                    {show && (
                        <Wrapper
                            initial={{ x: '150%', opacity: 0 }}
                            animate={{ x: '0%', opacity: 1 }}
                            exit={{ x: '150%', opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <span>You are using mock data</span>
                        </Wrapper>
                    )}
                </AnimatePresence>,
                document.querySelector('body')
            );
        } else return null;
    }
}

export default connect('userStore', 'courseStore')(DevTool);
