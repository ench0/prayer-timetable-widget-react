import React, { Component } from 'react'

import moment from 'moment-hijri'

import Prayer from '../components/Prayer'

moment.locale('en-ie')

// console.log(prayers)

class Prayers extends Component {
  constructor(props) {
    super(props)

    this.state = {
      timetable: [],
      tomorrow: 0,
      dst: 0,
      prayers: { next: { time: moment(), name: '' }, current: { time: moment(), name: '' }, list: [] },
      jamaahShow: true,
      join: 'no'
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.prayers !== this.state.prayers) {
      this.setState({ prayers: nextProps.prayers })
    }
    if (nextProps.jamaahShow !== this.state.jamaahShow) {
      this.setState({ jamaahShow: nextProps.jamaahShow })
    }
    if (nextProps.join !== this.state.join && nextProps.join !== undefined) {
      this.setState({ join: nextProps.join })
    }
  }

  renderPrayers() {
    return (
      <div>
        {this.state.prayers.list.map((prayer, index) => (
          <Prayer
            key={index}
            prayer={prayer}
            nextName={this.state.prayers.next.name}
            jamaahShow={this.state.jamaahShow}
            join={this.state.join}
          />
        ))}
      </div>
    )
  }

  render() {
    let adhan
    let iqamah
    if (this.state.jamaahShow) {
      adhan = <div className="adhanTime">Adhan</div>
      iqamah = <div className="iqamahTime">Iqamah</div>
    } else {
      adhan = <div className="adhanTime right">Adhan</div>
      iqamah = ''
    }

    return (
      <div className="Prayers">
        <div className="prayerTitle">Prayer Timetable for Dublin</div>
        <div>
          <div className="prayerHeader">
            <div className="prayerName">Prayer</div>
            {adhan}
            {iqamah}
          </div>
          {this.renderPrayers()}
        </div>
      </div>
    )
  }
}

export default Prayers
