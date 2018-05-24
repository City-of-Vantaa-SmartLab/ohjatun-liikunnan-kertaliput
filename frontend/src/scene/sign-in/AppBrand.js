import React, { Component } from 'react';
import styled from 'react-emotion';
import { connect } from 'utils';

const Wrapper = styled('div')`
    display: flex;
    align-items: center;
    flex-direction: column;

    div {
        flex: inherit;
        align-items: center;
        text-align: center;
    }
`;
const AppName = styled('h1')`
    font-size: 6.5rem;
    font-weight: bold;
    color: ${(props) => props.theme.complementary};
    margin: 0;
    font-family: 'GT-Walsheim', sans-serif;
`;

class AppBrand extends Component {
    render() {
        return (
            <Wrapper>
                <div>
                    <AppName>
                        {this.props.i18nStore.content.global.appName}
                    </AppName>
                </div>
            </Wrapper>
        );
    }
}

export default connect('i18nStore')(AppBrand);
