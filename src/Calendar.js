import React from "react";
import './Calendar.scss';
import PropTypes from 'prop-types';
import Month from './Month';
import Chevron from 'react-chevron'


Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export default class Calendar extends React.Component {
    static propTypes = {
        semester: PropTypes.bool,
        year: PropTypes.number,
        month: PropTypes.number
    };

    constructor(props) {
        super(props);
        this.reservations = this.getDaysFromGuests(this.getGuests());
        this.state = {
            year: props.year,
            month: props.semester ? props.month : 0,
            semester: props.semester,
            selection: [],
            selectionStarted: false,
            edit: false
        };
    };

    getColor(index){ 
        const colors = [
            'rgb(124 129 208)',
            'rgb(56 0 255 / 37%)',
            // 'rgb(255 0 231 / 45%)',
            // 'rgb(87 76 255 / 75%)',
            // 'rgb(255 157 53 / 73%)'
        ]
        return colors[index % colors.length];
    }
    
      
    getGuests() {
        const guests = [];
        guests.push({
            name: "John Doe",
            id: 1,
            color: this.getColor(guests.length),
            dateStart: new Date('August 11, 2022'),
            dateEnd: new Date('August 22, 2022')
        });
        guests.push({
            name: "Jane Doe",
            id: 2,
            color: this.getColor(guests.length),
            dateStart: new Date('July 28, 2022'),
            dateEnd: new Date('August 8, 2022')
        });
        guests.push({
            name: "Jimmy Doe",
            id: 3,
            color: this.getColor(guests.length),
            dateStart: new Date('July 15, 2022'),
            dateEnd: new Date('July 27, 2022')
        });
        guests.push({
            name: "Jojo Doe",
            id: 4,
            color: this.getColor(guests.length),
            dateStart: new Date('August 26, 2022'),
            dateEnd: new Date('September 5, 2022')
        });
        guests.push({
            name: "Mike Doe",
            id: 9,
            color: this.getColor(guests.length),
            dateStart: new Date('June 15, 2022'),
            dateEnd: new Date('June 30, 2022')
        });
        guests.push({
            name: "Fougerousse",
            id: 5,
            color: this.getColor(guests.length),
            dateStart: new Date('July 1, 2022'),
            dateEnd: new Date('July 14, 2022')
        });
        guests.push({
            name: "Berthelot",
            id: 6,
            color: this.getColor(guests.length),
            dateStart: new Date('September 10, 2022'),
            dateEnd: new Date('September 14, 2022')
        });
        guests.push({
            name: "Paul",
            id: 7,
            color: this.getColor(guests.length),
            dateStart: new Date('September 18, 2022'),
            dateEnd: new Date('September 24, 2022')
        });
        guests.push({
            name: "Fanchon",
            id: 8,
            color: this.getColor(guests.length),
            dateStart: new Date('October 3, 2022'),
            dateEnd: new Date('October 6, 2022')
        });
        return guests;
    }

    getDaysBetweenDates(startDate, stopDate) {
        var allDays = [];
        var currentDate = startDate;
        while (currentDate <= stopDate) {
            allDays.push({day: currentDate.getDate(), month: currentDate.getMonth(), year: currentDate.getFullYear()});
            currentDate = currentDate.addDays(1);
        }
        return allDays;
    }

    //get all the days for a guest
    getDaysForGuest(guest) {
        const days = [];
        const start = guest.dateStart;
        const end = guest.dateEnd;
        const startYear = start.getFullYear();
        const startMonth = start.getMonth();
        const startDay = start.getDate();
        const endYear = end.getFullYear();
        const endMonth = end.getMonth();
        const endDay = end.getDate();
        let currentYear = startYear;
        let currentMonth = startMonth;
        let currentDay = startDay;
        while (currentYear < endYear || currentMonth < endMonth || currentDay <= endDay) {
            const maxDays =  new Date(currentYear, currentMonth + 1, 0).getDate();
            if (currentDay > maxDays) {
                currentDay = 1;
                currentMonth++;
                if (currentMonth > 11) {
                    currentMonth = 0;
                    currentYear++;
                }
            }
            const currentDate = new Date(currentYear, currentMonth, currentDay);
            days.push({
                id: guest.id,
                first: currentDay === startDay && currentMonth === startMonth && currentYear === startYear,
                color: guest.color,
                day: currentDay,
                month: currentDate.getMonth(),
                year: currentDate.getFullYear(),
                guest: guest
            });
            currentDay++;

        }
        return days;
    }

    getDaysFromGuests = (guests) => {
        const days = [];
        guests.forEach(guest => {
            this.getDaysForGuest(guest).forEach(day => {
                days.push(day);
            });
        });
        return days;
    }

    checkDays = (days, reverse) => {
        if (reverse) {
            days = days.reverse();
        }
        const index = days.findIndex(day => { 
            return this.reservations.find(reservation => reservation.day === day.day && reservation.month === day.month && reservation.year === day.year);
        });
        if (index !== -1) {
            if(reverse) {
                return days.slice(index);
            } else {
                return days.slice(0, index);
            }
        } else {
            return days;
        }
    }

    onEndSelecting = (day, month, year) => {
        let earliestDate = new Date(this.state.selection[0].year, this.state.selection[0].month, this.state.selection[0].day);
        let newDate = new Date(year, month, day);
        let reverse = false;
        if (earliestDate > newDate) {
            const earliestDateTemp = new Date(earliestDate);
            earliestDate = newDate;
            newDate = earliestDateTemp;
            reverse = true
        }
        const allDaysBetween = this.getDaysBetweenDates(
            earliestDate,
            newDate
        )
        const newSelection = this.checkDays(allDaysBetween, reverse);
        this.setState({selection: reverse ? newSelection.reverse() : newSelection});
    }

    onStartSelecting = (day, month, year) => {
        this.setState({selection: [{day, month, year}], selectionStarted: true});
    }

    stopSelecting = (day, month, year) => {
        this.setState({selectionStarted: false});
    }

    render() {
        const indexFirstMonth = this.state.semester ? this.state.month : 0;
        const indexLastMonth = this.state.semester ? this.state.month + 5 : 12;
        const months = [];
        for (let i = indexFirstMonth; i < (indexLastMonth < 12 ? indexLastMonth : 12); i++) {
            months.push(<Month
                edit={this.state.edit}
                reservations={this.reservations.filter(item => item.month === i && item.year === this.state.year)}
                selections={this.state.selection.filter(item => item.month === i && item.year === this.state.year)}
                selectionStarted={this.state.selectionStarted}
                key={i}
                year={this.state.year}
                onStartSelecting={(day, month, year) => this.onStartSelecting(day, month, year)}
                onEndSelecting={(day, month, year) => this.onEndSelecting(day, month, year)}
                monthNumber={i}/>);
        }
        if (indexLastMonth > 12) {
            for (let i = 0; i < indexLastMonth%12; i++) {
                months.push(<Month 
                    edit={this.state.edit}
                    reservations={this.reservations.filter(item => item.month === i && item.year === this.state.year + 1)}
                    selected={this.state.selection.filter(item => item.month === i && item.year === this.state.year + 1)}
                    selectionStarted={this.state.selection.length > 0}
                    key={12 + i}
                    year={this.state.year + 1}
                    monthNumber={i}
                    onStartSelecting={(day, month, year) => this.onStartSelecting(day, month, year)}
                    onEndSelecting={(day, month, year) => this.onEndSelecting(day, month, year)}
                    alternate/>);
            }
        } 
        let yearSiwtching = "";
        if (!this.state.semester) {
            yearSiwtching = <div className="year-switching">
                <button type="button" onClick={() => this.setState({ year: this.state.year - 1 })}><Chevron direction="left"/></button>
                <span>{this.state.year}</span>
                <button type="button" onClick={() => this.setState({ year: this.state.year + 1 })}><Chevron/></button>
                </div>;
        }
        return (
        <div className="calendar"  onMouseUp={() => this.stopSelecting()}>
            {yearSiwtching}
            <button  type="button" onClick={() => this.setState({edit : true})}>Reserver</button>
            <div className="months">{months}</div>
        </div>
        );
    }
}