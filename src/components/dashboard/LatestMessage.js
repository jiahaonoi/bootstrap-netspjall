import React, { Component } from 'react';

class LatestMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
  }
  componentDidMount(){
    var db = this.props.fb.firestore();
    db.collection("users").doc(this.props.uid)
    .onSnapshot((doc) => {
      let message;
      if(doc.data()) message = doc.data().latestMessage;
      this.setState({message});
    });
  }


  componentWillUnmount(){
    var firebase = this.props.fb;
    var db = firebase.firestore();
    var unsubscribe = db.collection("users").doc(this.props.uid)
    .onSnapshot(function () {});
    // ...
    // Stop listening to changes
    unsubscribe();

  }

  

  render() {

    return (
        <React.Fragment>{this.state.message}</React.Fragment>
    );
  }
}

export default LatestMessage;
