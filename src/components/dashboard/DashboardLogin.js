import React, { Component } from 'react';

class DashboardLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    const email = this.state.email;
    const password = this.state.password;
    const firebase = this.props.fb;

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error(errorCode + ': ' + errorMessage)
    });

    this.props.setUser('viktor');
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="input-group mb-3">
          <label className="sr-only" htmlFor="inlineFormInput">Innskráning</label>
          <input value={this.state.email}     name="email"    onChange={this.handleChange} type="text"      className="form-control" placeholder="Netfang"  aria-label="Recipient's email" aria-describedby="button-addon2"/>
          <input value={this.state.password}  name="password" onChange={this.handleChange} type="password"  className="form-control" placeholder="Lykilorð" aria-label="Recipient's password" aria-describedby="button-addon2"/>
          <div className="input-group-append">
            <button className="btn btn-primary" type="submit" id="button-addon2">Skrá inn</button>
          </div>
        </div>
      </form>);
  }
}

export default DashboardLogin;
