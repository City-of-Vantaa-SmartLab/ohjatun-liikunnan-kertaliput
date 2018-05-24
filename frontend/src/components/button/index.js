import React from 'react';
import styled from 'react-emotion';
import posed from 'react-pose';

const BaseAnimationButton = posed.button({
    preEnter: {
        opacity: 0,
        scale: 0,
    },
    enter: {
        opacity: 1,
        scale: 1,
    },
    exit: {
        opacity: 0,
        scale: 0,
    },
});

const ButtonStyled = styled(BaseAnimationButton)`
    background-color: rgba(255, 255, 255, 0.13);
    border-radius: 8px;
    border: 1px solid;
    border-color: rgba(255, 255, 255, 0.8);
    padding: 1.5rem;
    color: white;
    font-size: 2rem;
    line-height: 0.5rem;
    display: inline-block;
    font-family: Calibri, sans-serif !important;
    letter-spacing: 0.5px;
    outline: none;
    font-weight: bold;
    cursor: pointer;
    transition: box-shadow 0.5s ease, background-color 0.5s ease,
        border-color 0.5s ease, color 0.7s ease;

    ${(props) =>
        props.disabled &&
        `
        filter: grayscale(100%);
        opacity: 0.5 !important;
        pointer-events: none;
    `};
    ${(props) =>
        props.bold &&
        `
        border-color: ${props.theme.main};
        color: ${props.theme.main};
    `};

    &:hover {
        color: ${(props) => props.theme.main};
        border-color: ${(props) => props.theme.main};
        background-color: white;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.3);
    }
`;

class Button extends React.Component {
    render() {
        const {
            onClick,
            disabled,
            className,
            style,
            pose,
            children,
            bold,
        } = this.props;
        return (
            <ButtonStyled
                bold={bold}
                className={className}
                style={style}
                pose={pose}
                disabled={disabled}
                onClick={disabled ? () => {} : onClick}
                onTouchStart={disabled ? () => {} : onClick}
            >
                {children}
            </ButtonStyled>
        );
    }
}

export default Button;
