import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

class MapContainer extends Component {

  onMarkerClick = (props) => this.props.onDialogOpen(props.name)

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
            onClick={this.onMarkerClick}
            name={location.title}
            position={{ lat: location.pos[0], lng: location.pos[1] }} />
        ))}
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyCvzlvnCkYUcdmvoL3iWOiadrciLOgq2GQ')
})(MapContainer)
