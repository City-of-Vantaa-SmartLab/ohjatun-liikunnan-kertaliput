import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/button';
import { connect } from 'utils';

const BannerWrapper = styled(motion.div)`
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 2rem;
    background-color: white;
    box-shadow: 0 -6px 12px rgba(0, 0, 0, 0.3);
    justify-content: space-between;
    @media only screen and (min-width: 600px) {
        border-radius: 0 0 2rem 2rem;
    }

    button {
        padding: auto;
    }
    div {
        display: inherit;
        align-items: center;

        span {
            font-size: 2rem;
            margin-right: 2rem;
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
            <AnimatePresence>
                {this.state.show && (
                    <BannerWrapper
                        key="cookie-banner"
                        initial={{ y: '200%', opacity: 0 }}
                        animate={{ y: '0%', opacity: 1 }}
                        exit={{ y: '200%', opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div>
                            <span>{i18nContent.cookieBanner.message}</span>
                        </div>
                        <Button bold onClick={this.agree}>
                            {i18nContent.cookieBanner.buttonLabel}
                        </Button>
                    </BannerWrapper>
                )}
            </AnimatePresence>,
            document.querySelector('body')
        );
    }
}

export default connect('i18nStore')(CookieBanner);
