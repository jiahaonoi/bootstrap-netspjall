import React, { Component } from 'react';

class ChatMessages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: {}
    };
  }

    componentDidUpdate(){
    document.getElementById('messages') ? document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight : null;
  }

  componentDidMount(){
    const getMessages = () => {
      // Initialize Cloud Firestore through Firebase
      var firebase = this.props.fb;
      var db = firebase.firestore();
      if(this.props.uid){
        db.collection('messages/'+this.props.uid+'/messages/')
        .orderBy("date")
        .onSnapshot((querySnapshot) => {
          
            var messages = {};
            querySnapshot.forEach((doc) => {
              console.log(doc.data());
                const message = doc.data().message;
                const date = doc.data().date;
                const uid = doc.data().uid;
                const name = doc.data().name;
                messages[doc.id] = {message, date, uid, name}
            });
            this.setState({messages})
        });
      } 
      
    }
    getMessages();
  }

  componentDidUpdate(prevProps) {
    if(this.props.uid !== prevProps.uid)
    {
      var firebase = this.props.fb;
      var db = firebase.firestore();
      var unsubscribe = db.collection('messages/'+prevProps.uid+'/messages/')
      .onSnapshot(function () {});
      // ...
      // Stop listening to changes
      unsubscribe();

      const getMessages = () => {
        // Initialize Cloud Firestore through Firebase
        var firebase = this.props.fb;
        var db = firebase.firestore();
        if(this.props.uid){
          db.collection('messages/'+this.props.uid+'/messages/')
          .orderBy("date")
          .onSnapshot((querySnapshot) => {
            
              var messages = {};
              querySnapshot.forEach((doc) => {
                console.log(doc.data());
                  const message = doc.data().message;
                  const date = doc.data().date;
                  const uid = doc.data().uid;
                  const name = doc.data().name;
                  messages[doc.id] = {message, date, uid, name}
              });
              this.setState({messages})
          });
        } 
        
      }
      getMessages();
    }

    document.getElementById('messages') ? document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight : null;

  } 

  componentWillUnmount(){
    var firebase = this.props.fb;
    var db = firebase.firestore();
    var unsubscribe = db.collection('messages/'+this.props.uid+'/messages/')
    .onSnapshot(function () {});
    // ...
    // Stop listening to changes
    unsubscribe();

  }

  

  render() {

    const messages = this.state.messages;
    const messageElements = Object.keys(messages).map(
      (item,key) => <div key={key} className={'message ' + (messages[item].uid === this.props.adminID ? 'message_from-myself':'')}>{messages[item].message}</div>
    );

    return (

    <div style={{overflowY: 'scroll', height:'40vh'}} id="messages">
      <div className="card-body">
        {messageElements}
      </div>
    </div>
        


    );
  }
}

export default ChatMessages;
