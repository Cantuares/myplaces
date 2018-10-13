import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Navigation from './components/Navigation'
import Map from './components/Map'
import Dialog from './components/Dialog'
import InfoWindow from './components/InfoWindow'
import Marker from './components/Marker'
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
    map: null,
    google: null,
    isReady: false,
    markers: []
  }

  componentDidMount() {
    this.setState({locations: initial_locations})
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

  onDialogOpen = async title => {
    const locations = this.state.locations
    const index = locations.findIndex(location => location.title === title)
    let location = locations[index]

    await wikipediaAPI.getDetails(title)
    .then(response => response.json())
    .then(data => {
      const key = Object.keys(data.query.pages).pop()
      const pages = data.query.pages[key]
      location.text = pages.extract
      this.setState({dialog: location, center: location.pos})
    })
    .catch((error) => {
      this.setState({dialog: {
        title: `Something went wrong!`,
        text: `Can't load wikipedia data`
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

  navMarker = location => {
    const { google, map } = this.state
    this.state.markers.map(
      v => {
        if (location.title === v.marker.title)
          this.state.google.maps.event.trigger(v.marker, 'click')
        return v
      }
    )
    map.panTo(new google.maps.LatLng(location.pos[0], location.pos[1]))
  }

  onReady = (mapProps, map) => {
    const {google} = mapProps
    this.setState({google, map})
    this.initMarkers()
  }

  toggleBounceMarker = marker => {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null)
    } else {
      marker.setAnimation(this.state.google.maps.Animation.BOUNCE)
    }
  }

  addMarker = marker => {
    marker.setMap(this.state.map)
  }

  addMarkers = marker => {
    this.state.markers.map(v => v.marker.setMap(this.state.map))
  }

  removeMarker = marker => {
    marker.setMap(null)
  }

  removeMarkers = () => {
    this.state.markers.map(v => v.marker.setMap(null))
  }

  getMarker = title => {
    return this.state.markers
      .filter(v =>v.marker.title === title).pop().marker.setMap(this.state.map)
  }

  initMarkers = () => {
    const { google, map, locations } = this.state
    const markers = []
    locations.map(
      (location, index) => {
        let infowindow = new google.maps.InfoWindow({
          content: '<div id="infowindow"></div>'
        })
        let marker = new google.maps.Marker({
          position: new google.maps.LatLng(location.pos[0],location.pos[1]),
          animation: google.maps.Animation.DROP,
          title: location.title
        })
        markers.push({marker: marker, infowindow: infowindow})
        //marker.setMap(map)
        marker.addListener('click', () => {
          infowindow.open(map, marker)
          this.closeInfoWindow(map, marker)
          this.toggleBounceMarker(marker)
          ReactDOM.render(
            <InfoWindow
              onDialogOpen={this.onDialogOpen}
              location={location} />,
          document.getElementById('infowindow'))
        })
        infowindow.addListener('closeclick', () => {
          marker.setAnimation(null);
        })
        if (index + 1 === locations.length)
          this.setState({ markers: markers, isReady: true })
        return location
      }
    )
  }

  closeInfoWindow = (map, marker) => {
    this.state.markers.map(v => {
      if (v.marker.title === marker.title) return v;
      v.infowindow.close(map, v.marker)
      v.marker.setAnimation(null)
      return v
    })
  }

  render() {
    const { query, locations } = this.state

    let showingLocations
    let center
    if (query) {
      this.removeMarkers()
      const match = new RegExp(escapeRegExp(query), 'i')
      showingLocations = locations.filter(
        location =>  match.test(location.title))
      center = showingLocations.length
      ? showingLocations[showingLocations.length-1].pos
      : this.state.center
    } else {
      showingLocations = locations
      center = this.state.center
    }

    showingLocations.sort(sortBy('title'))

    return (
      <div className="App">
        <a
          onClick={this.onSkip}
          href=""
          className="skip-link">skip to search bar</a>
        <div className="header">
          <Navigation
            navMarker={this.navMarker}
            updateQuery={this.updateQuery}
            locations={showingLocations}
          />
        </div>
        <Dialog
          onDialogClose={this.onDialogClose}
          dialog={this.state.dialog}/>
        <div tabIndex="-1" role="application" aria-label="Map from GoogleMaps" className="maps">
          <Map
            onReady={this.onReady}
            center={center}
            locations={showingLocations}
            onError={this.onError}
          />
          {this.state.isReady && (
            <div>
              {showingLocations.map(
                location => (
                <Marker
                  key={location.id}
                  location={location}
                  map={this.state.map}
                  addMarker={this.addMarker}
                  markers={this.state.markers} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
