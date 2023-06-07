import React from "react";
import { Button } from "@mui/material";
import Auth from "./Auth";
import { io } from "socket.io-client";
import Chatroom from "./Chatroom";

class Lobby extends React.Component {
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
      selectedRoom: null,
    };
  }

  componentDidMount() {
    fetch(this.props.server_url + "/api/rooms/all", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ rooms: data });
      });
  }

  handleRoomSelect = (room) => {
    const { username } = this.state;
    this.setState({ selectedRoom: room, screen: "chatroom" });
    this.socket.emit("join", { room, username });
  };

  handleBackToLobby = () => {
    const { selectedRoom, username } = this.state;
    this.setState({ selectedRoom: null, screen: "", username: "" });
    this.socket.emit("leave", { room: selectedRoom, username });
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
    const { rooms, selectedRoom, screen } = this.state;

    if (screen === "chatroom") {
      return (
        <Chatroom
          roomID={selectedRoom}
          changeScreen={this.handleBackToLobby}
        />
      );
    }

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
        {rooms ? (
          rooms.map((room) => (
            <Button
              variant="contained"
              key={"roomKey" + room}
              onClick={() => this.handleRoomSelect(room)}
            >
              {room}
            </Button>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }
}

export default Lobby;