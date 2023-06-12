import React from "react";
import { io } from "socket.io-client";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";

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
      messageSender: [],
      reactionMessages: [],
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

    this.socket.on("reaction", () => {
      this.fetchMessageHistory();
    });

    this.fetchMessageHistory();
  }

  fetchMessageHistory = () => {
    fetch(this.props.server_url + "/api/rooms/messages", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomName: this.props.roomID }),
    }).then((res) => {
      res.json().then((data) => {
        const messageArray = [];
        const senderArray = [];
        const reactionArray = [];
        for (let cnt = 0; cnt < data.length; cnt++) {
          messageArray.push(data[cnt].message.text);
          reactionArray.push(data[cnt].reactions);
          senderArray.push(data[cnt].sender);
        }

        this.setState({
          messages: messageArray,
          messageSender: senderArray,
          reactionMessages: reactionArray,
        });
      });
    });
  };

  componentWillUnmount() {
    const { roomID } = this.props;
    this.socket.emit("leave", { room: roomID });
    this.socket.off("chat message");
  }

  handleReceivedMessage = async (message) => {
    this.setState((prevState) => ({
      messages: [...prevState.messages, message.text],
      reactions: { ...prevState.reactions, [message.id]: [] },
    }));
    this.fetchMessageHistory();
  };

  addReaction = (messageId, reaction, messageText, messageSender, isAdding) => {
    this.socket.emit("reaction", {
      messageText: messageText,
      messageSenderID: messageSender,
      reaction: reaction,
      roomName: this.props.roomID,
      isAdding: isAdding, // Pass the isAdding parameter to the server
    });
    this.setState((prevState) => {
      const { reactions } = prevState;
      const updatedReactions = {
        ...reactions,
        [messageId]: isAdding
          ? [...(reactions[messageId] || []), reaction]
          : (reactions[messageId] || []).filter((r) => r !== reaction),
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
            <li key={"messageKey" + index} style={{ paddingBottom: 20 }}>
              {message}{" "}
              <div>{"[ Reactions: " +
                (this.state.reactionMessages[index]
                  ? this.state.reactionMessages[index]
                  : "") +
                " ]"}</div>
              <ReactionButton
                messageId={index}
                reactions={reactions[index] || []}
                addReaction={this.addReaction}
                messageText={message}
                messageSender={this.state.messageSender[index]}
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

const ReactionButton = ({
  messageId,
  reactions,
  addReaction,
  messageText,
  messageSender,
}) => {
  const [clickedReactions, setClickedReactions] = useState([]);

  const handleAddReaction = (reaction) => {
    if (clickedReactions.includes(reaction)) {
      // If the reaction is already clicked, remove it from the clickedReactions state
      setClickedReactions((prevClickedReactions) =>
        prevClickedReactions.filter((r) => r !== reaction)
      );
      // Remove the reaction from the message's reactions list
      addReaction(messageId, reaction, messageText, messageSender, false);
    } else {
      // If the reaction is not clicked, add it to the clickedReactions state
      setClickedReactions((prevClickedReactions) => [
        ...prevClickedReactions,
        reaction,
      ]);
      // Add the reaction to the message's reactions list
      addReaction(messageId, reaction, messageText, messageSender, true);
    }
  };

  return (
    <div>
      <div>
        <ToggleButtonGroup size="small">
          <ToggleButton
            selected={clickedReactions.includes("👍")}
            value="thumbsup"
            onClick={() => handleAddReaction("👍")}
            sx={{
              ":hover": { bgcolor: "#AF5", color: "white" },
              borderRadius: "30px",
            }}
          >
            👍
          </ToggleButton>
          <ToggleButton
            selected={clickedReactions.includes("👎")}
            value="thumbsdown"
            onClick={() => handleAddReaction("👎")}
            sx={{
              ":hover": { bgcolor: "#AF5", color: "white" },
              borderRadius: "30px",
            }}
          >
            👎
          </ToggleButton>
          <ToggleButton
            selected={clickedReactions.includes("❤️")}
            value="heart"
            onClick={() => handleAddReaction("❤️")}
            sx={{
              ":hover": { bgcolor: "#AF5", color: "white" },
              borderRadius: "30px",
            }}
          >
            ❤️
          </ToggleButton>
          <ToggleButton
            selected={clickedReactions.includes("😂")}
            value="joy"
            onClick={() => handleAddReaction("😂")}
            sx={{
              ":hover": { bgcolor: "#AF5", color: "white" },
              borderRadius: "30px",
            }}
          >
            😂
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  );
};

export default Chatroom;
