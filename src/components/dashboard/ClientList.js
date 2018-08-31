import React, { Component } from 'react';
import ClientItem from './ClientItem';

class DashboardQueue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: {},
    };
  }
  

  componentDidMount(){
    const firebase = this.props.fb;
    var db = firebase.firestore();

    var clients = {};
    db.collection("queueOpened").where("adminID", "==", this.props.adminID)
    .orderBy("date")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            clients[doc.id] = doc.data();
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    this.setState({clients});


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
      (item,key) => <ClientItem key={key} item={clients[item]} id={item} setClientID={this.props.setClientID} fb={this.props.fb}/>
    );

    return (

<div class="list-group">
  {messageElements}
</div>

    );
  }
}

export default DashboardQueue;
