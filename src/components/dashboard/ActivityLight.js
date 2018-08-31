import React, { Component } from 'react';

class ActivityLight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false, 
      lastActive: ''};
  }
  componentDidMount(){
    var db = this.props.fb.firestore();
    db.collection("users").doc(this.props.uid)
    .onSnapshot((doc) => {
      let lastActive;
      if(doc.data()) lastActive = doc.data().lastActive;
      this.setState({lastActive});
    });
    
    var intervalID = window.setInterval(
      () => {
        const now = Date.now();
        const then = this.state.lastActive;
        const between = now-then;
        // if user was last active in the last minute
        if(between < 60000) this.setState({isActive: true})
        else this.setState({isActive: false})
      }
      , 1000);

  }


  render() {

    return (
      <React.Fragment>{this.state.isActive ? 
      <i className="fas fa-check-circle text-success">&nbsp;</i> 
      : 
      <i className="fas fa-question-circle text-warning">&nbsp;</i>}</React.Fragment>
      )
  }
}

export default ActivityLight;
