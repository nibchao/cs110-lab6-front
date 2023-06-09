import React from "react";
import { io } from "socket.io-client";
import { Button } from "@mui/material";

class Chatroom extends React.Component {
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
      messages: [],
      text: "",
    };
  }

  componentDidMount() {
    const { roomID } = this.props;
    this.socket.emit("join", { room: roomID });

    this.socket.on("chat message", (message) => {
      if (message.room === roomID) {
        this.handleReceivedMessage(message);
      }
    });

    // Fetch initial messages from the server if needed
    // ...
    fetch(this.props.server_url + "/api/rooms/messages", {
      method: "GET",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((data) => {
        //console.log('fetched data:', data)
        // data.message 
        // message: {
        //   text: { type: String, required: true },
        // },

        // data.sender
        // sender: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: "User",
        //   required: true,
        // },

        // data.room
        // room: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: "Room",
        //   required: true,
        // },

        this.setState({ messages: data });
      });
    });
  }

  componentWillUnmount() {
    const { roomID } = this.props;
    this.socket.emit("leave", { room: roomID });
    this.socket.off("chat message");
  }

  handleReceivedMessage = (message) => {
    this.setState((prevState) => ({
      messages: [...prevState.messages, message.text],
    }));
  };

  sendMessage = () => {
    const { text } = this.state;
    const { roomID } = this.props;
    this.socket.emit("chat message", { room: roomID, text, username: this.props.username });
    this.setState({ text: "" });
  };

  handleTextChange = (e) => {
    this.setState({ text: e.target.value });
  };

  back = () => {
    this.props.changeScreen("lobby");
  };

  render() {
    // const { messages } = this.state;
    return (
      <div>
        <h1>Chatroom</h1>
        <ul>
          {this.state.messages.map((message) => (
            <li key={"messageKey" + message}>{message}</li>
          ))}
        </ul>
        <input
          type="text"
          id="text"
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <Button onClick={this.sendMessage}>Send</Button>
        <Button onClick={this.back}>Back</Button>
      </div>
    );
  }
}

export default Chatroom;