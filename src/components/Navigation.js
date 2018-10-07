import React, { Component } from 'react'

class Navigation extends Component {
  state = {
    open: false
  }

  updateQuery = event => {
    this.props.updateQuery(event.target.value)
  }

  onToggleMenu = () => {
    this.setState({open: !this.state.open})
  }

  placeToGo = (event, id) => {
    event.preventDefault()
    this.props.placeToGo(id);
  }

  render() {
    return (
      <div id="navigation" className="navigation">
        <div aria-label="Menu Navigation" tabIndex="0" className={
          this.state.open
          ? `menu-hamburger opened`
          : `menu-hamburger`}
          onClick={this.onToggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={
            this.state.open
            ? `menu opened`
            : `menu`}>
          <div className="logo">
            My<span>Places</span>
          </div>
          <div className="search-bar">
            <input
              onChange={this.updateQuery}
              name="query"
              type="text"
              placeholder="Find places and addresses" />
          </div>
          <ul>
            {this.props.locations.map((location, key) => (
              <li key={key}>
                <a
                  onClick={event => {this.placeToGo(event, location.id)}}
                  href="">
                    {location.title}
                  </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default Navigation;
