import React, { Component } from 'react';

import DashboardLogin from './DashboardLogin';
import DashboardQueue from './DashboardQueue';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adminID: '',
      clientID: '',
      clients: {}
    };
  }

  setUser = (userid) => this.setState({adminID: userid});

  componentDidMount(){
    const firebase = this.props.fb;
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('admin is signed in.');
        // User is signed in.
        var uid = user.uid;
        this.setState({adminID : uid})
      } else {
        // User is signed out.
        console.log('admin is signed out');
      }
      // ...
    });
  }

  signOut = () => {
    const firebase = this.props.fb;
    firebase.auth().signOut().then(() => {
      console.log('signing out');
      this.setState({adminID : null})
    }).catch(function(error) {
      console.error(error)
    });
  }

  setClientID = (clientID) => {
    console.log('opening client id '+clientID)
    this.setState({clientID})
  }

  render() {
    return (
      <div className="container" style={{paddingTop: '1rem'}}>
      <div className="card mt-3 mb-3">
      <div className="card-body">
        {this.state.adminID ? 
        <div>Dashboard <button onClick={this.signOut}>logout</button><DashboardQueue fb={this.props.fb} setClientID={this.setClientID}/></div> 
        : 
        <DashboardLogin fb={this.props.fb} setUser={this.setUser} />}
        {this.state.clientID ? <ChatMessages adminID={this.state.adminID} uid={this.state.clientID} fb={this.props.fb}/> : null}
        {this.state.clientID ? <ChatInput adminID={this.state.adminID} uid={this.state.clientID} fb={this.props.fb}/> : null}
        
      </div></div></div>
      )
  }
}

export default Dashboard;
