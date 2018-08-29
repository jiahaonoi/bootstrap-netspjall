import React, { Component } from 'react';

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
    this.props.setClientID(this.props.item.uid);
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
      <div className="card" onClick={this.setID}>
        <div className="card-body">
          {this.props.item.name} {minutes}:{seconds}
        </div>
      </div>
      )
  }
}

export default QueueItem;
