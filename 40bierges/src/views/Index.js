import React from "react";
import { Redirect } from 'react-router-dom'

// core components
import '../../src/assets/css/site.css'
import axios from "axios";
import tools from "../toolBox"

import ButtonUser from "../components/ButtonUser";

class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showSecret: false,
      redirected: false,
      token: "",
      mail: "",
      secret: "",
      isAdmin: false,
      isLoading: true,
      url: "http://localhost:3001"
    };
    this.toggleSecret = this.toggleSecret.bind(this)
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

  toggleSecret() {
    this.setState({ showSecret: !this.state.showSecret })
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

  blogRedirection(){
    window.location.href = "http://localhost:3000/blog";
  }
  fetchData() {
    axios.get(this.state.url + '/user', {
      headers: {
        'token': this.state.token
      }
    }).then(response => {
      this.setState({
        mail: response.data.mail,
        secret: response.data.secret,
        isLoading: false
      })
    }).catch(error => {
      console.log(error)
    });
  }

  promisedSetState = (newState) => new Promise(resolve => this.setState(newState, resolve));

  render() {
    if (this.state.redirected) return (<Redirect to="/login" />)
    if (this.state.isAdmin) return (<Redirect to="/admin" />) 
    if (this.state.isLoading) return (<p>Please wait...</p>);
    return (
      <>
        <div className={"w-full p-4"}>
            <button className={"rounded bg-blue-600 p-2 font-mono text-white"} onClick={this.logout}>logout</button>
            <div className={"container mt-2"}>
              <button className={"rounded bg-blue-600 p-2 font-mono text-white"} onClick={this.blogRedirection}>blog</button>
            </div>
            <div className={"container mx-auto p-8"}>
              <div className={"w-80 mx-auto rounded bg-blue-400 p-4 font-mono"}>
                Ravi de te voir <span className={"text-white font-bold"}>{this.state.mail}</span>,
                <ButtonUser handleClick={this.toggleSecret} />
                {this.state.showSecret ? <div className={"py-4 text-center bg-white rounded p-4"} >{this.state.secret}</div> : <div>***************</div>}
              </div>
            </div>
        </div>
      </>
    )
  }
}

export default Index;
