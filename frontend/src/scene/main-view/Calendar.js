import React from 'react';
import styled from 'react-emotion';
import dateFns from 'date-fns';
import { connect, getLocale } from 'utils';

const WeekTable = styled('div')`
    display: flex;
    align-items: center;
    overflow: scroll;
    padding: 1rem 2rem;

    & > :last-child {
        padding-right: 2rem;
    }
`;
const DateColumn = styled('div')`
    font-size: 2rem;
    font-weight: 900;
    display: inline-block;
    margin-right: 2rem;
    padding: 8px;
    border-radius: 8px;
    transition: background-color 0.5s ease;
    cursor: pointer;

    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }

    * {
        text-align: center;
        display: block;
        text-transform: capitalize;
    }

    & > :last-child {
        margin-top: 2rem;
        font-weight: 400;
        opacity: 0.8;
        padding: 7px 8px;
        transition: all 0.5s ease;
    }

    ${(props) =>
        props.past &&
        !props.selected &&
        `
        opacity: 0.7
    `};

    ${(props) =>
        props.selected &&
        `
        & > :last-child {
            margin-top: 2rem;
            font-weight: 400;
            color: white;
            border-radius: 50%;
            background-color: ${props.theme.main};
        }
    `};
`;

const DateFlag = styled('div')`
    width: 100%;
    background-color: ${(props) => props.theme.main};
    font-size: 2rem;
    color: white;
    text-align: center;
    padding: 4px;
`;

const dates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

class WeeklyCalendar extends React.Component {
    state = {
        viewableDateRange: dates.map((i) => dateFns.addDays(new Date(), i)),
    };
    setDate = (date) => (e) => {
        this.props.courseStore.setFilters({
            date,
        });
    };
    render() {
        const today = new Date();
        const selectedDate = this.props.courseStore.filters.date;
        const locale = getLocale(this.props.i18nStore.language);
        return (
            <div>
                <WeekTable>
                    {this.state.viewableDateRange.map((date, index) => (
                        <DateColumn
                            key={dateFns.format(date, 'x')}
                            selected={dateFns.isSameDay(date, selectedDate)}
                            past={dateFns.isBefore(date, today)}
                            onClick={this.setDate(date)}
                        >
                            <span>
                                {dateFns.format(date, 'dd', {
                                    locale,
                                })}
                            </span>
                            <span>{dateFns.format(date, 'DD')}</span>
                        </DateColumn>
                    ))}
                </WeekTable>
                <DateFlag>
                    {dateFns.format(selectedDate, 'DD. MMMM YYYY', {
                        locale,
                    })}
                </DateFlag>
            </div>
        );
    }
}

export default connect('i18nStore', 'courseStore')(WeeklyCalendar);
