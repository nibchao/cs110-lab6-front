import react from "react";
import { io } from "socket.io-client";
import { Button } from "@mui/material";

class Chatroom extends react.Component {
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
  // Establish a connection to the server
  this.socket = io("http://localhost:3001", {
    cors: {
      origin: "http://localhost:3001",
      credentials: true,
    },
    transports: ["websocket"],
  });

  // Set up event listener to receive chat messages
  this.socket.on("chat message", (message) => {
    // Update the state with the received message
    this.setState((prevState) => ({
      messages: [...prevState.messages, message],
    }));
  });
}

sendMessage = (text) => {
  this.socket.emit("chat message", text);
  this.setState((prevState) => ({
    messages: [...prevState.messages, text],
    text: "",
  }));
};

render() {
  return (
    <div>
      Chatroom
      <ul>
        {this.state.messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <input
        type="text"
        id="text"
        value={this.state.text}
        onChange={(e) => {
          this.setState({ text: e.target.value });
        }}
      ></input>
      <Button onClick={() => this.sendMessage(this.state.text)}>Send</Button>
      <Button onClick={this.back}>Back</Button>
    </div>
  );
}
}

export default Chatroom;
