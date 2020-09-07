import React, { Component } from "react";
import LoginForm from "../forms/LoginForm";
import { login } from "../services/userService";
import history from "../history";
import connect from "react-redux/es/connect/connect";
import {loadUser} from "../actions/AuthActions";

class Login extends Component {

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  state = {
    formData: {
      email: '',
      password: '',
    }
  }

  login() {
    login(this.state.formData.email, this.state.formData.password)
    .then((res) => {
      if (!res.ok) {
        alert("Wrong credentials");
        return;
      }
      this.props.loadUser()
      history.push("/home");
    })
    .catch((err) => {
      console.log(err);
    });

  }

  onChange = (event) => {
    const { formData } = this.state;
    formData[event.target.name] = event.target.value;
    this.setState({ formData });
  }


  render() {
    return (
      <div id="login">
        <h1>Login</h1>
        <LoginForm
          onSubmit={() => this.login()}
          onChange={this.onChange}
          formData={this.state.formData}
        ></LoginForm>

      </div>
    )
  }
}

export default connect(null, {loadUser})(Login);