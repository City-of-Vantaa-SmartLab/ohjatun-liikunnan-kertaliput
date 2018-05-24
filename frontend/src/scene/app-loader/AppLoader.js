import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import posed, { PoseGroup } from 'react-pose';
import styled, { injectGlobal } from 'react-emotion';
import { tween, chain, delay } from 'popmotion';

const CoordinatorBase = posed.div({
    enter: {
        delayChildren: 500,
        staggerChildren: 300,
        opacity: 1,
    },
    exit: {
        opacity: 0,
    },
});
const AnimatablePath = posed.path({
    enter: {
        strokeDashoffset: 0,
        fillOpacity: 1,
        transition: (props) => {
            if (props.key === 'strokeDashoffset')
                return tween({ ...props, duration: 1500 });
            else return chain(delay(500), tween({ ...props, duration: 800 }));
        },
    },
    preEnter: {
        fillOpacity: 0,
        strokeDashoffset: 1000,
    },
});

const Wrapper = styled(CoordinatorBase)`
    will-change: transform, opacity;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => props.theme.main};
    position: absolute;
    z-index: 1000;
    left: 0;
    top: 0;

    @media only screen and (min-width: 600px) {
        border-radius: 2rem;
    }

    svg {
        stroke-dasharray: 1000;
        stroke-opacity: 1;
        stroke-width: 3;
        flex-basis: 80%;
        fill: ${(props) => props.theme.complementary};
        stroke: ${(props) => props.theme.complementary};
    }
`;
class AppLoader extends Component {
    state = {
        show: true,
    };
    componentDidMount() {
        window.setTimeout(() => this.setState({ show: false }), 1500);
    }
    componentDidUpdate() {
        if (!this.state.show)
            injectGlobal`
            body {
                background: inherit;
            }
        `;
    }
    render() {
        return createPortal(
            <PoseGroup>
                {this.state.show && (
                    <Wrapper key="main" {...this.props}>
                        <svg viewBox="0 0 740.09 285.98">
                            <PoseGroup animateOnMount preEnterPose="preEnter">
                                <AnimatablePath
                                    key="1"
                                    id="1"
                                    d="M63.37 73v32.36H0V0h38.38v73zM75.41 0h38.38v105.36H75.41zM130.35 0h38.38v105.36h-38.38zM223.67 64.12v41.24h-38.39V0h38.39v41.39L247.75 0h44.4l-35.82 52.68 35.82 52.68h-44.4zM338.36 64.12v41.24H300V0h38.38v41.39L362.44 0h44.4L371 52.68l35.82 52.68h-44.4zM411.21 0h38.38v67.58a8.73 8.73 0 0 0 17.46 0V0h38.38v68c0 24.08-17.46 40.34-47.11 40.34S411.21 92.11 411.21 68zM590.93 105.36h-43L507.84 0h41.7l19.86 69.84L589.12 0h43.2zM696.89 105.36l-3.16-11.59h-33.26l-3.16 11.59h-41.69L655.65 0h43.05l41.39 105.36zM677.17 33l-9.48 34.47h18.82zM106.94 286h-43l-40-105.36h41.61l19.87 69.84 19.71-69.84h43.2zM212.91 286l-3.16-11.59h-33.27L173.32 286h-41.69l40-105.36h43L256.1 286zm-19.72-72.4l-9.48 34.47h18.81zM334.22 236.76v-56.14h38.38V286h-38.38l-30.7-53.13V286h-38.38V180.62h38.38zM404.06 213h-19.41v-32.38h77.21V213h-19.42v73h-38.38zM536.37 286l-3.16-11.59h-33.27L496.78 286h-41.69l40-105.36h43L579.56 286zm-19.72-72.4l-9.48 34.47H526zM662.35 286l-3.16-11.59h-33.27L622.76 286h-41.69l40-105.36h43L705.55 286zm-19.72-72.4l-9.48 34.47H652z"
                                />
                            </PoseGroup>
                        </svg>
                    </Wrapper>
                )}
            </PoseGroup>,
            document.querySelector('#root')
        );
    }
}

export default AppLoader;
