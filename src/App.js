import React, { Component } from 'react'
import Navigation from './components/Navigation'
import Map from './components/Map'
import Dialog from './components/Dialog'
import { initial_locations } from "./utils/locations"
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'
import * as wikipediaAPI from './utils/wikipediaAPI'

class App extends Component {
  state = {
    locations: [],
    center: [38.7600957, -9.2709188],
    query: ``,
    dialog: {},
    showingInfoWindow: false
  }

  componentDidMount() {
    this.setState({ locations: initial_locations })
    document.addEventListener(`keyup`, this.handleKeyDown, false)
  }

  componentWillUnmount() {
    document.removeEventListener(`keyup`, this.handleKeyDown, false);
  }

  onSkip = (event) => {
    event.preventDefault();
    document.querySelector(`.menu-hamburger`).click()
    document.querySelector(`input[name=query]`).focus()
  }

  handleKeyDown = e => {
    switch (e.key) {
      case `Tab`:
        let hasClass = Array.prototype
          .findIndex.call(e.target.classList, i => i === `menu-hamburger`) === 0
        if (hasClass)
          e.target.click()
        break
      default:
    }
  }

  updateQuery = (query) => {
    this.setState({ query: query.trim(), showingInfoWindow: false})
  }

  onToggleInfo = (id) => {
    const locations = this.state.locations.map(
      location =>
        id === location.id
          ? { ...location, info_open: !location.info_open }
          : { ...location, info_open: false }
    )
    this.setState({ locations, showingInfoWindow: true })
  }

  onToggleBounce = id => {
    const bounce_location = this.state.locations.map(
      location =>
        id === location.id
          ? { ...location, animation: window.google.maps.Animation.BOUNCE }
          : location
    )

    const index = this.state.locations.findIndex(
      location =>
        id === location.id
    )

    this.setState({
      locations: bounce_location,
      center: this.state.locations[index].pos
    })

    setTimeout(() => {
      const stop_bounce = this.state.locations.map(
        location =>
          id === location.id ? { ...location, animation: undefined } : location
      );
      this.setState({ locations: stop_bounce })
    }, 1460);
  }

  onDialogOpen = async title => {
    let locations = this.state.locations
    let index = locations.findIndex(location => location.title === title)
    let location = locations[index]
    await wikipediaAPI.getDetails(title)
    .then(response => response.json())
    .then(data => {
      let key = Object.keys(data.query.pages).pop()
      let pages = data.query.pages[key]
      location.text = pages.extract
      this.setState({dialog: location})
    })
    .catch((error) => {
      this.setState({dialog: {
        title: `Something went wrong!`,
        text: `can't load wikipedia data`
      }})
    })
  }

  onDialogClose = () => {
    this.setState({dialog: {}});
  }

  onUpdateLocations = (state) => {
    const { locations, center } = state
    this.setState({locations})
    if (center) this.setState({center})
  }

  onError = error => {
    this.setState({dialog: {
      title: `Something went wrong!`,
      text: error
    }})
  }

  render() {
    const { query, locations } = this.state

    let showingLocations
    let center
    if (query) {
      const match = new RegExp(escapeRegExp(query), 'i')
      showingLocations = locations
        .filter(location => match.test(location.title))
      center = showingLocations.length
      ? showingLocations[showingLocations.length-1].pos
      : this.state.center
    } else {
      showingLocations = locations
      center = this.state.center
    }

    showingLocations.sort(sortBy('title'));

    return (
      <div className="App">
        <a
          onClick={this.onSkip}
          href=""
          className="skip-link">skip to search bar</a>
        <div className="header">
          <Navigation
            onToggleBounce={this.onToggleBounce}
            updateQuery={this.updateQuery}
            locations={showingLocations}
          />
        </div>
        <Dialog
          onDialogClose={this.onDialogClose}
          dialog={this.state.dialog}/>
        <div tabIndex="-1" role="application" aria-label="Map from GoogleMaps" className="maps">
          <Map
            showingInfoWindow={this.state.showingInfoWindow}
            onToggleInfo={this.onToggleInfo}
            onToggleBounce={this.onToggleBounce}
            onDialogOpen={this.onDialogOpen}
            center={center}
            locations={showingLocations}
            onError={this.onError}
          />
        </div>
      </div>
    );
  }
}

export default App;
