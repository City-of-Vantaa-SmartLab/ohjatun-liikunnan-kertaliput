import React, { Fragment } from 'react';
import styled from 'react-emotion';
import { connect, getLocale, composeFunction } from 'utils';
import Modal, { Content, Title } from '../../components/modal';
import LocationIcon from '../../common/LocationIcon';
import DateLogo from '../../common/DateLogo';
import ClockLogo from '../../common/ClockLogo';
import TeacherLogo from '../../common/TeacherLogo';
import EuroLogo from '../../common/EuroLogo';
import Button from '../../components/button';
import dateFns from 'date-fns';
import posed from 'react-pose';
import { getErrorDetail } from './CourseUtil';
import { Link } from 'react-router-dom';
import BalanceView from '../balance';
import PaymentProvidersView from '../payment-providers';

const CourseContent = styled(Content)`
    width: 100%;
    max-height: 70%;
    overflow-y: scroll;
    overflow-x: hidden;

    ul {
        padding: 0;
        margin: 0;
    }
    p {
        margin: 1rem;
    }
    li {
        padding: 1rem 0;
        margin-left: 1rem;
        display: flex;
        align-items: center;
        text-transform: capitalize;

        svg {
            fill: ${(props) => props.theme.complementary};
            width: 2.5rem;
            height: auto;
            margin-right: 1.5rem;
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
        border-bottom: 1px rgba(0, 0, 0, 0.8) solid;
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
        margin-top: 2rem;
        padding: 2rem;
        flex-basis: 70%;
    }
`;

const UpdateContent = styled(Content)`
    height: 100%;
    display: flex;
    justify-content: baseline;
    align-items: center;
    flex-direction: column;
    margin-top: 10rem;

    div {
        padding-top: 15rem;
        font-size: 2rem;
        text-align: center;
    }
`;

const LinkContent = styled(Link)`
    color: inherit;
    text-decoration: none;
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

const ReservationFailedContent = styled(Content)`
    height: 100%;
    display: flex;
    justify-content: baseline;
    align-items: center;
    flex-direction: column;
    margin-top: 20rem;

    div {
        padding-top: 10rem;
        padding: 10rem 3rem 0 3 rem;
        font-size: 2rem;
        text-align: center;
    }
`;

const ErrorMessageAnimation = posed.h4({
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

const ErrorMessageTag = styled(ErrorMessageAnimation)`
    color: ${(props) => props.theme[props.color]};
    font-size: 2.3rem;
    font-weight: bold;
    margin: 0;
    key="3"
    color={errorDetail.colorCode}
    margin-Top : 1rem
`;

const MainModal = ({
    course,
    selectedDate,
    onConfirm,
    onAddSaldo,
    clear,
    errorDetail,
    content,
}) => (
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

                            {dateFns.format(selectedDate, 'dddd DD.MM.YYYY', {
                                locale: getLocale(),
                            })}
                        </li>
                        <li>
                            <ClockLogo />
                            {dateFns.format(course.startDate, 'HH:mm')} -
                            {dateFns.format(course.endDate, 'HH:mm')}
                        </li>
                        <li>
                            <TeacherLogo />
                            {course.teacher ? course.teacher : 'N/A'}
                        </li>
                    </ul>
                    <p>{course.description}</p>
                </CourseContent>
                <BottomSection>
                    <div>
                        <div>
                            <span>
                                {course.single_payment_count -
                                    course.reservedCount}{' '}
                                vapaana
                            </span>
                        </div>
                        <span>
                            {Number(course.price).toLocaleString('fi')} €
                        </span>
                    </div>

                    <ErrorMessageTag color={errorDetail.colorCode}>
                        {errorDetail.longMessage}
                    </ErrorMessageTag>
                    {!course.reasons || // Reason is "openTime" probably.
                    (course.reasons[0] !== 'auth' &&
                        course.reasons[0] !== 'resource') ? (
                        <Button
                            alternative
                            bold
                            onClick={onConfirm}
                            disabled={errorDetail.longMessage}
                        >
                            Varaa
                        </Button>
                    ) : (
                        [
                            course.reasons[0] === 'auth' ? (
                                <Button alternative bold>
                                    <LinkContent onClick={clear} to="/login">
                                        {content.appHeader.login}
                                    </LinkContent>
                                </Button>
                            ) : (
                                course.reasons[0] === 'resource' && (
                                    <Button
                                        alternative
                                        bold
                                        onClick={onAddSaldo}
                                    >
                                        {content.balanceView.topUp}
                                    </Button>
                                )
                            ),
                        ]
                    )}
                </BottomSection>
            </Fragment>
        )}
    </Modal>
);

const ConfirmationModal = ({ course, selectedDate, reserve, clear }) => (
    <Modal show={course} onClear={clear}>
        {course && (
            <Fragment>
                <CourseContent>
                    <Title>Vahvista varaus</Title>
                    <ul>
                        <h4>Olet varaamassa kurssia</h4>
                        <li>
                            <Title>{course.name}</Title>
                        </li>
                        <li>
                            <LocationIcon />
                            {course.location}
                        </li>
                        <li>
                            <DateLogo />
                            {dateFns.format(selectedDate, 'dd DD.MM.YYYY', {
                                locale: getLocale(),
                            })}
                        </li>
                        <li>
                            <ClockLogo />
                            {dateFns.format(course.startDate, 'HH:mm')} -
                            {dateFns.format(course.endDate, 'HH:mm')}
                        </li>
                        <li>
                            <TeacherLogo />
                            {course.teacher}
                        </li>
                        <li>
                            <EuroLogo />
                            <strong>
                                {Number(course.price).toLocaleString('fi')}
                            </strong>
                        </li>
                    </ul>
                    <p>{course.description}</p>
                </CourseContent>
                <BottomSection>
                    <Button color="red" onClick={clear}>
                        Keskeytä
                    </Button>
                    <Button bold onClick={() => reserve(course)}>
                        Vahvista
                    </Button>
                </BottomSection>
            </Fragment>
        )}
    </Modal>
);

const RefreshModal = ({ showModal, refreshApp }) => (
    <Modal show={showModal} hideCloseButton>
        <Fragment>
            <UpdateContent>
                <Title>Hei!</Title>
                <div>Uusi versio sovelluksesta on saatavilla</div>
            </UpdateContent>
            <BottomSection>
                <Button bold onClick={() => refreshApp()}>
                    Päivitä
                </Button>
            </BottomSection>
        </Fragment>
    </Modal>
);

const ReservationModal = ({ course, reservationError, clear }) => (
    <Modal show={course} onClear={clear}>
        {reservationError ? (
            <Fragment>
                <ReservationFailedContent>
                    <Title>Voi harmi!</Title>

                    <div>{reservationError}</div>
                </ReservationFailedContent>
                <BottomSection>
                    <Button onClick={clear}>Takaisin</Button>
                </BottomSection>
            </Fragment>
        ) : (
            <Fragment>
                <ReservationContent>
                    <Title>Varaus onnistui</Title>
                    <strong>Varasit tunnin hintaan</strong>
                    <span>{Number(course.price).toLocaleString('fi')} €</span>
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
        showSaldo: false,
        showPaymentProviders: false,
        paymentProviders: null,
        reservedCourse: null,
        showRefreshModal: false,
        reservationInProgress: false,
    };

    componentDidMount() {
        setInterval(this.checkForUpdates, 5000);
    }

    checkForUpdates = () => {
        let updateAvailable = window['updateAvailable'];
        console.log('New version available: ' + updateAvailable);

        // TODO: a working update process. The old one just reloads the page from cache, only manual Ctrl+F5 actually worked.
        if (updateAvailable) {
            console.log(
                'Uusi versio saatavilla, päivitä sivu painamalla Ctrl+F5.'
            );
            //this.setState({ showRefreshModal: true });
        }
    };

    clear = () => {
        this.props.courseStore.selectCourse(null);
        this.setState({
            showDetails: true,
            showConfirm: false,
            showReserve: false,
            showSaldo: false,
        });
    };

    clearPayment = () => {
        this.clear();
        this.setState({
            showPaymentProviders: false,
            paymentProviders: null,
        });
    };

    onConfirm = () => {
        this.setState({
            showDetails: false,
            showConfirm: true,
            showReserve: false,
        });
    };

    onAddSaldo = () => {
        this.setState({
            showDetails: false,
            showConfirm: false,
            showReserve: false,
            showSaldo: true,
        });
    };

    reserve = async (course) => {
        if (!this.state.reservationInProgress) {
            this.setState({
                reservationInProgress: true,
            });
            const reservationError = await this.props.courseStore.reserveCourse(
                course
            );
            this.setState({
                showDetails: true,
                showConfirm: false,
                showReserve: true,
                reservedCourse: course,
                reservationError: reservationError,
                reservationInProgress: false,
            });
        }
    };

    refreshApp = () => {
        window['updateAvailable'] = false;
        this.setState({ showReserve: false });
        // TODO/fixme: this doesn't reload a new version. Reload uses old cache.
        window.location.reload();
    };

    removeFocusesCourse = () => {
        this.props.courseStore.reserveCourse(null);
    };

    initiatePayment = async (paymentProviders) => {
        console.log('Payment initiated from course modal.');
        this.setState({
            paymentProviders: await paymentProviders,
            showPaymentProviders: true,
        });
    };

    render() {
        const selectedDate = this.props.courseStore.filters.date;
        const course = this.props.courseStore.courseInFocus;
        const i18nContent = this.props.i18nStore.content;
        const errorDetail =
            getErrorDetail(
                course,
                this.props.i18nStore.content.courseCard.errorMessages
            ) || {};
        return (
            <div>
                {this.state.showDetails && (
                    <MainModal
                        course={course}
                        selectedDate={selectedDate}
                        onConfirm={this.onConfirm}
                        onAddSaldo={this.onAddSaldo}
                        clear={this.clear}
                        errorDetail={errorDetail}
                        content={i18nContent}
                    />
                )}

                {this.state.showRefreshModal &&
                !this.state.showConfirm &&
                !this.state.showReserve ? (
                    <RefreshModal
                        showModal={this.state.showRefreshModal}
                        refreshApp={this.refreshApp}
                    />
                ) : null}
                {this.state.showConfirm && (
                    <ConfirmationModal
                        course={course}
                        selectedDate={selectedDate}
                        reserve={this.reserve}
                        clear={this.clear}
                    />
                )}
                {this.state.showSaldo && (
                    <BalanceView
                        isShown={true}
                        onClear={this.clear}
                        initiatePayment={this.initiatePayment}
                    />
                )}
                {this.state.showPaymentProviders && (
                    <PaymentProvidersView
                        show={true}
                        onClear={this.clearPayment}
                        providers={this.state.paymentProviders}
                    />
                )}
                {this.state.showReserve && (
                    <ReservationModal
                        course={this.state.reservedCourse}
                        selectedDate={selectedDate}
                        reservationError={this.state.reservationError}
                        clear={composeFunction(
                            this.clear,
                            this.removeFocusesCourse
                        )}
                    />
                )}
            </div>
        );
    }
}

export default connect('i18nStore', 'courseStore')(CourseModal);
