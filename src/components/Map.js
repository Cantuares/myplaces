import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react';

class MapContainer extends Component {
  state = {
    activeMarker: {},
    selectedPlace: {}
  }

  onToggleInfo = (id, marker) => {
    const index = this.props.locations.findIndex(
      location =>
        id === location.id
    )
    this.setState({
      selectedPlace: this.props.locations[index],
      activeMarker: marker
    })
    this.props.onToggleInfo(id)
  }

  onInfoWindowOpen(props, e) {
    const anchor = (
      <a
        onClick={e => {
          e.preventDefault()
          this.props.onDialogOpen(this.state.selectedPlace.title)
        }}
      href="/"
      >More info</a>
    )
    ReactDOM.render(
      React.Children.only(anchor),
      document.getElementById("moreinfo")
    )
  }

  componentDidCatch(error, info) {
    this.props.onError(`Error while trying to load Google Maps!`);
  }

  render() {
    return (
      <Map google={this.props.google}
        initialCenter={{
          lat: this.props.center[0],
          lng: this.props.center[1],
        }}
        center={{
          lat: this.props.center[0],
          lng: this.props.center[1],
        }}
        zoom={15}>

        {this.props.locations.map(location => (
          <Marker
            key={location.id}
            onClick={(props, marker, e) => {
              this.props.onToggleBounce(location.id);
              this.onToggleInfo(location.id, marker);
            }}
            name={location.title}
            position={{ lat: location.pos[0], lng: location.pos[1] }}
            animation={location.animation} />
        ))}
        <InfoWindow
          marker={this.state.activeMarker}
          onOpen={e => {
            this.onInfoWindowOpen(this.props, e);
          }}
          visible={this.props.showingInfoWindow}>
            <div>
              <p>{this.state.selectedPlace.title}</p>
              <p>{this.state.selectedPlace.address}</p>
              <p>{this.state.selectedPlace.call}</p>
              <div id="moreinfo"></div>
            </div>
        </InfoWindow>
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyCvzlvnCkYUcdmvoL3iWOiadrciLOgq2GQ')
})(MapContainer)
