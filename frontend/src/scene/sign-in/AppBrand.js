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
    font-size: 6rem;
    font-weight: bold;
    color: ${(props) => props.theme.complementary};
    margin: 0;
    font-family: 'GT-Walsheim', serif;
`;

const AppHeadLine = styled('span')`
    font-size: 3rem;
    color: white;
    font-weight: bold;
`;

class AppBrand extends Component {
    render() {
        return (
            <Wrapper>
                <div>
                    <AppName>
                        {this.props.i18nStore.content.global.appName}
                    </AppName>
                    <AppHeadLine>
                        {this.props.i18nStore.content.global.appHeadLine}
                    </AppHeadLine>
                </div>
            </Wrapper>
        );
    }
}

export default connect('i18nStore')(AppBrand);
