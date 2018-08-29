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

    const getMessages = () => {
    var db = firebase.firestore();
    var messages = {};
      db.collection("queue").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            const name = doc.data().name;
            const date = doc.data().date;
            const uid = doc.data().uid;
            messages[doc.id] = {name, date, uid}
        });
        this.setState({messages})
    });
    
    }


    var db = firebase.firestore();
    var messages = {};
    db.collection("queue")
    .orderBy("date")
    .onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          const name = doc.data().name;
          const date = doc.data().date;
          const uid = doc.data().uid;
          messages[doc.id] = {name, date, uid}
      });
      this.setState({messages})
  });

  }

  render() {

    const messages = this.state.messages;
    const messageElements = Object.keys(messages).map(
      (item,key) => <QueueItem key={key} item={messages[item]} setClientID={this.props.setClientID}/>
    );

    return (

    <div>
        {messageElements}
    </div>

    );
  }
}

export default DashboardQueue;
