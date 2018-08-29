import React, { Component } from 'react';

class ChatMessages extends Component {

  componentDidUpdate(){
    document.getElementById('messages') ? document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight : null;
  }

  render() {

    const messages = this.props.messages;
    const messageElements = Object.keys(messages).map(
      (item,key) => <div key={key} className={'message ' + (messages[item].uid === this.props.uid ? 'message_from-myself':'')}>{messages[item].message}</div>
    );

    return (

    <div className="card mt-3 mb-3" style={{overflowY: 'scroll'}} id="messages">
      <div className="card-body">
        {messageElements}
      </div>
    </div>
        


    );
  }
}

export default ChatMessages;
