import { useState, useEffect} from "react";
import axios from 'axios';
import socketIOClient from "socket.io-client";
import { io } from "socket.io-client";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";

// class UserProfile extends react.Component {
//     constructor(props) {
//         super(props);
//         this.socket = io("http://localhost:3001", {
//           cors: {
//             origin: "http://localhost:3001",
//             credentials: true,
//           },
//           transports: ["websocket"],
//         });
//         this.state = {
//           username: "",
//           rooms: undefined,
//           screen: "",
//           selectedRoom: null,
//         };
//       }

//-------------------------------------
const socket = io("http://localhost:3001", {   
        origin: "*",
    },
);

const UserProfile = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [newUsername, setNewUsername] = useState('');

    useEffect(() => {
        socket.emit('getUser', userId);
        socket.on('userDetails', user => {
            setUser(user);
            setNewUsername(user.username);
        });

        return () => {
            socket.off('userDetails');
        }
    }, [userId]);

    const updateProfile = event => {
        event.preventDefault();

        const profileImage = event.target.elements.profileImage.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64Image = reader.result.split(',')[1];
            socket.emit('updateProfile', {userId, profileImage: base64Image, newUsername });
        }

        reader.readAsDataURL(profileImage);
    };

    if(!user) {
        return <div> Loading.. </div>
    }

    return (
        <form onSubmit={updateProfile}>
            <label> Profile Image </label>
            <img src={'http://localhost:3001/images/${user.profileImage}'} alt="Profile" />
            <input type="file" name="profileImage" />
            <label> Username </label>
            <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} />
            <button type="submit"> Update Profile </button>
        </form>
    
    );

};
export default UserProfile;

//     socket.on("userUpdated", data => {
//         if (data._id === user._id) {
//             setUsername(data.username);
//             setProfileImage('/images/${data.profileImage}');
//         }
//     });

//     const submitHandler = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append('username', username);
//         if(profileImage) {
//             formData.append('profileImage', profileImage)
//         }

//         const config = {
//             headers: {
//                 'content-type': 'multipart/form-data'
//             }
//         };
//         await axios.put('api/users/profile', formData, config); 
//     };

//     return (
//         <form onSubmit={submitHandler}>
//             <label> Edit Username </label>
//             <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
//             <label> Profile Image </label>
//             <input type="file" onChange={e => setProfileImage(e.target.files[0])} />
//             <button type="submit"> Update Profile </button>

//         </form>
//     );
//     }
// }
