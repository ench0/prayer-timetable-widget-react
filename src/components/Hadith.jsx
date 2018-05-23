import { Component } from 'react'
// import './App.css'
import moment from 'moment-hijri'

export default class Hadith extends Component {
  state = {
    intro: { text: 'Loading', title: '' },
    image: '',
    refreshing: false,
    refresh: 60
  }

  async componentWillMount() {
    try {
      if ((await localStorage.getItem('text')) !== 'undefined') {
        var newtext = await JSON.parse(localStorage.getItem('text'))
      }
      if ((await localStorage.getItem('title')) !== 'undefined') {
        var newtitle = await JSON.parse(localStorage.getItem('title'))
        console.log('title exist in cookies', newtitle)
      }
      if ((await localStorage.getItem('image')) !== 'undefined') {
        var newimage = await JSON.parse(localStorage.getItem('image'))
        console.log('image exist in cookies', newimage)
      }
      await this.setStateAsync({ intro: { text: newtext, title: newtitle }, image: newimage })
    } catch (error) {
      console.log(error)
    }
  }

  async componentDidMount() {
    await this._onRefresh()

    this.updateID = setInterval(() => this._onRefresh(), this.state.refresh * 60 * 1000)
  }

  componentWillUnmount() {
    clearInterval(this.updateID)
  }

  setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve)
    })
  }

  async _onRefresh() {
    this.setState({ refreshing: true })
    try {
      const res = await fetch('https://islamireland.ie/api/')
      var { intro, image } = await res.json()
      await this.setStateAsync({ intro, image: image.randomthumb })

      await localStorage.setItem('text', JSON.stringify(intro.text))
      await localStorage.setItem('title', JSON.stringify(intro.title))
      await localStorage.setItem('image', JSON.stringify(image.randomthumb))
      this.setState({ refreshing: false })
      this.setState({ refreshed: moment().format('HH:mm') })
      console.log('refreshed hadith:', this.state.refreshed)
    } catch (error) {
      console.log(error)
      this.setState({ refreshing: false })
    }
  }

  render() {
    var styles = {
      backgroundImage: `url(https://islamireland.ie${this.state.image})`,
      opacity: 1,
      transition: 'all 1s ease'
    }
    return (
      <div className="Hadith">
        <div className="hadithImage" style={styles} />
        <div className="hadithText">{this.state.intro.text}</div>
        <div className="hadithTitle">{this.state.intro.title}</div>
      </div>
    )
  }
}
