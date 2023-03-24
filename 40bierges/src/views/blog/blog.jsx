import React from "react";
import { Redirect } from 'react-router-dom'


// core components
import '../../assets/css/main.css'

import tools from "../../toolBox"
import axios from "axios";


class Blog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      redirected: false,
      newMessage: "",
      messages: [],
      token: "",
      isLoading: true,
      url: "http://localhost:3001"
    };
    this.handleChange = this.handleChange.bind(this)
    this.handleSend = this.handleSend.bind(this)
  };

  componentDidMount() {
    if (tools.checkIfConnected()) {
      this.promisedSetState({ token: tools.readCookie("Token") }).then(result => {
        this.fetchData()
      })
    } else {
      this.setState({ redirected: true })
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSend(event) {
    axios.post(this.state.url + '/blog', {
      message: this.state.newMessage
    }, {
      headers: {
        'token': this.state.token
      }
    }).then(response => {
      if (response.status === 200) {
        

        let tmp = this.state.messages
        tmp.push(this.state.newMessage)
        this.setState({ messages: tmp, newMessage: "" })
      } else {
        alert("error " + response.status)
      }
    }).catch(error => {
      console.log(error)
    });
  }

  promisedSetState = (newState) => new Promise(resolve => this.setState(newState, resolve));

  fetchData() {
    axios.get(this.state.url + '/blog', {
      headers: {
        'token': this.state.token
      }
    }).then(response => {
      this.setState({
        messages: response.data,
        isLoading: false
      })
    }).catch(error => {
      console.log(error)
    });
  }

  indexRedirection(){
    window.location.href = "http://localhost:3000/index";
  }

  logout(){
    // retrieve all cookies
    var Cookies = document.cookie.split(';');
    // set past expiry to all cookies
    for (var i = 0; i < Cookies.length; i++) {
      document.cookie = Cookies[i] + "=; expires="+ new Date(0).toUTCString();
    }
    window.location.href = "";
  }

  render() {
    if (this.state.redirected) return (<Redirect to="/index" />)
    if (this.state.isLoading) return (<p>Please wait...</p>);
    return (
      <>
        <div className={"w-full p-4"}>
          <button className={"rounded bg-blue-600 p-2 font-mono text-white"} onClick={this.logout}>logout</button>
              <div className={"container mt-2"}>
                <button className={"rounded bg-blue-600 p-2 font-mono text-white"} onClick={this.indexRedirection}>accueil</button>
              </div>
          <div className="container mx-auto p-8">
            <h1 className={"text-center font-mono text-blue-600 text-2xl py-4"}>
              Welcome to our wonderful blog
            </h1>
            <p className={"text-center text-2xl py-4"}>&#128526;</p>
            <div className="p-6 bg-blue-600 rounded w-80 mx-auto">
            <textarea className={"w-full"} name="newMessage" value={this.state.newMessage} onChange={this.handleChange}></textarea>
            <button onClick={this.handleSend}>Poster ce nouveau message</button>
            {this.state.messages.map((message, index) => {
              return (
                <div key={index}>
                  <p>{index+1}. <span dangerouslySetInnerHTML={{ __html: message }}></span>{}</p>
                </div>
              )
            })}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Blog;