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
      reactions: {},
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

    // Fetch initial reactions from the server if needed
    // ...

    // Example code to set initial reactions
    // const initialReactions = {}; // Replace with actual initial reactions data
    // this.setState({ reactions: initialReactions });
  }

  componentWillUnmount() {
    const { roomID } = this.props;
    this.socket.emit("leave", { room: roomID });
    this.socket.off("chat message");
  }

  handleReceivedMessage = (message) => {
    this.setState((prevState) => ({
      messages: [...prevState.messages, message],
      reactions: { ...prevState.reactions, [message.id]: [] },
    }));
  };

  addReaction = (messageId, reaction) => {
    const { reactions } = this.state;
    const updatedReactions = { ...reactions };

    if (!updatedReactions[messageId]) {
      updatedReactions[messageId] = [];
    }

    updatedReactions[messageId].push(reaction);

    this.setState({ reactions: updatedReactions });
  };

  sendMessage = () => {
    const { text } = this.state;
    const { roomID } = this.props;
    this.socket.emit("chat message", { room: roomID, text });
    this.setState({ text: "" });
  };

  handleTextChange = (e) => {
    this.setState({ text: e.target.value });
  };

  back = () => {
    this.props.changeScreen("lobby");
  };

  render() {
    const { messages, reactions } = this.state;

    return (
      <div>
        <h1>Chatroom</h1>
        <ul>
          {messages.map((message) => (
            <li key={message.id}>
              {message.text}
              <div>
                {reactions[message.id] &&
                  reactions[message.id].map((reaction, index) => (
                    <span key={`reactionKey${index}`}>{reaction}</span>
                  ))}
              </div>
              <Button onClick={() => this.addReaction(message.id, "like")}>
               👍
              </Button>
              <Button onClick={() => this.addReaction(message.id, "dislike")}>
               👎
              </Button>
              <Button onClick={() => this.addReaction(message.id, "heart")}>
              ❤️
              </Button>
              <Button onClick={() => this.addReaction(message.id, "laugh")}>
              😂
              </Button>
            </li>
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