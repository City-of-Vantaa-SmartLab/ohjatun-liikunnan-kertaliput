import React, { Fragment } from 'react';
import styled from 'react-emotion';
import { connect, getLocale } from 'utils';
import Modal, { Content, Title } from '../../components/modal';
import LocationIcon from '../../common/LocationIcon';
import DateLogo from '../../common/DateLogo';
import ClockLogo from '../../common/ClockLogo';
import EuroLogo from '../../common/EuroLogo';
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
const BottomSection = styled(Content)`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

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
        color: rgba(0, 0, 0, 0.7);
        margin-top: 2rem;
        margin-left: 1rem;
        margin-right: 1rem;
        border: none !important;
        box-shadow: none !important;
        padding: 2rem;

        &: hover {
            background-color: ${(props) => props.theme.complementary};
            color: rgba(0, 0, 0, 0.7);
        }
    }
`;

const ReservationContent = styled(Content)`
    height: 100%;
    display: flex;
    justify-content: baseline;
    align-items: center;
    flex-direction: column;
    margin-top: 10rem;

    strong {
        position: relative;
        padding-top: 4rem;
    }

    span {
        padding-top: 2rem;
        font-size: 6rem;
        font-family: GT-Walsheim, sans-serif;
        color: ${(props) => props.theme.main};
    }

    div {
        padding-top: 4rem;
        font-size: 2rem;
        text-align: center;
    }
`;

const MainModal = ({ course, seletectedDate, onConfirm, clear }) => (
    <Modal show={course} onClear={clear}>
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
                            <DateLogo />
                            <strong>
                                {dateFns.format(seletectedDate, 'DD.MM.YYYY')}
                            </strong>
                        </li>
                        <li>
                            <ClockLogo />
                            <strong>
                                {dateFns.format(course.startDate, 'HH:MM')} -
                                {dateFns.format(course.endDate, 'HH:MM')}
                            </strong>
                        </li>
                    </ul>
                    <p>{course.description}</p>
                </CourseContent>
                <BottomSection>
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
                        <span>{course.price} €</span>
                    </div>
                    <Button onClick={onConfirm}>Varaa</Button>
                </BottomSection>
            </Fragment>
        )}
    </Modal>
);

const ConfirmationModal = ({ course, seletectedDate, reserve, clear }) => (
    <Modal show={course} onClear={clear}>
        {course && (
            <Fragment>
                <CourseContent>
                    <Title>Vahvista Varaus</Title>
                    <ul>
                        <li>Olet varaamassa kurssia:</li>
                        <li>
                            <strong>{course.name}</strong>
                        </li>
                        <li>
                            <LocationIcon />
                            {course.location}
                        </li>
                        <li>
                            <DateLogo />
                            {dateFns.format(seletectedDate, 'DD.MM.YYYY')}
                        </li>
                        <li>
                            <ClockLogo />
                            {dateFns.format(course.startDate, 'HH:MM')} -
                            {dateFns.format(course.endDate, 'HH:MM')}
                        </li>
                        <li>
                            <EuroLogo />
                            <strong>{course.price}</strong>
                        </li>
                    </ul>
                    <p>{course.description}</p>
                </CourseContent>
                <BottomSection>
                    <Button onClick={clear}>Keskeytä</Button>
                    <Button onClick={() => reserve(course)}>Vahvista</Button>
                </BottomSection>
            </Fragment>
        )}
    </Modal>
);

const ReservationModal = ({ course, seletectedDate, clear }) => (
    <Modal show={course} onClear={clear}>
        {course && (
            <Fragment>
                <ReservationContent>
                    <Title>Varaus Onnistui</Title>
                    <strong>Varasit tunnin hintaan</strong>
                    <span>{course.price} €</span>
                    <div>
                        Saat varauksesta tekstiviestivahvistuksen puhelimeesi
                    </div>
                </ReservationContent>
                <BottomSection>
                    <Button onClick={clear}>Sulje</Button>
                </BottomSection>
            </Fragment>
        )}
    </Modal>
);

class CourseModal extends React.Component {
    state = {
        showDetails: true,
        showConfirm: false,
        showReserve: false,
        reservedCourse: null,
    };

    clear = () => {
        this.props.courseStore.selectCourse(null);
        this.setState({
            showDetails: true,
            showConfirm: false,
            showReserve: false,
        });
    };

    onConfirm = () => {
        this.setState({
            showDetails: false,
            showConfirm: true,
            showReserve: false,
        });
    };

    reserve = (course) => {
        this.props.courseStore.reserveCourse(course);
        this.setState({
            showDetails: true,
            showConfirm: false,
            showReserve: true,
            reservedCourse: course,
        });
    };

    render() {
        const seletectedDate = this.props.courseStore.filters.date;
        const course = this.props.courseStore.courseInFocus;
        const i18nContent = this.props.i18nStore.content;
        return (
            <div>
                {this.state.showDetails && (
                    <MainModal
                        course={course}
                        seletectedDate={seletectedDate}
                        onConfirm={this.onConfirm}
                        clear={this.clear}
                    />
                )},
                {this.state.showConfirm && (
                    <ConfirmationModal
                        course={course}
                        seletectedDate={seletectedDate}
                        reserve={this.reserve}
                        clear={this.clear}
                    />
                )},
                {this.state.showReserve && (
                    <ReservationModal
                        course={this.state.reservedCourse}
                        seletectedDate={seletectedDate}
                        clear={this.clear}
                    />
                )}
            </div>
        );
    }
}

export default connect('i18nStore', 'courseStore')(CourseModal);
