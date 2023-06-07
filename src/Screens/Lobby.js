import react from "react";
import { Button } from "@mui/material";
import Auth from "./Auth";
import { io } from "socket.io-client";

class Lobby extends react.Component {
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
      username: "",
      rooms: undefined,
      screen: "",
      room: "",
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

  roomSelect = (room, username) => {
    this.socket.emit("join", { room: room, username: username });
    this.setState({ username: username, room: room, screen: "chatroom" });
    this.props.changeScreen("chatroom");
  };

  createRoom = (data) => {
    document.getElementById("room-name").value = "";
    fetch(this.props.server_url + "/api/rooms/create", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomName: data }),
    }).then((res) => {
      res.json().then((data) => {
        // if (data.status === false) {
        //   console.log("failed to make room");
        // } else {
        //   alert(`${this.state.room} room created`);
        //   window.location.reload();
        // }
        window.location.reload();
      });
    });
  };

  render() {
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
        <div>
          <Button
            variant="contained"
            onClick={() => this.createRoom(this.state.room)}
          >
            Create Room
          </Button>
          <input
            type="search"
            id="room-name"
            placeholder="Enter room name to create..."
            style={{ width: "300px" }}
            onChange={(e) => {
              this.state.room = e.target.value;
            }}
          ></input>
        </div>
        <h1>Lobby</h1>
        {this.state.rooms
          ? this.state.rooms.map((room) => {
              return (
                <Button
                  variant="contained"
                  key={"roomKey" + room}
                  onClick={() => this.roomSelect(room, this.username)}
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
