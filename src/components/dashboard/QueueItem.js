import React, { Component } from 'react';
import ActivityLight from './ActivityLight';

class QueueItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: '',
    };
  }
  componentDidMount() {
    this.intervalID = setInterval(
      () => this.tick(),
      1000
    );
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }
  tick() {
    this.setState({
      time: Date.now()
    });
  }

  setID = () => {
    console.log('setid queitem')
    this.props.setClientID(this.props.item, this.props.id);
  }

  render() {
    const then = parseFloat(Date.parse(this.props.item.date))
    const now = parseFloat(this.state.time);
    const waitingMS = now-then; // ms
    const waitingSS = parseInt(waitingMS/1000); //seconds
    let minutes = Math.floor(waitingSS / 60);
    let seconds = waitingSS % 60;
    if(seconds<10) seconds = '0'+seconds;
    if (Number.isNaN(minutes)) minutes = '00';
    if (Number.isNaN(seconds)) seconds = '00';

    return (
      <button onClick={this.setID} type="button" class="list-group-item list-group-item-action">     
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">{this.props.item.name}</h5>
          <small>{minutes}:{seconds} <ActivityLight uid={this.props.item.uid} fb={this.props.fb}/></small>
        </div>
      </button>
      )
  }
}

export default QueueItem;
