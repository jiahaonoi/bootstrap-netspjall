import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import firebase from "firebase";
import ifvisible from 'ifvisible.js'
import Chat from './components/Chat';
import Login from './components/Login';
import Logout from './components/Logout';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';

// Required for side-effects
require("firebase/firestore");

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAFN8mXX65_gnvHfiy5NkYr9HVOFVkbzmI",
  authDomain: "bootstrap-spjall.firebaseapp.com",
  databaseURL: "https://bootstrap-spjall.firebaseio.com",
  projectId: "bootstrap-spjall",
  storageBucket: "bootstrap-spjall.appspot.com",
  messagingSenderId: "337351862492"
};
firebase.initializeApp(config);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: '',
      name: '',
      lastActive: new Date()
    };
  }

  resetState = () => {this.setState({
    uid: '',
    name: '',
  })}

  componentDidMount() {

    var user = firebase.auth().currentUser;
    console.log(user);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('User is signed in.' + user.displayName);
        // User is signed in.
        var uid = user.uid;
        this.setState({uid})
        this.setUserName(this.state.name);
        this.setToQueue(uid);
      } else {
        // User is signed out.
        console.log('signed out');
      }
      // ...
    });

    // Check every n seconds check if user is inactive
    ifvisible.setIdleDuration(5);
    ifvisible.on("wakeup", ()=>{
      if(this.state.uid) this.setUserOnline(this.state.uid);
    });

  }

  componentDidUpdate(){
    function setMessageHeight(){
      if(!document.getElementById('header') || !document.getElementById('footer')) return;
      const headerHeight = document.getElementById('header').offsetHeight;
      const footerHeight = document.getElementById('footer').offsetHeight;
      const windowHeight = document.documentElement.clientHeight;
      const margin = 100;
      const messagesHeight = windowHeight-headerHeight-footerHeight-margin+'px';
      document.getElementById('messages').style.height = messagesHeight;
    }
    setMessageHeight();
    window.addEventListener('resize', function(){
      setMessageHeight();
    }, true);
  }

  setToQueue = (uid) => {
    if(!this.state.name) return;
    // Initialize Cloud Firestore through Firebase
    var db = firebase.firestore();

    const name = this.state.name;
    const date = new Date();

    // Add a new document with a generated id.
    db.collection('queue/').add({
      uid,
      date,
      name,
    })
    .then(function(docRef) {
      console.log("Set to queue written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error connecting to Q document: ", error);
    });

    
  }

  setUserInfo = (name) => {

    console.log('setting user info');
    this.setState({name})
  }

  setUserName = (displayName) => {

    var user = firebase.auth().currentUser;
    user.updateProfile({
      displayName
    }).then(function() {
      console.log('// Update info successful. ');
    }).catch(function(error) {
    console.error('// An error updating info happened.');
    });

  }

  setUserOnline = (uid) => {
    // Initialize Cloud Firestore through Firebase

    var db = firebase.firestore();

    // Add a new document in collection
    db.collection("users").doc(uid).set({
      lastActive: new Date(),
    }, { merge: true })
    .then(function() {
      console.log("User online status successfully written!");
    })
    .catch(function(error) {
      console.error("Error setting online status document: ", error);
    });
  }

  setLatestMessage = (uid, message) => {
    // Initialize Cloud Firestore through Firebase

    var db = firebase.firestore();
    // Add a new document in collection
    db.collection("users").doc(uid).set({
      latestMessage: message,
    }, { merge: true })
    .then(function() {
      console.log("User message latest successfully written!");
    })
    .catch(function(error) {
      console.error("Error setting latest message document: ", error);
    });
  }

  render() {
    return (
      <Switch>
        {this.state.uid ?  
        <Route exact path="/" render={props => ( 
          <Chat 
          fb={firebase} 
          uid={this.state.uid} 
          displayName={this.state.name} 
          reset={this.resetState} 
          setLatestMessage={this.setLatestMessage}
          {...props} /> )} />
        :
        <Route exact path="/" render={props => ( <Login fb={firebase} setUserInfo={this.setUserInfo} {...props} /> )} />
        }
        <Route path="/dashboard" render={props => ( <Dashboard  fb={firebase} setLatestMessage={this.setLatestMessage} {...props} /> )} />
        <Route path="/logout" render={props => ( <Logout  fb={firebase} {...props} /> )} />
      </Switch>
      
    );
  }
}

export default App;
