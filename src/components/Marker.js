import { Component } from 'react'

class Marker extends Component {

  render() {
    const { map, markers, location } = this.props
    markers.filter(
      v => {
        if (location.title === v.marker.title)
          v.marker.setMap(map)
        return v
      }
    )
    return []
  }
}

export default Marker
