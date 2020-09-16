import React, { Component } from 'react'
import RegistrationForm from "../forms/RegistrationForm";
import { register } from "../services/userService";

export default class Registration extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  state = {
    formData: {
      email: '',
      firstName: '',
      lastName: '',
      password: ''
    }
  }

  register() {

    register(this.state.formData)
    .then((res) => {
      if (!res.ok) {
        alert(res.response.data);
        return;
      }

      alert("Successfully registered!");

    })
    .catch((err) => {
      console.log(err);
    } )
  }

  onChange = (event) => {
    const { formData } = this.state;
    formData[event.target.name] = event.target.value;

    this.setState({ formData });
  }


  render() {
    return (
      <div id="register">
        <RegistrationForm
          onSubmit={() => this.register()}
          onChange={this.onChange}
          formData={this.state.formData}
        ></RegistrationForm>

      </div>
    )
  }
}
