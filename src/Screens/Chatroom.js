import react from "react";
import { io } from 'socket.io-client'

class Chatroom extends react.Component{
    constructor(props){
        super(props);
        this.socket = io('http://localhost:3001', {
            cors: {
                origin: 'http://localhost:3001',
                credentials: true
            }, transports: ['websocket']
        });
        this.state = {
            messages: [],
            text: ''
        }
    }

    componentDidMount()
    {
        console.log(this.props.roomID);

        let data = {};
        data['roomID'] = this.props.roomID;

        fetch(this.props.server_url + '/api/messages/all', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            res.json().then((data) => {
                // probably supposed to do something, this was copied from screenhandler.js
            //   if (data.message === "logged in") {
            //     this.setState({ screen: "lobby" });
            //   } else {
            //     this.setState({ screen: "auth" });
            //   }
            });
        });
    }

    render(){
        return(
            <div>
                {/* show chats */}
                {/* show chat input box*/}
                Chatroom
            </div>
        );
    }
}

export default Chatroom;