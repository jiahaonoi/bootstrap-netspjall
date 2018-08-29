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
    const firebase = this.props.fb;
    console.log('loggin in')
    firebase.auth().signInAnonymously().catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      errorCode ? console.error(errorMessage) : console.error("Sign in");
    });

    
    // set state
    this.props.setUserInfo(this.state.value);
    event.preventDefault();

  }

  render() {
    return (
        <form onSubmit={this.handleSubmit}>
        <div className="input-group mb-3">
          <label className="sr-only" htmlFor="inlineFormInput">Skilaboð</label>
          <input value={this.state.value} onChange={this.handleChange} type="text" className="form-control" placeholder="Nafn" aria-label="Recipient's username" aria-describedby="button-addon2"/>
          <div className="input-group-append">
            <button className="btn btn-primary" type="submit" id="button-addon2">Login</button>
          </div>
        </div>
      </form>);
  }
}

export default ChatInput;
