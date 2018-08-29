import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Dashboard extends Component {

  signOut = () => {
    const firebase = this.props.fb;
    firebase.auth().signOut().then(() => {
      console.log('signing out');
    }).catch(function(error) {
      console.error('logout error happened')
    });
  }

  componentWillUnmount(){
    this.signOut();
  }

  render() {
    return (
      <Redirect to="/"/>
      )
  }
}

export default Dashboard;
