import React, { Component } from 'react';

class ActivityLight extends Component {


  render() {

    return (
      <React.Fragment>{this.props.isActive ? 'Active' : 'Not Active'}</React.Fragment>
      )
  }
}

export default ActivityLight;
