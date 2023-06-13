import React from "react";
import { Button } from "@mui/material";
import Auth from "./Auth";
import { io } from "socket.io-client";
import Form from "../Components/form";
import { Avatar } from '@mui/material';

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io("http://localhost:3001", {
      cors: {
        origin: "http://localhost:3001",
        credentials: true,
      },
      transports: ["websocket"],
    });
    this.state = {
      newUsername: "",
    };
  }

  componentDidMount() {}

  editProfileSubmit = (data) => {
    fetch(this.props.server_url + "/api/auth/newUsername", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        res.json().then((data) => {
          alert(data.message);
          return (
            <div>
              <Auth server_url={this.props.server_url} changeScreen="auth" />
            </div>
          );
        });
      })
      .then(() => window.location.reload());
  };

  handleTextChange = (e) => {
    this.setState({ text: e.target.value });
  };

  logout = () => {
    fetch(this.props.server_url + "/api/auth/logout", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        return (
          <div>
            <Auth server_url={this.props.server_url} changeScreen="auth" />
          </div>
        );
      })
      .then(() => window.location.reload());
  };

  render() {
    let fields = ["NewUsername"];
    let display = (
      <div>
        <Form
          fields={fields}
          close={this.logout}
          type="Edit Profile Form"
          submit={this.editProfileSubmit}
          onChange={this.handleTextChange}
          key={"editprofile"}
        />
        <input
          accept="image/*"
          className={classes.input}
          id="contained-button-file"
          multiple
          type="file"
        />
        <label htmlFor="contained-button-file">
          <IconButton>
            <Avatar 
                src="/images/example.jpg" 
                style={{
                  margin: "10px",
                  width: "60px",
              height: "60px",
        }} 
    />
  </IconButton>
</label>
      </div>
    );
    return (
      <div>
        <Button
          variant="contained"
          onClick={() => {
            fetch(this.props.server_url + "/api/auth/logout", {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then(() => {
                return (
                  <div>
                    <Auth
                      server_url={this.props.server_url}
                      changeScreen="auth"
                    />
                  </div>
                );
              })
              .then(() => window.location.reload());
          }}
        >
          Logout
        </Button>
        <h1>Edit Profile</h1>
        {display}
      </div>
    );
  }
}

export default EditProfile;
