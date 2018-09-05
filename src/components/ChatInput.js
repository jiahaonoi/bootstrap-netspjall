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

    // Check if there is an image to upload
    var file = document.getElementById('picture').files[0];
    if(file){
      // Create a root reference
      var storageRef = firebase.storage().ref();

    // Create the file metadata
    var metadata = {
      contentType: 'image/jpeg'
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function(error) {

      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;

        case 'storage/canceled':
          // User canceled the upload
          break;

        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    }, function() {
      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log('File available at', downloadURL);
        var x = document.createElement("img");
        x.setAttribute("src", downloadURL);
        x.setAttribute("alt", "Uploaded image");
        file = document.getElementById('footer').appendChild(x);
      });
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
          <input value={this.state.value} onChange={this.handleChange} type="text" className="form-control" placeholder="Skilaboð..." aria-label="Recipient's username" aria-describedby="button-addon2" style={{borderRight: '0'}}/>
          <label class="btn btn-outline-primary" style={{marginBottom: '0', borderRadius: '0'}}>
          <i class="fas fa-camera"></i><input type="file" id="picture" accept=".jpg, .jpeg, .png" hidden/>
            </label>
          <div className="input-group-append">
            
            <button className="btn btn-primary" type="submit" id="button-addon2">Senda</button>
          </div>
        </div>
      </form>);
  }
}

export default ChatInput;
