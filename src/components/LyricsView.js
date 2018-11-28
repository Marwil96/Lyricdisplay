import React, { Component } from 'react';
import '../App.css';
import Sentiment from 'sentiment';
import { format } from 'date-fns';
import moment from 'moment';
import Lottie from 'react-lottie';

const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: require('../img/data.json'),
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

class LyricsView extends Component {
    state= {
      attitude: "undefined"
    }

    loadingSpinner(loading) {
    var height = (window.innerHeight/100) * 100;
    if(loading === true) {
      // return (<h1> Loading </h1>)
      return (
        <div className="animationContainerLyrics"> 
        <Lottie options={defaultOptions}
              height={height}
              width={400}
              isStopped={this.state.isStopped}
              isPaused={this.state.isPaused}/>
      </div> )
    }
    else {
      return null
    }
  }
  noContent(lyrics) {
    if(lyrics === "error") {
      console.log("ly")
      return (
        <div className="lyricsLoadingContainer">
          <img src="https://media1.tenor.com/images/7f1d9dfb496694a771a9bf9b96f3662d/tenor.gif?itemid=5943128" />
          <h1> Lyrics not found </h1>
        </div>
        )
    }
  }
  checkAttitude(lyrics) {
  var sentiment = new Sentiment();
    var result = sentiment.analyze(lyrics);
    console.log(result); 
    if(result.score > 1) {
      return <div className="informationContainer"><h3> Attitude </h3> <h1> Happy </h1></div>
    } else if(result.score < -1) {
      return <div className="informationContainer"><h3> Attitude </h3> <h1> Sad </h1></div>
    } else {
      return null
    }
  }
  renderStatsContainer(lyrics) {
    const track = this.props.track;
   const time = moment.utc(track.track_length*1000).format('mm:ss');
    console.log(time)
    if(lyrics === "error" || this.props.loading === true) {
      return null
    } else {
    return (
      <div className="statsContainer">
            <div className="informationContainer"><h3> Length </h3> <h1> {time} </h1> </div> 
           {this.checkAttitude(lyrics)}
            <div className="informationContainer"><h3> Release Date </h3> <h1> {format( new Date(track.first_release_date),'MM/DD/YY')} </h1> </div> 
          </div>
      )
    }
  }
  render() {
    console.log("LyricsView", this.props.lyrics)
    const track = this.props.track;
    console.log(track)
    return (
     <div className={this.props.style}>
       <div className="lyricsContainer">
        <h4 className="closeWindow" onClick={() => {this.props.onClick()}}> close </h4>
         <div> 
         {this.loadingSpinner(this.props.loading)}
         {this.noContent(this.props.lyrics)}
         <h2>{track.artist_name} </h2>
          <h3>{track.track_name} </h3>
          <h3>{track.album_name} </h3>
          </div>
          <p> {this.props.lyrics} </p> 
          </div>
          {this.renderStatsContainer(this.props.lyrics)}
      </div>
    );
  }
}

export default LyricsView;
