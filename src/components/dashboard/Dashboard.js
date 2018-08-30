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

  setClientID = (object, id) => {
    console.log('dashboard is opening client id '+object.uid);
    this.setState({ clientID:object.uid });
    this.setNewClient( object.uid );
    console.log(object);
    this.setRemoveQueue(object, id, this.state.adminID);
  }

  setNewClient = (clientID) => {
    const clients = {...this.state.clients, [clientID]: 'true'};
    this.setState({clients});
  }

  setRemoveQueue = (object, queueID, adminID) => {
    console.log('removing doc '+ queueID +' by admin id '+adminID);

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


  render() {
    return (
      <div className="container pt-3">
      <div className="card mt-3 mb-3">
      <div className="card-body">

  <div class="row">
    <div class="col">
    <div class="list-group">
    {Object.keys(this.state.clients)}
  <a href="#" class="list-group-item list-group-item-action flex-column align-items-start active">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">List group item heading</h5>
      <small>3 days ago</small>
    </div>
    <p class="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
    <small>Donec id elit non mi porta.</small>
  </a>
  <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">List group item heading</h5>
      <small class="text-muted">3 days ago</small>
    </div>
    <p class="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
    <small class="text-muted">Donec id elit non mi porta.</small>
  </a>
  <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">List group item heading</h5>
      <small class="text-muted">3 days ago</small>
    </div>
    <p class="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
    <small class="text-muted">Donec id elit non mi porta.</small>
  </a>
</div>
    </div>
    <div class="col">
    {this.state.clientID && this.state.adminID ? <ChatMessages adminID={this.state.adminID} uid={this.state.clientID} fb={this.props.fb}/> : null}
        {this.state.clientID && this.state.adminID ? <ChatInput adminID={this.state.adminID} uid={this.state.clientID} fb={this.props.fb}/> : null}
    </div>
    <div class="col">
{this.state.adminID ? 
  <div>Dashboard <button onClick={this.signOut}>logout</button><DashboardQueue fb={this.props.fb} setClientID={this.setClientID}/></div> 
  : 
  <DashboardLogin fb={this.props.fb} setUser={this.setUser} />}
    </div>
  </div>






        


      </div>
      </div>
      </div>
      )
  }
}

export default Dashboard;
