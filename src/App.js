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
    dialog: {}
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
    this.setState({ query: query.trim()})
  }

  placeToGo = id => {
    let index = this.state.locations.findIndex(location => location.id === id)
    let location = this.state.locations[index]
    let center = location.pos
    this.setState({center});
  }

  onDialogOpen = async title => {
    let locations = this.state.locations
    let index = locations.findIndex(location => location.title === title)
    let location = locations[index]
    let wikipedia = await wikipediaAPI.getDetails(title)
    location.wikipedia = wikipedia.extract
    this.setState({dialog: location})
  }

  onDialogClose = () => {
    this.setState({dialog: {}});
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
            placeToGo={this.placeToGo}
            updateQuery={this.updateQuery}
            locations={showingLocations}
          />
        </div>
        <Dialog
          onDialogClose={this.onDialogClose}
          dialog={this.state.dialog}/>
        <div tabIndex="-1" role="application" aria-label="Map from GoogleMaps" className="maps">
          <Map
            onDialogOpen={this.onDialogOpen}
            center={center}
            locations={showingLocations}
          />
        </div>
      </div>
    );
  }
}

export default App;
