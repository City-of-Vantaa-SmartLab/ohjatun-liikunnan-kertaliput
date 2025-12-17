import React from 'react';
import styled from '@emotion/styled';
import Calendar from './Calendar';

const Wrapper = styled('section')`
    background-color: #f5f5f5;
    width: 100%;
`;

export default class FilterGroup extends React.Component {
    render() {
        return (
            <Wrapper>
                <Calendar />
            </Wrapper>
        );
    }
}
