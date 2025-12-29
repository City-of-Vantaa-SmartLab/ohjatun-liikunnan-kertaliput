import React from 'react';
import styled from '@emotion/styled';

const Wrapper = styled('div')`
    width: 100%;
`;

const CutAndShadow = styled('div')`
    filter: drop-shadow(0px 10px 12px rgba(0, 0, 0, 0.3));
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: transparent;

    & > div {
        width: 100%;
        min-height: 100%;
        clip-path: polygon(
            0% 0%,
            0% calc(100% - 10px),
            100% calc(100% - 20px),
            100% 0%
        );
    }
`;
const HeaderBody = styled('div')`
    background-image: linear-gradient(-60deg, #0542a3, #86cbf6);
`;

const ContentField = styled('div')`
    z-index: 100;
    position: relative;
    padding: 3rem;
    min-height: 250px;
`;

const main = ({ children, style, ...rest }) => (
    <Wrapper
        style={{
            position: 'relative',
            ...style,
        }}
        {...rest}
    >
        <ContentField>{children}</ContentField>

        <CutAndShadow style={{ zIndex: 5 }}>
            <HeaderBody />
        </CutAndShadow>
        <CutAndShadow
            style={{
                transform: 'translateY(2rem)',
                zIndex: 4,
            }}
        >
            <div
                style={{
                    backgroundColor: '#86cbf6',
                }}
            />
        </CutAndShadow>
        <CutAndShadow
            style={{
                zIndex: 3,
                transform: 'translateY(4rem)',
            }}
        >
            <div
                style={{
                    backgroundColor: '#3f8edb',
                }}
            />
        </CutAndShadow>
    </Wrapper>
);

export default main;
//clip-path: polygon(0% 0%, 0% 90%, 100% 80%, 100% 0%);
//
