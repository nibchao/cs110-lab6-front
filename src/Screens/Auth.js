import react from "react";
import Form from "../Components/form.js";
import { Button } from "@mui/material";

class Auth extends react.Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      selectedForm: undefined,
    };
  }

  closeForm = () => {
    this.setState({ showForm: false });
  };

  login = (data) => {
    fetch(this.props.server_url + "/api/auth/login", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      res.json().then((data) => {
        if (data.message === "Logged in") {
          this.props.changeScreen("lobby");
        } else {
          alert(data.message);
        }
      });
    });
  };

  register = (data) => {
    fetch(this.props.server_url + "/api/auth/register", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      res.json().then(() => {
        alert("Account created");
        this.props.changeScreen("auth");
        window.location.reload();
      });
    });
  };

  render() {
    let display = null;
    if (this.state.showForm) {
      let fields = [];
      if (this.state.selectedForm === "login") {
        fields = ["username", "password"];
        display = (
          <Form
            fields={fields}
            close={this.closeForm}
            type="login"
            submit={this.login}
            key={this.state.selectedForm}
          />
        );
      } else if (this.state.selectedForm === "register") {
        fields = ["username", "password", "email"];
        display = (
          <Form
            fields={fields}
            close={this.closeForm}
            type="register"
            submit={this.register}
            key={this.state.selectedForm}
          />
        );
      }
    } else {
      display = (
        <div>
          <Button
            onClick={() =>
              this.setState({ showForm: true, selectedForm: "login" })
            }
          >
            Login
          </Button>
          <Button
            onClick={() =>
              this.setState({ showForm: true, selectedForm: "register" })
            }
          >
            Register
          </Button>
        </div>
      );
    }
    return (
      <div>
        <h1> Welcome to our website! </h1>
        {display}
      </div>
    );
  }
}

export default Auth;
