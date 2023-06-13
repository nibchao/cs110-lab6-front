import react from "react";
import Form from "../Components/form.js";
import { Button } from "@mui/material";

class Auth extends react.Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      selectedForm: undefined,
      generatedOTPToken: Date.now(),
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

  tempLogin = (data) => {
    fetch(this.props.server_url + "/api/auth/tempLogin", {
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
        if (data.status === true)
        {
          this.props.changeScreen("editprofile");
          // window.location.reload();
        }
        else
        {
          alert(data.message);
        }
      });
    });
  };

  otpToken = () => {
    // COMMENTED OUT TO MAKE LOGGING IN LESS ANNOYING
    // alert(
    //   "The generated OTP token to login will arrive in your email shortly."
    // );
    // fetch(this.props.server_url + "/api/auth/otptoken", {
    //   method: "POST",
    //   mode: "cors",
    //   credentials: "include",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Accept: "application/json",
    //   },
    //   body: JSON.stringify({ email: document.getElementById('email').value }),
    // }).then((res) => {
    //   res.json().then((data) => {
    //     this.setState({ generatedOTPToken: data.generatedOTP });
    //   });
    // });
  };

  render() {
    let display = null;
    if (this.state.showForm) {
      let fields = [];
      if (this.state.selectedForm === "login") {
        fields = ["email", "username", "password", "otpToken"];
        display = (
          <div>
            <Form
              fields={fields}
              close={this.closeForm}
              type="Login Form"
              submit={this.login}
              key={this.state.selectedForm}
              generatedOTP={this.state.generatedOTPToken}
            />
            <button onClick={this.otpToken}>Generate OTP Token to Login</button>
          </div>
        );
      } else if (this.state.selectedForm === "register") {
        fields = ["email", "username", "password"];
        display = (
          <Form
            fields={fields}
            close={this.closeForm}
            type="Register Form"
            submit={this.register}
            key={this.state.selectedForm}
          />
        );
      } else if (this.state.selectedForm === "editprofile") {
        fields = ["email", "username", "password"];
        display = (
          <Form
            fields={fields}
            close={this.closeForm}
            type="Edit Profile Login Form"
            submit={this.tempLogin}
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
          <Button
            onClick={() =>
              this.setState({ showForm: true, selectedForm: "editprofile" })
            }
          >
            Edit Profile
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
