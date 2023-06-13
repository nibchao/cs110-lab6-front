import React from "react";
import { Button } from "@mui/material";
import Auth from "./Auth";
import { io } from "socket.io-client";
import Chatroom from "./Chatroom";
import UserProfile from "./UserProfile";
import { useNavigate } from 'react-router-dom';
//import { BrowserRouter as Router, Route } from 'react-router-dom';

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
      showProfile: false
    };
    this.handleShowProfile = this.handleShowProfile.bind(this);
    this.handleShowLobby = this.handleShowLobby = this.handleShowLobby.bind(this);
    }
  
    handleShowProfile() {
      this.setState({
        showProfile: true
      });
      this.socket.emit("getUser", {username: this.state.username });
    }
 
    handleShowLobby() {
      this.setState({
        showProfile: false
      });
    }

    // handleGetUserInfo() {
    //   fetch(this.props.server_url + "/api/users/profile", {
    //     method: "GET",
    //     credentials: "include",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   })
    //     .then((res) => res.json())
    //     .then((data) => {
    //       this.setState({ rooms: data });
    //     });
    //   });
    // }

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
    console.log(data);
    if (document.getElementById("room-name").value === "") {
      console.log("input was empty, not creating room");
    } else {
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
          // this.setState({  })
          window.location.reload();
        });
      });
    }
  };

  joinRoom = (data) => {
    if (document.getElementById("join-room-name").value === "") {
      console.log("input was empty, not joining room");
    } else {
      document.getElementById("join-room-name").value = "";
      fetch(this.props.server_url + "/api/rooms/join", {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: this.state.username, roomName: data }),
      })
        .then((res) => res.json())
        .then((data) => {
          this.setState({ room: data });
          window.location.reload();
        });
    }
  };

  leaveRoom = (data) => {
    if (document.getElementById("leave-room-name").value === "") {
      console.log("input was empty, did not leave room");
    } else {
      document.getElementById("leave-room-name").value = "";
      fetch(this.props.server_url + "/api/rooms/leave", {
        method: "DELETE",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: this.state.username, roomName: data }),
      })
        .then((res) => res.json())
        .then((data) => {
          this.setState({ room: data });
          window.location.reload();
        });
    }
  };


  // handleProfClick = () => {
  //   const { username } = this.state;
  //   this.setState({screen: "profile" });
  //   //this.socket.emit("join", { room, username });
  // };
   
 
  

  render() {
    const { rooms, selectedRoom, screen } = this.state;

    if (screen === "chatroom") {
      return (
        <Chatroom
          roomID={selectedRoom}
          changeScreen={this.handleBackToLobby}
          server_url={this.props.server_url}
          username={this.state.username}
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
            onClick={() => this.createRoom(this.state.room)} // don't change "this.state.room" because it breaks otherwise, works as is for some reason
          >
            Create Room
          </Button>
          <input
            type="search"
            id="room-name"
            placeholder="Enter room name to create..."
            style={{ width: "300px" }}
            onChange={(e) => {
              this.setState({ room: e.target.value });
            }}
          ></input>
        </div>
        <div>
          <Button
            variant="contained"
            onClick={() => this.joinRoom(this.state.room)}
          >
            Join Room
          </Button>
          <input
            type="search"
            id="join-room-name"
            placeholder="Enter room name to join..."
            style={{ width: "300px" }}
            onChange={(e) => {
              this.setState({ room: e.target.value });
            }}
          />
        </div>

        <div>
          <Button
            variant="contained"
            onClick={() => this.leaveRoom(this.state.room)}
          >
            Leave Room
          </Button>
          <input
            type="search"
            id="leave-room-name"
            placeholder="Enter room name to leave..."
            style={{ width: "300px" }}
            onChange={(e) => {
              this.setState({ room: e.target.value });
            }}
          />
        </div>
        

      <div className="LobbyTest">
        {this.state.showProfile ? (
          <>
            <UserProfile userId={this.state.username} />
            <button onClick={this.handleShowLobby}> Return to Lobby </button>
          </>
          ) : ( 
            <>
              <h1> Profiles </h1>
              <button onClick={this.handleShowProfile}> Edit Profile </button>

            </>
        )}
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
