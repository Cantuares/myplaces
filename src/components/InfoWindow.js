import React, { Component } from 'react'

class InfoWindow extends Component {
  
  render() {
    const { location } = this.props
    return (
      <div>
        <p>{location.title}</p>
        <p>{location.address}</p>
        <p>{location.call}</p>
        <p><a
          onClick={e => {
            e.preventDefault()
            this.props.onDialogOpen(location.title)
          }}
          href="">More Info</a></p>
      </div>
    )
  }
}

export default InfoWindow
