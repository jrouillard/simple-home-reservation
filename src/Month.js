import React from "react";
import './Month.scss';
import PropTypes from 'prop-types';
import Day from './Day';

export default class Month extends React.Component {
  static propTypes = {
    year: PropTypes.number,
    monthNumber: PropTypes.number,
    alternate: PropTypes.bool,
    edit: PropTypes.bool,
    reservations: PropTypes.array,
    selections: PropTypes.array,
    selectionStarted: PropTypes.bool,
    onStartSelecting: PropTypes.func,
    onEndSelecting: PropTypes.func,
  };

  static monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  static daysOfWeek = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

  onStartSelecting = (day) => { 
    this.props.onStartSelecting(day, this.props.monthNumber, this.props.year);
  }

  onEndSelecting = (day) => { 
    this.props.onEndSelecting(day, this.props.monthNumber, this.props.year);
  }

  //simple calendar with days of the week and days of the month
  render() {
    const { year, monthNumber, alternate, reservations, edit } = this.props;
    const monthName = Month.monthNames[monthNumber];  //get the name of the month
    const firstDay = new Date(year, monthNumber, 1).getDay() - 1 < 0 ? 6 : new Date(year, monthNumber, 1).getDay() - 1; //get the first day of the month
    const lastDay = new Date(year, monthNumber + 1, 0).getDate(); //get the last day of the month

    const rows = [];
    let cells = [];
    let day = 1;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          cells.push(<td key={j} className="day empty"></td>);
        } else if (day <= lastDay) {
          cells.push(
            <td key={j} className="day number">
              <Day 
                edit={edit}
                number={day}
                reservation={reservations.find(item => item.day === day)}
                selectionStarted={this.props.selectionStarted}
                selected={this.props.selections?.find(item => item.day === day) !== undefined}
                onStartSelecting={(day) => this.onStartSelecting(day)}
                onEndSelecting={(day) => this.onEndSelecting(day)}
              ></Day>
           </td>
          );
          day++;
        } else {
          cells.push(<td key={j} className="day empty"></td>);
        }
      }
      rows.push(<tr key={i}>{cells}</tr>);
      cells = [];
    }
    return (
      <div className="month">
        <div className={"label " + (alternate ? "alternate" : "")}>
          <span>{monthName}</span>
          <span className="year">{year}</span>
        </div>
        <table>
          <thead>
            <tr>
              {Month.daysOfWeek.map((day, index) => (
                <td key={index} className="day name">
                  {day}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}