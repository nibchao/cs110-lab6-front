import React from "react";
import { io } from "socket.io-client";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";

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

    fetch(this.props.server_url + "/api/rooms/messages", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomName: roomID }),
    }).then((res) => {
      res.json().then((data) => {
        const messageArray = [];
        for (let cnt = 0; cnt < data.length; cnt++) {
          messageArray.push(data[cnt].message.text);
        }

        this.setState({ messages: messageArray });
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
      reactions: { ...prevState.reactions, [message.id]: [] },
    }));
  };

  addReaction = (messageId, reaction) => {
    this.setState((prevState) => {
      const { reactions } = prevState;
      const updatedReactions = {
        ...reactions,
        [messageId]: [...(reactions[messageId] || []), reaction],
      };

      return { reactions: updatedReactions };
    });
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
          {messages.map((message, index) => (
            <li key={"messageKey" + index} style={{paddingBottom: 20}}>
              {message}
              <ReactionButton
                messageId={index}
                reactions={reactions[index] || []}
                addReaction={this.addReaction}
              />
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

const ReactionButton = ({ messageId, reactions, addReaction }) => {
  const handleAddReaction = (reaction) => {
    addReaction(messageId, reaction);
  };

  return (
    <div>
      {reactions.map((reaction, index) => (
        <span key={`reactionKey${index}`}>{reaction}</span>
      ))}
      <div>
        <ToggleButtonGroup size="small">
          <ToggleButton value="thumbsup" onClick={() => handleAddReaction("👍")} sx={{":hover": {bgcolor: "#AF5", color: "white"}, borderRadius: "30px"}}>👍</ToggleButton>
          <ToggleButton value="thumbsdown" onClick={() => handleAddReaction("👎")} sx={{":hover": {bgcolor: "#AF5", color: "white"}, borderRadius: "30px"}}>👎</ToggleButton>
          <ToggleButton value="heart" onClick={() => handleAddReaction("❤️")} sx={{":hover": {bgcolor: "#AF5", color: "white"}, borderRadius: "30px"}}>❤️</ToggleButton>
          <ToggleButton value="joy" onClick={() => handleAddReaction("😂")} sx={{":hover": {bgcolor: "#AF5", color: "white"}, borderRadius: "30px"}}>😂</ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  );
};

export default Chatroom;