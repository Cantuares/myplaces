import React, { Component } from 'react'
import { Map, GoogleApiWrapper } from 'google-maps-react'

class MapContainer extends Component {

  componentDidCatch(error, info) {
    this.props.onError(`Error while trying to load Google Maps!`);
  }

  render() {
    return (
      <Map
        onReady={this.props.onReady}
        google={this.props.google}
        initialCenter={{
          lat: this.props.center[0],
          lng: this.props.center[1],
        }}
        center={{
          lat: this.props.center[0],
          lng: this.props.center[1],
        }}
        zoom={15}></Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyCvzlvnCkYUcdmvoL3iWOiadrciLOgq2GQ')
})(MapContainer)
