import React, { Component } from 'react';


import './Video.css';


class Video extends Component {


  componentDidMount() {
    this.refs.vidRef.playbackRate = 5;
    this.refs.vidRef.play()
  }


  onClickEvent = () => {

    this.props.openAction(this.props.post);

  }


  render() {

    return (

      <video playsInline="playsinline webkit-playsinline" muted="muted" loop="loop" className="square"
        ref="vidRef"

        onClick={this.onClickEvent}
      >
        <source src={this.props.post.filePath} type="video/mp4" />
      </video>

    );
  }
}

export default Video;
