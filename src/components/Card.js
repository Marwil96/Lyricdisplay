import React, { Component } from 'react';
import '../App.css';

class Card extends Component {
  render() {
    const track = this.props.track.track
    return (
     <div className="card" onClick={() => {this.props.onClick(track)}}>
        <img src={track.album_coverart_100x100} />     
        <h2>{track.artist_name} </h2>
        <h3>{track.track_name} </h3>
        <h3>{track.album_name} </h3>
      </div>
    );
  }
}

export default Card;
