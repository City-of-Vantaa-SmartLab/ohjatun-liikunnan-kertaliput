import React from 'react';
import styled from 'react-emotion';

const ButtonStyled = styled('button')`
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
    transition: all 0.5s ease;
    cursor: pointer;

    ${(props) =>
        props.disabled &&
        `
        filter: grayscale(100%);
        opacity: 0.5;
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
        box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.5);
    }
`;

class Button extends React.Component {
    render() {
        const { onClick, disabled, ...rest } = this.props;
        return (
            <ButtonStyled
                {...rest}
                disabled={disabled}
                onClick={disabled ? () => {} : onClick}
            />
        );
    }
}

export default Button;
