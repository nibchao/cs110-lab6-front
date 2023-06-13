import React from "react";
import { Button } from "@mui/material";
import Auth from "./Auth";
import { io } from "socket.io-client";
import Form from "../Components/form";

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
      showForm: false,
    };
  }

  componentDidMount() {

  }

  editProfileSubmit = () => {
    console.log('edit profile submitted');
  }

  closeForm = () => {
    this.setState({ showForm: false });
  };

  render() {
    let fields=['username', 'new username'];
    return (
      <div>
        <h1>Hi</h1>
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
        
        <Form fields={fields}
            close={this.closeForm}
            type="Edit Profile Form"
            submit={this.editProfileSubmit}
            key={'editprofile'}></Form>
        <h1>Edit Profile</h1>
      </div>
    );
  }
}

export default EditProfile;
