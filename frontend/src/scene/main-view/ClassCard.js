import React from 'react';
import styled from 'react-emotion';
import dateFns from 'date-fns';
import { connect } from 'utils';
import Button from '../../common/Button';
import NotFoundIcon from '../../common/NotFoundIcon';
import posed, { PoseGroup } from 'react-pose';
import { Link } from 'react-router-dom';

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

const ErrorMessageAnimation = posed.h4({
    hidden: {
        scale: 0.3,
        y: 0,
        opacity: 0,
    },
    shown: {
        scale: 1,
        y: -10,
        opacity: 1,
    },
});

const AnimationCoordinator = posed.div({
    enter: {
        delay: 1500,
        staggerChildren: 300,
    },
    exit: {
        staggerChildren: 300,
    },
});

// styled components
const ScrollContainer = styled(AnimationCoordinator)`
    overflow: scroll;
    height: 100%;
`;
const CardWrapper = styled(ItemAnimation)`
    width: 100%;
    background-color: white;
    margin: 1px 0;
    padding: 2rem 0;
    color: rgba(0, 0, 0, 0.86);
    transition: background-color 0.5s ease;
    overflow: hidden;

    & > div {
        transition: filter 0.5s ease, transform 0.5s ease;
        display: flex;
        width: 100%;
        ${(props) =>
            props.blur &&
            `filter: blur(6px); pointer-events: none; transform: scale(1.1);`};
    }
`;

const ErrorMessage = styled(ErrorMessageAnimation)`
    text-align: center;
    font-size: 2.5rem;
    color: ${(props) => props.theme.main};
    opacity: 0;
    position: absolute;
    top: 30%;
    left: 0;
    width: 100%;
    z-index: 10;
    text-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
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
const CourseArea = styled('div')`
    padding-left: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 2rem;

    span:first-child {
        font-size: 2.5rem;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.86);
    }

    span {
        font-size: 2rem;
        display: block;
        margin-bottom: 1.5rem;
    }
    div {
        span {
            display: inline;
            margin-right: 3rem;
            color: ${(props) => props.theme.main};
            text-transform: uppercase;
            font-size: 2.5rem;
        }
        button {
            background-color: ${(props) => props.theme.complementary};
            color: rgba(0, 0, 0, 0.7);
            border: none;
            padding: 2rem;
            font-size: 2rem;
        }
    }
`;

const EmptyStateContainer = styled(AnimationCoordinator)`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: rgba(0, 0, 0, 0.3);
    font-size: 2.5rem;

    svg {
        margin-bottom: 2rem;
        fill: rgba(0, 0, 0, 0.3);
        width: 10rem;
    }
`;

const Card = class extends React.Component {
    state = {
        showMessage: false,
    };
    getErrorReason = (types) => {
        if (!types) return;
        const type = types[0];
        if (type === 'time')
            return 'Course is not open for registration right now';
        if (type === 'resource') return 'Not enough fund';
        if (type === 'auth')
            return <Link to="/login">Login to reserve class</Link>;
    };
    render() {
        const {
            course,
            buttonLabel,
            onButtonClick,
            disabled,
            ...rest
        } = this.props;
        const blurAndShowMessage = disabled && this.state.showMessage;
        return (
            <CardWrapper
                {...rest}
                blur={blurAndShowMessage}
                onMouseEnter={() => this.setState({ showMessage: true })}
                onMouseLeave={() => this.setState({ showMessage: false })}
            >
                <ErrorMessage pose={blurAndShowMessage ? 'shown' : 'hidden'}>
                    {this.getErrorReason(course.reasons)}
                </ErrorMessage>
                <div>
                    <TimeArea>
                        <span>{dateFns.format(course.startDate, 'hh:mm')}</span>
                        <span>{dateFns.format(course.endDate, 'hh:mm')}</span>
                    </TimeArea>
                    <CourseArea>
                        <span>{course.name}</span>
                        <span>{course.location}</span>
                        <div>
                            <span>€ {course.price}</span>
                            <Button onClick={onButtonClick} disabled={disabled}>
                                {buttonLabel}
                            </Button>
                        </div>
                    </CourseArea>
                </div>
            </CardWrapper>
        );
    }
};

class ClassCard extends React.Component {
    selectCourse = (course) => (e) => {
        this.props.courseStore.selectCourse(course);
    };
    render() {
        const courses = this.props.courseStore.getCourses(Date.now());
        const buttonLabel = this.props.i18nStore.content.courseCard.select;
        const noCourseContent = this.props.i18nStore.content.courseCard
            .noCourse;

        return (
            <ScrollContainer pose="enter">
                <PoseGroup animateOnMount preEnterPose="preEnter">
                    {courses.length > 0 ? (
                        courses.map((el, i) => (
                            <Card
                                key={el.id || i}
                                course={el}
                                buttonLabel={buttonLabel}
                                onButtonClick={this.selectCourse(el)}
                                disabled={
                                    !el.isAvailable ||
                                    !this.props.userStore.isAuthenticated
                                }
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
