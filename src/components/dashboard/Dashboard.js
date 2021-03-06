import React, { Component } from 'react';

import DashboardLogin from './DashboardLogin';
import DashboardQueue from './DashboardQueue';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ClientList from './ClientList';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adminID: '',
      clientID: '',
      clients: {},
      lastActive: '',
      active: true
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

        this.setOnline(uid);
      } else {
        // User is signed out.
        console.log('admin is signed out');
      }
      // ... l I
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

  setClientID = (object, id) => {
    console.log('dashboard is opening client id '+object.uid);
    this.setState({ clientID:object.uid });
    this.setNewClient( object.uid );
    console.log(object);
  }

  setNewClient = (clientID) => {
    const clients = {...this.state.clients, [clientID]: 'true'};
    this.setState({clients});
  }

  setRemoveQueue = (object, queueID) => {
    const adminID = this.state.adminID;
    console.log('======removing doc '+ queueID +' by admin id '+adminID);
    // add adminID to object
    object['adminID'] = adminID;

    const firebase = this.props.fb;
    var db = firebase.firestore();

    var queueRef = db.collection('queue').doc(queueID);

        // Add a new document with a generated id.
        db.collection('queueOpened/').add(object)
        .then(function(docRef) {
                  console.log("Added new opened ID: ", docRef.id);
                  queueRef.delete().then(function() {
                      console.log("Document successfully deleted from Q!");
                  }).catch(function(error) {
                      console.error("Error removing document: ", error);
                  });
                  
        })
        .catch(function(error) {
          console.error("Error connecting to Q document: ", error);
        });
    
  }

  setClientDone = (object, queueID) => {
    console.log('removing doc from opened '+ queueID);
    
    // add adminID to object
    object['dateClosed'] = new Date();

    const firebase = this.props.fb;
    var db = firebase.firestore();

    var queueRef = db.collection('queueOpened').doc(queueID);

        // Add a new document with a generated id.
        db.collection('queueDone/').add(object)
        .then(function(docRef) {
                  console.log("Added new done ID: ", docRef.id);
                  queueRef.delete().then(function() {
                      console.log("Document successfully deleted from done Q!");
                  }).catch(function(error) {
                      console.error("Error removing document: ", error);
                  });
                  
        })
        .catch(function(error) {
          console.error("Error connecting to Q document: ", error);
        });
    
  }
  
  setOnline = (adminID) => {

    const firebase = this.props.fb;
    var db = firebase.firestore();

    var docData = {
      lastActive: new Date(),
      uid: adminID
    };
    db.collection("online").doc(adminID).set(docData).then(() => {
        console.log("Document successfully written!");
        this.setState({ lastActive: new Date() })
    });
  }

  setActive = (firebase, adminID) => {
    const now = new Date();
    const then = this.state.lastActive;
    const between = now.getTime() - then.getTime();

    if(between > 10000){ // more than 10 seconds since last updated
      this.setOnline(firebase, adminID)
    }
  }


  render() {
    return (
      <div className="container-fluid pt-3">
      <div className="card mt-3 mb-3">
      <div className="card-body">
{this.state.adminID ? 
  <div>Dashboard <button onClick={this.signOut}>logout</button></div> 
  : 
  <DashboardLogin fb={this.props.fb} setUser={this.setUser} />}

  <div class="row">
    <div class="col">
    {this.state.adminID ? <ClientList setClientID={this.setClientID} setClientDone={this.setClientDone}adminID={this.state.adminID} fb={this.props.fb}/> : null}
      
      
    </div>
    <div class="col">
    {this.state.clientID && this.state.adminID ? <ChatMessages adminID={this.state.adminID} uid={this.state.clientID} fb={this.props.fb}/> : null}
        {this.state.clientID && this.state.adminID ? <ChatInput setActive={this.setActive} adminID={this.state.adminID} uid={this.state.clientID} setLatestMessage={this.props.setLatestMessage} fb={this.props.fb}/> : null}
    </div>
    <div class="col"> 
    {this.state.adminID ? <DashboardQueue fb={this.props.fb} setClientID={this.setClientID} setRemoveQueue={this.setRemoveQueue}/> : null}
    </div>
  </div>






        


      </div>
      </div>
      </div>
      )
  }
}

export default Dashboard;
