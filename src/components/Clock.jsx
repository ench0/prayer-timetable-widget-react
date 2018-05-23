import React, { Component } from 'react'
import PropTypes from 'prop-types'

// import './App.css';
import moment from 'moment-hijri'
// import settings from '../settings.json'

class Clock extends Component {
  constructor(props) {
    super(props)

    this.state = {
      date: new Date(),
      day: this.props.day,
      prayers: { next: { time: moment(), name: '' }, current: { time: moment(), name: '' }, list: [] },
      countdown: '--:--:--'
      // time: this.props.time
    }
  }

  // componentDidMount() {
  //     this.timerID = setInterval(
  //         () => this.tick(),
  //         1000
  //     )
  // }

  // componentWillUnmount() {
  //     clearInterval(this.timerID)
  // }

  // tick() {
  //     this.setState({
  //         date: new Date()
  //     })
  // }

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.date !== this.state.date) {
      this.setState({ date: nextProps.date })
    }
    if (nextProps.day !== this.state.day) {
      this.setState({ day: nextProps.day })
    }
    let countdown

    if (nextProps.prayers !== this.state.prayers) {
      const timeToPrayer = moment.duration(this.state.prayers.next.time.diff(moment()), 'milliseconds').add(1, 's') // .asMinutes()

      if (timeToPrayer < 1) countdown = '--:--:--'
      else {
        countdown = `${this.appendZero(timeToPrayer.hours())}:${this.appendZero(
          timeToPrayer.minutes()
        )}:${this.appendZero(timeToPrayer.seconds())}`
      }
      if (countdown === '00:00:00') countdown = '--:--:--'

      this.setState({ prayers: nextProps.prayers, countdown })
    }
  }

  /*
  ****************************************************
  APPEND ZERO
  ****************************************************
  */
  appendZero = unit => {
    if (unit < 10) return `0${unit}`
    else return `${unit}`
  }

  render() {
    // var tomorrow
    // if(this.state.day.tomorrow) tomorrow = "tomorrow"; else tomorrow = "today"

    return (
      <div className="Clock">
        <div className="timeRow">
          {/* {this.state.date.toLocaleTimeString()} */}
          {moment().format('H:mm:ss')}
        </div>
        <div className="dateRow">
          <div>{this.state.day.gregorian}</div>
          <div>{this.state.day.hijri}</div>
          {/* <div>{tomorrow}</div> */}
        </div>
        <div className="countdownRow">
          <div>{this.state.prayers.next.name}</div>
          <div>{this.state.countdown}</div>
        </div>
      </div>
    )
  }
}

Clock.propTypes = {
  date: PropTypes.func,
  day: PropTypes.object,
  prayers: PropTypes.any,
  countdown: PropTypes.string
}

export default Clock
