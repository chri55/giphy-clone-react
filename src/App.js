import React, { Component } from 'react';
import axios from 'axios';
import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchLimit: 20,
      searchTerm: "",
      gifs: [],
    }
  }

  handleChange = (e) => {
    this.setState({searchTerm:e.target.value});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let cfg = {
      method:'get',
      url:'https://api.giphy.com/v1/gifs/search',
      params: {
        api_key:process.env.REACT_APP_API_KEY,
        q:this.state.searchTerm,
        limit:this.state.searchLimit,
      }
    }
    axios(cfg).then(res => res.data.data).then(gifList => this.setState({gifs: gifList}));
  }

  handleLoadMore = (e) => {
    e.preventDefault();
    let cfg = {
      method: 'get',
      url:'https://api.giphy.com/v1/gifs/search',
      params: {
        api_key:process.env.REACT_APP_API_KEY,
        q:this.state.searchTerm,
        limit:this.state.searchLimit,
        offset:this.state.gifs.length+1,
      }
    };
    axios(cfg).then(res => res.data.data).then(gifList => this.setState({gifs: [...this.state.gifs, ...gifList]}));
  }

  partitionGifList(colNum, totalCols) {
    const start = colNum * Math.floor(this.state.gifs.length / totalCols);
    const end = start + Math.floor(this.state.gifs.length / totalCols);
    return this.state.gifs.slice(start, end);
  }

  componentDidMount() {
    let cfg = {
      method:'get',
      url:'https://api.giphy.com/v1/gifs/trending',
      params: {
        api_key:process.env.REACT_APP_API_KEY,
        limit:20,
      }
    }
    axios(cfg).then(res => res.data.data).then(gifList => this.setState({gifs: gifList})).then(() => console.log(this.state));
  }

  render() {
    let cols = [];
    for (let i = 0; i < 4; i ++) {
      cols.push(this.partitionGifList(i, 4));
    }
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Search for gifs..." onChange={this.handleChange} />
          <input type="submit"  value="Search"/>
        </form>
        <div className="col-container">
          {cols.map(col => (
            <div className="col">
              {col.map(gif => (
                <img className="gif" src={`${gif ? gif.images.original.url : ""}`} alt={`${gif.title}`} key={`${gif.id}`} /> 
              ))}
            </div>
          ))}
        </div>
        <form onSubmit={this.handleLoadMore}>
          <input type="submit" value="Load More"/>
        </form>
        
      </div>
    );
  }
}

export default App;
