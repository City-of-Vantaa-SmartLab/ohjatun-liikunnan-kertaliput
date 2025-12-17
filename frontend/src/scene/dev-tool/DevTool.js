import React from 'react';
import ReactDOM from 'react-dom';
import posed from 'react-pose';
import styled from '@emotion/styled';
import { connect } from 'utils';

const WrapperBase = posed.div({
    enter: {
        x: 0,
        opacity: 1,
    },
    exit: {
        x: 300,
        opacity: 0,
    },
});

const Wrapper = styled(WrapperBase)`
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
        if (process.env.NODE_ENV === 'development') {
            return ReactDOM.createPortal(
                <Wrapper pose={show ? 'enter' : 'exit'}>
                    <span>You are using mock data</span>
                </Wrapper>,
                document.querySelector('body')
            );
        } else return null;
    }
}

export default connect('userStore', 'courseStore')(DevTool);
