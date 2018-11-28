import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Lottie from 'react-lottie';
import * as animationData from './img/checked_done_.json';

import Card from './components/Card.js';
import LyricsView from './components/LyricsView.js';

var heroku = "https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/";
var apikey = "apikey=94570a0bd8689a580e15db8fd9de328d";

const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: require('./img/data.json'),
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

class App extends Component {
  state = {
    data: {},
    lyrics: "",
    trackList: [],
    inputValue:"",
    lyricsViewStyle: "lyricsView",
    selectedSong: {},
    loadingLyrics:false,
    loadingSongs: false,
    isStopped: false, 
    isPaused: false,
    isStopped: false, 
    isPaused: false
  }

  renderAlbumCovers(track) {
    track.map(track =>{
    return (
      <div>
        <h1> Woha </h1>
        <h2>{track.album_name} </h2>
        <h2>{track.artist_name} </h2>
        <h3>{track.track_name} </h3>
        <img src={track.album_coverart_100x100} />
      </div>
      )
    })
  }
  searchForSong(term) {
    axios.get(heroku + `track.search?q_track=`+ term + `&page_size=12&page=1&s_track_rating=desc&`+ apikey)
      .then(res => {
        this.setState({
          data: res.data,
          trackList:res.data.message.body.track_list,
          loadingSongs: false
        })
      })
      .catch(err => console.log("error",err))
  }
  getLyrics(trackId) {
    axios.get(heroku + `matcher.lyrics.get?format=json&callback=callback&q_track=`+ trackId.track_name +`&`+ apikey)
      .then(res => {
        this.setState({
          data: res.data,
          lyrics:res.data.message.body.lyrics.lyrics_body,
          selectedSong:trackId,
          loadingLyrics: false
        })
      })
      .catch(err => {
        console.log("error",err)
        this.setState({
          lyrics:"error",
          loadingLyrics: false
        })
      })
  }
  handleChange(event) {
    this.setState({
      inputValue: event.target.value,
      loadingSongs:true
    })
    this.searchForSong(event.target.value)
  }
  artistClick(trackId) {
    this.getLyrics(trackId)
     this.setState({
          lyricsViewStyle: "lyricsView lyricsViewDisplayed",
          loadingLyrics: true
        })
  }
  closeLyricsView() {
    this.setState({
          lyrics:"",
          lyricsViewStyle: "lyricsView lyricsViewClosed",
          selectedSong:{}
        })
  }
  loadingSpinner(loading) {
    if(loading === true) {
      // return (<h1 className="loadingHeader"> Loading </h1>)
      return (
        <div className="animationContainer"> 
        <Lottie options={defaultOptions}
              height={400}
              width={400}
              isStopped={this.state.isStopped}
              isPaused={this.state.isPaused}/>
      </div> 
        )
    }
    else {
      return null
    }
  }
  render() {
    return (
      <div className="App">       
      <LyricsView style={this.state.lyricsViewStyle} track={this.state.selectedSong} lyrics={this.state.lyrics} onClick={this.closeLyricsView.bind(this)} loading={this.state.loadingLyrics}/>
      <h1 className="header"> Search for lyrics </h1>
       <input type="text" placeholder="Type in song title" onChange={this.handleChange.bind(this)} />
        {this.renderAlbumCovers(this.state.trackList)}
        {this.loadingSpinner(this.state.loadingSongs)}
        <div className="cardContainer">
        { this.state.trackList.map(track =>{
         return <Card track={track} onClick={this.artistClick.bind(this)} />
        })}
        </div>
       <h3>{this.state.lyrics}</h3>
      </div>
    );
  }
}

export default App;
