import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import styled from 'react-emotion';
import posed, { PoseGroup } from 'react-pose';
import Button from '../../components/button';
import { connect } from 'utils';

const ItemAnimation = posed.div({
    enter: {
        y: '0%',
        opacity: 1,
    },
    exit: {
        y: '200%',
        opacity: 0,
    },
    preEnter: {
        opacity: 0,
        y: '200%',
    },
});

const BannerWrapper = styled(ItemAnimation)`
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 2rem;
    background-color: white;
    box-shadow: 0 -6px 12px rgba(0, 0, 0, 0.3);
    justify-content: space-between;
    button {
        padding: auto;
    }
    div {
        display: inherit;
        align-items: center;

        img {
            margin-right: 2rem;
            width: 4rem;
        }
        span {
            font-size: 2rem;
        }
    }
`;

class CookieBanner extends Component {
    state = {
        show: false,
    };
    componentDidMount() {
        const okay = window.localStorage.getItem('cookieSetBannerFlag');
        if (okay === null) {
            window.setTimeout(() => this.setState({ show: true }), 3000);
        } else this.setState({ show: !okay });
    }
    agree = (e) => {
        window.localStorage.setItem('cookieSetBannerFlag', 'true');
        this.setState({ show: false });
    };
    render() {
        const i18nContent = this.props.i18nStore.content;
        return createPortal(
            <PoseGroup animateOnMount preEnterPose="preEnter">
                {this.state.show && (
                    <BannerWrapper key="1">
                        <div>
                            <span>{i18nContent.cookieBanner.message}</span>
                        </div>
                        <Button bold onClick={this.agree}>
                            {i18nContent.cookieBanner.buttonLabel}
                        </Button>
                    </BannerWrapper>
                )}
            </PoseGroup>,
            document.querySelector('body')
        );
    }
}

export default connect('i18nStore')(CookieBanner);
