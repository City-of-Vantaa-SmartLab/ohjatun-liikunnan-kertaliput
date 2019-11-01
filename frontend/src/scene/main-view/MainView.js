import React from 'react';
import styled from 'react-emotion';
import FilterGroup from './FilterGroup';
import ClassCard from './ClassCard';
import AppHeader from './AppHeader';
import CourseModal from './CourseModal';
import PaymentView from '../payment';
import PendingPayment from './PendingPayment'
import { connect } from 'utils';

const Wrapper = styled('div')`
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
`;
class MainView extends React.Component {
    render() {
        return (
            <Wrapper>
                <AppHeader />
                <FilterGroup />
                <ClassCard />
                <CourseModal />
                <PendingPayment />
                <PaymentView />
            </Wrapper>
        );
    }
}

export default connect('i18nStore', 'userStore')(MainView);
