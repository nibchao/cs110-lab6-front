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
    // console.log(this.props.roomID);

    // let data = {};
    // data["roomID"] = this.props.roomID;

    // fetch(this.props.server_url + "/api/messages/all", {
    //   method: "GET",
    //   credentials: "include",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // }).then((res) => {
    //   res.json().then((data) => {
    //     // probably supposed to do something, this was copied from screenhandler.js
    //     //   if (data.message === "logged in") {
    //     //     this.setState({ screen: "lobby" });
    //     //   } else {
    //     //     this.setState({ screen: "auth" });
    //     //   }
    //   });
    // });
  }

  sendMessage = (text) => {
    this.socket.emit("chat message", text);
    this.state.messages.push(text);
    this.setState({ messages: this.state.messages, text: text });
    document.getElementById("text").value = '';
  };

  back = () => {
    this.props.changeScreen("lobby");
  };

  render() {
    return (
      <div>
        Chatroom
        <ul>
          {this.state.messages.map((message) => (
            <li key={"messageKey" + message}>{message}</li>
          ))}
        </ul>
        <input
          type="text"
          id="text"
          onChange={(e) => {
            this.state.text = e.target.value;
          }}
        ></input>
        <Button onClick={() => this.sendMessage(this.state.text)}>Send</Button>
        <Button onClick={() => this.back()}>Back</Button>
      </div>
    );
  }
}

export default Chatroom;
