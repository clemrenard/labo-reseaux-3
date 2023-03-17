import React from "react";
import { Redirect } from 'react-router-dom'


// core components
import '../../assets/css/main.css'

import tools from "../../toolBox"
import axios from "axios";


class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      redirected: false,
      redirectedAdmin: false,
      mail: "",
      password: "",
      url: "http://localhost:3001"
    };
    this.handleConnect = this.handleConnect.bind(this)
    this.handleChange = this.handleChange.bind(this)
  };

  componentDidMount() {
    if (tools.checkIfConnected()) {
      this.setState({ redirected: true })
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleConnect() {
    if (this.state.mail === '' || this.state.password === '') {
      alert('Please fill in all fields of the form')
      return;
    }
    if (!/\S+@\S+\.\S+/.test(this.state.mail)) {
      alert('The mail does not correspond to the right format')
      return;
    }
    axios.post(this.state.url + '/connection', {
      mail: this.state.mail,
      password: this.state.password
    }).then(response => {
      if (response.status === 200) {
        let d = new Date();
        d.setTime(d.getTime() + (3 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = "Token=" + response.data.token + ";" + expires + ";path=/"
        if (response.data.role === "user") {
          this.setState({ redirected: true })
        } else if (response.data.role === "admin") {
          this.setState({ redirectedAdmin: true })
        }
      } else {
        alert("error " + response.status)
      }
    }).catch(error => {
      console.log(error)
    });
  }

  render() {
    if (this.state.redirected) return (<Redirect to="/index" />)
    if (this.state.redirectedAdmin) return (<Redirect to="/admin" />)
    return (
      <>
        <div className="container mx-auto p-8">
          <h1 className={"text-center font-mono text-blue-600 text-2xl py-4"}>Ofc developed by Blue Team</h1>
          <p className={"text-center text-2xl py-4"}>&#128526;</p>
          <div className="p-6 bg-blue-600 rounded w-80 mx-auto">
            <div className="px-4 flex flex-col">
              <label htmlFor="mail" className={"text-white font-bold font-mono"}>Email</label>
              <input id="mail" type="text" name="mail" value={this.state.mail} className={"px-2 font-mono"} onChange={this.handleChange}></input>
            </div>
            <div className="px-4 flex flex-col">
              <label htmlFor="password" className={"text-white font-bold font-mono"}>Password</label>
              <input id="password" type="password" name="password" value={this.state.password}  className={"px-2 font-mono"} onChange={this.handleChange}></input>
            </div>
            <div className="p-4 flex flex-col">
              <button onClick={this.handleConnect} className={"ml-auto hover:opacity-60 font-bold rounded p-2 bg-black text-white font-mono"}>Se connecter</button>
            </div>

          </div>
        </div>

      </>
    )
  }
}

export default Login;
