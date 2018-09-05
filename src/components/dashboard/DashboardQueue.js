import React, { Component } from 'react';
import QueueItem from './QueueItem';

class DashboardQueue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: {},
    };
  }
  

  componentDidMount(){
    const firebase = this.props.fb;

    var db = firebase.firestore();
    
    db.collection("queue")
    .orderBy("date")
    .onSnapshot((querySnapshot) => {
      var messages = {};
      console.log('queue snapshot triggered')
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          messages[doc.id] = doc.data();
      });
      console.log('setting state to ' + Object.keys(messages));
      this.setState({messages});
  });

  }

  componentWillUnmount(){
    const firebase = this.props.fb;
    var db = firebase.firestore();
    var unsubscribe = db.collection("queue")
    .onSnapshot(function () {});
    // ...
    // Stop listening to changes
    unsubscribe();

  }

  render() {

    const messages = this.state.messages;
    const messageElements = Object.keys(messages).map(
      (item,key) => <QueueItem key={key} item={messages[item]} id={item} setClientID={this.props.setClientID} setRemoveQueue={this.props.setRemoveQueue} fb={this.props.fb}/>
    );

    return (

    <div class="list-group">
        {messageElements}
    </div>

    );
  }
}

export default DashboardQueue;
