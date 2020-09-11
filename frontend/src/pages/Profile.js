import React, { Component } from 'react'
import { Button, Avatar } from "@material-ui/core";
import { uploadProfileImage } from "../services/userService";
import { updateProfileImage, getUserFromLocalStorage } from "../base/Auth";

export default class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: null
    }

  }

  componentDidMount() {

    let user = getUserFromLocalStorage();
    this.setState({ user });
  }


  onFileChange(event) {

    let selectedFile = event.target.files[0];

    const formData = new FormData();

    formData.append("name", selectedFile.name);
    formData.append("file", selectedFile);


    uploadProfileImage(formData)
      .then(res => {
        if (!res.ok) {
          return;
        }
        this.setState({ user: { ...this.state.user, profileImageUrl: res.data } })
        updateProfileImage(res.data);
      })
      .catch(er => console.log(er))
  };


  render() {

    if (!this.state.user) {
      return <div></div>;
    }

    return (
      <div id="profile-page">
        <Avatar id="profile-image" src={this.state.user.profileImageUrl} alt="img"></Avatar>

        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          name="file"
          encType="multipart/form-data"
          onChange={(e) => this.onFileChange(e)}
        />
        <label htmlFor="raised-button-file">
          <Button component="span">
            Change photo
          </Button>
        </label>

        <div id="user-profile-info">
            <h3>{`${this.state.user.firstName} ${this.state.user.lastName}`}</h3>
            <h4>{`${this.state.user.email}`}</h4>
        </div>
      </div>
    )
  }
}
