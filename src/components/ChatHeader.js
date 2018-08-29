import React, { Component } from 'react';
import profile from '../man.svg';

class Chat extends Component {
  render() {
    return (
      <div className="card" id="header">
        <div className="card-body">
            <div className="row align-items-center">
        <div className="col-md-auto d-none d-sm-none d-md-block">
          <img alt="Profile" src={profile} width="96" height="96" />
        </div>
        <div className="col">
        {this.props.agent ? <i className="fas fa-check-circle text-success">&nbsp;</i> : ''}
          <span className="lead text-muted">{this.props.agent ? 'Á línunni' : 'Augnablik'}</span>
          <h2>{this.props.agent ? this.props.agent : 'bíð eftir fulltrúa...'}</h2>
        </div>
      </div>
    </div>
    </div>
    );
  }
}

export default Chat;
