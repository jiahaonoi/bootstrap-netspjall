import React, { Component } from 'react';
import ClientItem from './ClientItem';

class DashboardQueue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: {},
      clientsClosed: {}
    };
  }
  

  componentDidMount(){
    console.log('client list for '+this.props.adminID)
    const firebase = this.props.fb;
    var db = firebase.firestore();

    // Doing:

    var clients = {};
    db.collection("queueOpened").where("adminID", "==", this.props.adminID)
    .orderBy("date")
    .onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            clients[doc.id] = doc.data();
        });
    }, function(error) {
      console.log('error getting client list ' + error)
    });

    this.setState({clients});

    // Done:

    var clientsDone = {};
    db.collection("queueDone").where("adminID", "==", this.props.adminID)
    .orderBy("date")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            clientsDone[doc.id] = doc.data();
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    this.setState({clientsDone});


  }

  componentWillUnmount(){
    const firebase = this.props.fb;
    var db = firebase.firestore();
    var unsubscribe = db.collection("queueOpened")
    .onSnapshot(function () {});
    // ...
    // Stop listening to changes
    unsubscribe();

  }

  render() {

    const clients = this.state.clients;
    const messageElements = Object.keys(clients).map(
      (item,key) => <div><ClientItem key={key} item={clients[item]} id={item} setClientID={this.props.setClientID} removeButton={() => this.props.setClientDone(clients[item], item)}fb={this.props.fb}/></div>
    );

    return (

    <div class="list-group">
      {messageElements}
    </div>

    );
  }
}

export default DashboardQueue;
