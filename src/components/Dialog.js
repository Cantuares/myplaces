import React, { Component } from 'react'
import DOMPurify from 'dompurify'

class Dialog extends Component {

  onClose = () => this.props.onDialogClose()

  render() {
    return (
      <div className={
        Object.keys(this.props.dialog).length
        ? `dialog-opened`
        : `dialog-closed`
        }
      >
        <div className="dialog">
          <div className="dialog-header">
            <h4>{this.props.dialog.title}</h4>
          </div>
          {!this.props.dialog.text
          ? (
            <div className="dialog-body">
              <p>
                <b>There is no information about this place.</b>
              </p>
            </div>
          )
          : (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(this.props.dialog.text)}}
              className="dialog-body">
            </div>
          )}
          <div className="dialog-footer">
            <button
              className="dialog-bt default"
              onClick={this.onClose}>
              Close
            </button>
          </div>
        </div>
        <div
          onClick={this.onClose}
          className="dialog-overlay">
        </div>
      </div>
    )
  }
}

export default Dialog
