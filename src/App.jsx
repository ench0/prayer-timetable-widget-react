import { Component } from 'react'
import { prayersCalc, dayCalc } from 'prayer-timetable-lib'
import moment from 'moment-hijri'

import './App.css'
import Hadith from './components/Hadith'
import Clock from './components/Clock'
import Prayers from './components/Prayers'

import defsettings from './settings.json'
import deftimetable from './cities/dublin.json'

export default class App extends Component {
  state = {
    timetable: deftimetable,
    settings: defsettings,
    dst: 0,
    date: new Date(),
    day: {},
    prayers: { next: { time: moment(), name: '' }, current: { time: moment(), name: '' }, list: [] },
    tomorrow: 0,
    name: '',
    jamaahShow: true,
    overlayActive: false,
    overlayTitle: ' ... ',
    jummuahTime: moment({ hour: '13', minute: '10' }).day(5),
    taraweehTime: moment({ hour: '23', minute: '00' }), // .iMonth(8),
    refresh: this.props.refresh || 60,
    timePeriod: '',
    join: '0',
    log: false,
    refreshed: moment().format('HH:mm')
  }

  /**********************************************************************
  STATES
  **********************************************************************/
  async componentWillMount() {
    prayersCalc(
      this.state.tomorrow,
      this.state.settings,
      this.state.timetable,
      this.state.jamaahShow,
      this.state.join,
      this.state.log
    )

    document.title = 'ICCI - Islamic Cultural Centre of Ireland'
    try {
      if ((await localStorage.getItem('settings')) !== 'undefined') {
        var newsettings = await JSON.parse(localStorage.getItem('settings'))
      }
      if ((await localStorage.getItem('timetable')) !== 'undefined') {
        var newtimetable = await JSON.parse(localStorage.getItem('timetable'))
      }
      // await this.setState({ settings: newsettings, timetable: newtimetable, join: newsettings.join })
      await this.setState({ settings: newsettings, timetable: newtimetable })
    } catch (error) {
      console.log(error)
    }

    this.setState({
      // tomorrow=0, settings={jamaahmethods=[], jamaahoffsets=[]}, timetable, jamaahShow='0', join=false, test=false }
      prayers: prayersCalc(
        this.state.tomorrow,
        this.state.settings,
        this.state.timetable,
        this.state.jamaahShow,
        this.state.join,
        this.state.log
      ),
      day: dayCalc(this.state.tomorrow, { hijrioffset: this.state.settings.hijrioffset })
    })
  }

  async componentDidMount() {
    await this.update()

    this.timerID = setInterval(() => this.tick(), 1000)
    this.updateID = setInterval(() => this.update(), this.state.refresh * 60 * 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
    clearInterval(this.updateID)
  }

  /**********************************************************************
  SCRIPTS
  **********************************************************************/
  tick() {
    this.setState({
      prayers: prayersCalc(
        this.state.tomorrow,
        this.state.settings,
        this.state.timetable,
        this.state.jamaahShow,
        this.state.join,
        this.state.log
      ),
      day: dayCalc(this.state.tomorrow, { hijrioffset: this.state.settings.hijrioffset }),
      tomorrow: this.state.prayers.newtomorrow
    })
  }

  async update() {
    if (this.state.refresh !== 0) {
      try {
        const res = await fetch('https://islamireland.ie/api/timetable/', { mode: 'cors' })
        // set vars
        const { name, settings, timetable } = await res.json()
        // update states and storage
        await this.setState({ settings, timetable, name })
        await localStorage.setItem('settings', JSON.stringify(settings))
        await localStorage.setItem('timetable', JSON.stringify(timetable))

        this.setState({
          refreshed: moment().format('HH:mm')
        })
        console.log('refreshed main:', this.state.refreshed)
      } catch (error) {
        console.log(error)
      }
    }
  }

  /**********************************************************************
  RENDERING
  **********************************************************************/
  render() {
    return (
      <div className="Widget">
        <Hadith />
        <Clock day={this.state.day} prayers={this.state.prayers} />
        <Prayers prayers={this.state.prayers} jamaahShow={this.state.jamaahShow} join={this.state.join} />
      </div>
    )
  }
}
