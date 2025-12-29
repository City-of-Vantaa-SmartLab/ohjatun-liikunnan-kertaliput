import React from 'react';
import styled from '@emotion/styled';

const ButtonStyled = styled('button')`
    background-color: transparent;
    border-radius: 1.5rem;
    border: 1px solid;
    border-color: ${(props) =>
        props.alternative
            ? props.theme.complementary
            : props.color || props.theme.main};
    padding: 1.5rem 2rem;
    color: ${(props) =>
        props.alternative
            ? props.theme.complementary
            : props.color || props.theme.main};
    font-size: 2rem;
    line-height: 1rem;
    display: inline-block;
    font-family: Calibri, sans-serif !important;
    letter-spacing: 1px;
    outline: none;
    font-weight: bold;
    text-transform: uppercase;
    cursor: pointer;
    transition: box-shadow 0.5s ease, background-color 0.5s ease,
        border-color 0.5s ease, color 0.7s ease, filter 0.7s ease,
        opacity 0.7s ease;

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
        background-color: ${
            props.alternative
                ? props.theme.complementary
                : props.color || props.theme.main
        };
        color: ${
            props.alternative ? 'rgba(0,0,0, .86)' : 'rgba(255,255,255, .86)'
        };
    `};

    &:hover {
        background-color: ${(props) =>
            props.alternative
                ? props.theme.complementary
                : props.color || props.theme.main};
        color: ${(props) =>
            !props.hoveredTextColor
                ? props.alternative
                    ? 'rgba(0,0,0, .86)'
                    : 'rgba(255,255,255, .86)'
                : props.hoveredTextColor};
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
            color,
            alternative,
            hoveredTextColor,
        } = this.props;
        return (
            <ButtonStyled
                alternative={alternative}
                bold={bold}
                color={color}
                hoveredTextColor={hoveredTextColor}
                className={className}
                style={style}
                pose={pose}
                disabled={disabled}
                onClick={disabled ? () => {} : onClick}
            >
                {children}
            </ButtonStyled>
        );
    }
}

export default Button;
