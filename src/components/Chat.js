import React, { Component } from 'react';
import ChatInput from './ChatInput';
import ChatMessages from './ChatMessages';
import ChatHeader from './ChatHeader';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: '',
      name: '',
      agent: '',
      messages: {},
    };
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
                const message = doc.data().message;
                const date = doc.data().date;
                const uid = doc.data().uid;
                const name = doc.data().name;
                messages[doc.id] = {message, date, uid, name}
                if(uid !== this.props.uid) this.setState({agent: name})
            });
            this.setState({messages})
        });
      } 
      
    }
    getMessages();

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
    return (
      <div className="container p-0 mt-md-2 h-100">
        <div className="card">
          <div className="card-body">
            <ChatHeader agent={this.state.agent} fb={this.props.fb} reset={this.props.reset}/>
            {this.props.uid ? <ChatMessages fb={this.props.fb} uid={this.props.uid} messages={this.state.messages}/> : null}
            <ChatInput fb={this.props.fb} uid={this.props.uid} displayName={this.props.displayName}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
