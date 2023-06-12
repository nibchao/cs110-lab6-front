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
      messageSender: [],
      timestampSender: [],
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
        const senderArray = [];
        const createdTimestampArray = [];
        for (let cnt = 0; cnt < data.length; cnt++) {
          messageArray.push(data[cnt].message.text);
          senderArray.push(data[cnt].sender);
          let UTCTimestamp = data[cnt].createdAt;
          let localTimestamp = new Date(UTCTimestamp);
          let shortenedTimestamp = localTimestamp
            .toString()
            .replace(/GMT.*/g, "");
          createdTimestampArray.push(shortenedTimestamp);
        }

        this.setState({
          messages: messageArray,
          messageSender: senderArray,
          timestampSender: createdTimestampArray,
        });
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
    return (
      <div>
        <h1>Chatroom</h1>
        <ul>
          {this.state.messages.map((message, sender) => (
            <div key={"messageKey" + sender} style={{ paddingBottom: "10px" }}>
              <div style={{ fontWeight: "bold"}}>{this.state.timestampSender[sender]}{" "}</div>
              {this.state.messageSender[sender]}: {message}
            </div>
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
