import React, { Component } from 'react';

class ChatInput extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {

    event.preventDefault();

    // Initialize Cloud Firestore through Firebase
    var firebase = this.props.fb;
    var db = firebase.firestore();

    const message = this.state.value;
    const uid = this.props.uid;
    const name = this.props.displayName;
    const date = new Date();

    if(uid){

        // Add a new document with a generated id.
        db.collection('messages/' + uid + '/messages/').add({
          message,
          uid,
          date,
          name
        })
        .then((docRef) => {
          this.props.setLatestMessage(uid, message);
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });

    }

    this.setState({value:''})
  }

  componentDidMount() {

  }

  render() {
    return (
        <form onSubmit={this.handleSubmit} id="footer">
        <div className="input-group mb-3">
          <label className="sr-only" htmlFor="inlineFormInput">Skilaboð</label>
          <input value={this.state.value} onChange={this.handleChange} type="text" className="form-control" placeholder="Skilaboð..." aria-label="Recipient's username" aria-describedby="button-addon2"/>
          <div className="input-group-append">
            <button className="btn btn-primary" type="submit" id="button-addon2">Senda</button>
          </div>
        </div>
      </form>);
  }
}

export default ChatInput;
