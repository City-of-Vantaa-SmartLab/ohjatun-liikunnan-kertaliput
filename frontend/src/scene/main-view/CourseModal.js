import React, { Fragment } from 'react';
import styled from 'react-emotion';
import { connect, getLocale } from 'utils';
import Modal, { Content, Title } from '../../components/modal';
import LocationIcon from '../../common/LocationIcon';
import ClockLogo from '../../common/ClockLogo';
import Button from '../../common/Button';
import dateFns from 'date-fns';

const CourseContent = styled(Content)`
    margin: 2rem 0;
    width: 100%;
    max-height: 70%;
    overflow-y: scroll;
    overflow-x: hidden;

    ul {
        padding: 0;
        margin: 0;
    }
    p {
        margin-left: 1rem;
    }
    li {
        margin: 1rem 0;
        padding-left: 1rem;
        display: flex;
        align-items: center;

        svg {
            fill: ${(props) => props.theme.main};
            width: 2.5rem;
            height: 2.5rem;
            margin-right: 1rem;
            flex-shrink: 0;
        }
    }
`;
const PaymentSection = styled(Content)`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(to top, transparent, white 40%);

    & > div {
        width: 100%;
        border-bottom: 1px rgba(0, 0, 0, 0.2) solid;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
        & > span {
            font-size: 3rem;
            font-weight: bold;
            color: ${(props) => props.theme.main};
        }
        & > div {
            display: flex;
            flex-direction: column;
            margin-bottom: 1rem;

            span {
                text-transform: uppercase;
                font-weight: bold;
            }

            & > span:last-child {
                color: ${(props) => props.theme.green};
            }
        }
    }
    & > button {
        background-color: ${(props) => props.theme.complementary};
        margin: 2rem;
        border: none !important;
        box-shadow: none !important;
        padding: 2rem;

        &: hover {
            background-color: ${(props) => props.theme.complementary};
            color: white;
        }
    }
`;

class CourseModal extends React.Component {
    clear = (e) => {
        this.props.courseStore.selectCourse(null);
    };
    render() {
        const course = this.props.courseStore.courseInFocus;
        return (
            <Modal show={course || false} onClear={this.clear}>
                {course && (
                    <Fragment>
                        <CourseContent>
                            <Title>{course.name}</Title>
                            <ul>
                                <li>
                                    <LocationIcon />
                                    {course.location}
                                </li>
                                <li>
                                    <ClockLogo />
                                    <strong>
                                        {dateFns.format(
                                            course.startDate,
                                            'HH:MM'
                                        )}
                                    </strong>
                                    - {dateFns.format(course.endDate, 'HH:MM')}
                                </li>
                            </ul>
                            <p>{course.description}</p>
                        </CourseContent>
                        <PaymentSection>
                            <div>
                                <div>
                                    <span>
                                        Kesto{' '}
                                        {dateFns.distanceInWords(
                                            course.endDate,
                                            course.startDate,
                                            { locale: getLocale() }
                                        )}
                                    </span>
                                    <span>3 vapaana</span>
                                </div>
                                <span>{course.price}€</span>
                            </div>
                            <Button
                                onClick={() =>
                                    this.props.courseStore.reserveCourse(course)
                                }
                            >
                                Varaa ja Maksa
                            </Button>
                        </PaymentSection>
                    </Fragment>
                )}
            </Modal>
        );
    }
}

export default connect('courseStore')(CourseModal);
