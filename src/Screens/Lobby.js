import react from "react";
import { Button } from "@mui/material";
import Auth from "./Auth";

class Lobby extends react.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: undefined,
    };
  }

  componentDidMount() {
    fetch(this.props.server_url + "/api/rooms/all", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((data) => {
        this.setState({ rooms: data });
      });
    });
  }

  render() {
    return (
      <div>
        <Button variant="contained" onClick={() => {
          fetch(this.props.server_url + "/api/auth/logout", {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }).then(() => {
            return (
            <div>
              <Auth server_url={this.props.server_url} changeScreen="auth"/>
            </div>)
          }).then(() => window.location.reload())
        }}> Logout </Button>
        <h1>Lobby</h1>
        {this.state.rooms
          ? this.state.rooms.map((room) => {
              return (
                <Button
                  variant="contained"
                  key={"roomKey" + room}
                  onClick={() => alert(room)}
                >
                  {room}
                </Button>
              );
            })
          : "loading..."}
        {/* write codes to join a new room using room id*/}
        {/* write codes to enable user to create a new room*/}
      </div>
    );
  }
}

export default Lobby;
