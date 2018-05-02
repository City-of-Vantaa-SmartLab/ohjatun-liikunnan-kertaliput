import React from 'react';
import styled, { keyframes } from 'react-emotion';

const shake = keyframes`
    10%, 90% {
      transform: translate3d(-1px, 0, 0);
    }
    
    20%, 80% {
      transform: translate3d(2px, 0, 0);
    }
  
    30%, 50%, 70% {
      transform: translate3d(-4px, 0, 0);
    }
  
    40%, 60% {
      transform: translate3d(4px, 0, 0);
    }
`;

export const Form = styled('form')`
    width: 100%;
`;

export const InputField = styled('div')`
    margin: 2rem;
    * {
        outline: none;
        border: none;
    }
    label {
        display: block;
        margin-bottom: 1rem;
        font-size: 2.3rem;
        color: white;
        font-weight: 700;
        transition: all 0.5s ease;
    }
    div {
        display: flex;
        justify-content: space-between;
    }
    ${(props) =>
        props.error &&
        `
        input {
            animation: ${shake} 1s ease 1;
            background-color: rgba(255, 82, 82, .9) !important;
        }
        label {
            color: rgba(255, 82, 82, .9);
        }
    `};
`;

export const Input = styled('input')`
    width: 100%;
    height: 6rem;
    background-color: white;
    border-radius: 0.5rem;
    color: rgba(0, 0, 0, 0.8);
    padding: 2rem;
    font-size: 2rem;
    border: 2px transparent solid;
    transition: all 0.5s ease;

    &:focus {
        background-color: ${(props) => props.theme.complementary};
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        transform: scale(1.05) translateY(-4px);
    }
`;

export const FormLink = styled('div')`
    display: flex;
    flex-direction: column;
    margin: 2rem;
    margin-top: 4rem;

    a {
        color: rgba(255, 255, 255, 1);
        font-weight: bold;
        font-size: 2.3rem;
        text-decoration: none;
        transition: all 0.5s ease;

        &:hover {
            color: ${(props) => props.theme.complementary};
        }
    }
`;
