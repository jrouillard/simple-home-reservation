import React from "react";
import './Day.scss';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

export default class Day extends React.Component {
    static propTypes = {
        number: PropTypes.number,
        edit: PropTypes.bool,
        reservation: PropTypes.object,
        selectionStarted: PropTypes.bool,
        selected: PropTypes.bool,
        onStartSelecting: PropTypes.func,
        onEndSelecting: PropTypes.func,
    };

    getClassName() {
        const { reservation } = this.props;
        let name = "day-container";
        if (reservation) {
            name += " " + "guest";
            if (reservation.first) {
                name += " " + "first-reservation";
            }
            if (this.props.edit) {
                name += " " + "not-editable";
            }
        } else {
            if (this.props.selected) {
                name += " " + "selected";
            }
        }
        return name;
    }

    endSelection() {
        if (this.props.selectionStarted && this.props.edit) {
            this.props.onEndSelecting(this.props.number)
        }
    }

    startSelection() {
        if (!this.props.reservation && this.props.edit && !this.props.selectionStarted) {
            console.log("start selection")
            this.props.onStartSelecting(this.props.number);
        }
    }

    render() {
        const { number, color, reservation, edit } = this.props;
        return (
            <div className={this.getClassName()} onMouseMove={() => this.endSelection()} onMouseDown={() => this.startSelection()}>
                <span className="number">{number}</span>
                {reservation?.first ? (<div className="reservation-name">{reservation.guest.name}</div>) : null}

                {reservation ? (<div className="reservation-slot" style={{background: reservation.color}}></div>) : null}
            </div>
        );
    }
}