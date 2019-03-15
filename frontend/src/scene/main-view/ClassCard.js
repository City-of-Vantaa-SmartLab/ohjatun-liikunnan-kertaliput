import React from 'react';
import styled from 'react-emotion';
import dateFns from 'date-fns';
import { connect } from 'utils';
import Button from '../../components/button';
import NotFoundIcon from '../../common/NotFoundIcon';
import posed, { PoseGroup } from 'react-pose';
import { Link } from 'react-router-dom';
import stringInterpolator from 'interpolate';
import { getErrorDetail } from './CourseUtil';
// posed components
const ItemAnimation = posed.div({
    enter: {
        y: '0%',
        opacity: 1,
    },
    exit: {
        y: '100%',
        opacity: 0,
    },
    preEnter: {
        opacity: 0,
        y: '-100%',
    },
});

export const ErrorMessageAnimation = posed.h4({
    hidden: {
        y: -10,
        x: 50,
        opacity: 0,
    },
    shown: {
        y: -10,
        x: 0,
        opacity: 1,
    },
});
const EmptyStateContainerAnimation = posed.div({
    enter: {
        scale: 1,
        opacity: 1,
    },
    exit: {
        scale: 0.3,
        opacity: 0,
    },
    preEnter: {
        scale: 0,
        y: '-5%',
    },
});

// styled components
const ScrollContainer = styled('div')`
    overflow: scroll;
    flex-basis: 100%;
`;
const CardWrapper = styled(ItemAnimation)`
    width: 100%;
    background-color: ${(props) =>
        props.blur ? props.theme[props.errorColorCode] : 'white'};;
    margin-top: 1px;
    padding: 1.5rem 0;
    color: rgba(0, 0, 0, 0.86);
    transition: background-color 0.7s ease, border 0.5s ease;
    overflow: hidden;
    ${(props) =>
        props.errorColorCode &&
        `border-left: ${props.blur ? 0 : 5}px ${
            props.theme[props.errorColorCode]
        } solid`}
    }
    & > div {
        will-change: transform;
        transition: transform 0.5s ease;
        display: flex;
        width: 100%;
        ${(props) =>
            props.blur &&
            `filter: blur(4px); pointer-events: none; transform: scale(1.2);`};
    }
`;

const ErrorMessage = styled(ErrorMessageAnimation)`
    text-align: center;
    font-size: 2.5rem;
    color: white;
    opacity: 0;
    position: absolute;
    top: 30%;
    left: 0;
    width: 100%;
    z-index: 10;
    * {
        color: inherit !important;
    }
`;

const TimeArea = styled('div')`
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 2rem;

    * {
        margin-bottom: 1rem;
    }

    & > span:first-child {
        font-weight: bold;
    }
`;
// @TODO: Styling is quite bad with specificity issue
const CourseArea = styled('div')`
    padding-left: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;

    strong {
        font-size: 2.5rem;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.86);
        margin-bottom: 1rem;
    }

    > span {
        font-size: 2rem;
        margin-bottom: 1.5rem;
    }
    div {
        display: flex;
        align-items: center;
    }
`;
const BookingButton = styled(Button)`
    color: rgba(0, 0, 0, 0.7);
    &:hover {
        color: rgba(0, 0, 0, 0.7);
    }
`;
const PriceTag = styled('span')`
    display: inline-block;
    width: 10rem;
    color: ${(props) => props.theme.main};
    text-transform: uppercase;
    font-size: 2.5rem;
    font-weight: bold;
`;

const EmptyStateContainer = styled(EmptyStateContainerAnimation)`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: rgba(0, 0, 0, 0.3);
    font-size: 2rem;

    svg {
        margin-bottom: 2rem;
        fill: rgba(0, 0, 0, 0.3);
        width: 10rem;
    }
`;

const ErrorMessageTag = styled(ErrorMessageAnimation)`
    color: ${(props) => props.theme[props.color]};
    font-size: 2.3rem;
    font-weight: bold;
    margin: 0;
`;

const Card = class extends React.Component {
    state = {
        showMessage: false,
    };
    render() {
        const {
            course,
            buttonLabel,
            onButtonClick,
            disabled,
            errorMessages,
            ...rest
        } = this.props;
        const blurAndShowMessage = disabled && this.state.showMessage;
        const errorDetail =
            getErrorDetail(course, this.props.errorMessages) || {};

        // noinspection JSAnnotator
        return (
            <CardWrapper {...rest} errorColorCode={errorDetail.colorCode || ''}>
                <div>
                    <TimeArea>
                        <span>{dateFns.format(course.startDate, 'HH.mm')}</span>
                        <span>{dateFns.format(course.endDate, 'HH.mm')}</span>
                    </TimeArea>
                    <CourseArea>
                        <strong>{course.name}</strong>
                        <span>{course.location}</span>
                        <div>
                            {errorDetail.type !== 'reserved' && (
                                <PriceTag>
                                    {Number(course.price)
                                        .toFixed(2)
                                        .toString()
                                        .replace('.', ',') + ' €'}
                                </PriceTag>
                            )}
                            {errorDetail.type !== 'reserved' ? (
                                <BookingButton
                                    key="2"
                                    onClick={onButtonClick}
                                    bold
                                    alternative
                                >
                                    {buttonLabel}
                                </BookingButton>
                            ) : null}
                        </div>
                        <div>
                            {errorDetail !== null &&
                                disabled && (
                                    <div>
                                        <ErrorMessageTag
                                            key="3"
                                            color={errorDetail.colorCode}
                                        >
                                            {errorDetail.shortMessage}
                                        </ErrorMessageTag>
                                    </div>
                                )}
                        </div>
                    </CourseArea>
                </div>
            </CardWrapper>
        );
    }
    componentWillUnmount() {
        window.clearTimeout(this.longMessageTick);
    }
};

class ClassCard extends React.Component {
    selectCourse = (course) => (e) => {
        this.props.courseStore.selectCourse(course);
    };
    // WAITING FOR DECISION FROM CLIENT TO HAVE SORTING OR NOT
    // SORT BY TIME ONLY FOR NOW
    sortCourseByPurchasedStatusAndTime = (courses) => {
        //     // sorters
        //     const sortByReserved = (A, B) => {
        //         // we want user to see all of their reservation first
        //         const checkReservedStatus = (item) =>
        //             item.reasons && item.reasons[0] === 'reserved';
        //         const isABdifferent =
        //             checkReservedStatus(A) !== checkReservedStatus(B);
        //         if (!isABdifferent) {
        //             return 0;
        //         }
        //         if (checkReservedStatus(A) && !checkReservedStatus(B)) return 1;
        //         return -1;
        //     };
        //     const sortByAvailability = (A, B) => {
        //         // items that is available comes first
        //         if (A.isAvailable === B.isAvailable) return 0;
        //         if (A.isAvailable && !B.isAvailable) return 1;
        //         return -1;
        //     };
        const sortByDateTime = (A, B) => {
            // should be listed in a chronological order
            return dateFns.compareAsc(A.startDate, B.startDate);
        };
        const sortCombiner = (...sorterFuncs) => (A, B) =>
            sorterFuncs.reduce((accumulator, currentFunc) => {
                // first sorter takes precedence.
                if (accumulator === 0 && currentFunc(A, B) !== 0) {
                    accumulator = currentFunc(A, B);
                }
                return accumulator;
            }, 0);

        return courses.sort(
            sortCombiner(/*sortByReserved, sortByAvailability,*/ sortByDateTime)
        );
    };

    render() {
        // const courses = this.sortCourseByPurchasedStatusAndTime(
        //     this.props.courseStore.getCourses(Date.now())
        // );
        const courses = this.props.courseStore.getCourses(Date.now());
        const buttonLabel = this.props.i18nStore.content.courseCard.select;
        const errorMessages = this.props.i18nStore.content.courseCard
            .errorMessages;
        const noCourseContent = this.props.i18nStore.content.courseCard
            .noCourse;

        return (
            <ScrollContainer>
                <PoseGroup preEnterPose="preEnter">
                    {courses.length > 0 ? (
                        courses.map((el, i) => (
                            <Card
                                key={el.id || i}
                                id={i}
                                course={el}
                                buttonLabel={buttonLabel}
                                onButtonClick={this.selectCourse(el)}
                                errorMessages={errorMessages}
                                disabled={!el.isAvailable}
                            />
                        ))
                    ) : (
                        <EmptyStateContainer key={'emptyState'}>
                            <NotFoundIcon />
                            <ItemAnimation>{noCourseContent}</ItemAnimation>
                        </EmptyStateContainer>
                    )}
                </PoseGroup>
            </ScrollContainer>
        );
    }
}

export default connect('courseStore', 'i18nStore', 'userStore')(ClassCard);
