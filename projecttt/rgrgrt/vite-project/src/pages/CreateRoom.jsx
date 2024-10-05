import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from '../styles/CreateRoom.module.css'; // Import the CSS module

const CreateRoom = () => {
  const { token, user, logout } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [joinUrl, setJoinUrl] = useState("");
  const [roomId, setRoomId] = useState(""); // Add state to hold roomId
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  console.log(user)
  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(
        "http://localhost:8000/api/room/create",
        { name },
        config
      );
      const roomId = response.data.roomId;
      setRoomId(roomId); // Store roomId in state
      const url = `${window.location.origin}/room/${roomId}`;
      setJoinUrl(url);
      setAlert({ type: "success", message: "Room created successfully!" });
    } catch (error) {
      console.error("Failed to create room:", error);
      setAlert({
        type: "error",
        message: "Failed to create room. Please try again.",
      });
    }
  };

  const handleJoinRoom = () => {
    if (user.role === "admin" && joinUrl) {
      navigate(`/room/${joinUrl.split("/").pop()}`);
    }
  };

  return (
    <div id={styles.popcreateroom}>
      <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
      <div className={styles.container}>
        <h4 className={styles.title}>Create Room</h4>
        {alert && <div style={{ color: alert.type === "error" ? "red" : "green" }}>{alert.message}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Room Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.textField}
          />
          <button type="submit" className={styles.button}>
            Create
          </button>
        </form>
        {joinUrl && (
          <>
            <p style={{ marginTop: "1rem" }}>
              Room created! Share this Room ID to join
              {/* Share this link to join:{" "} */}
              {/* <a href={joinUrl} className={styles.link}>
                {joinUrl}
              </a> */}
            </p>
            <p className={styles.link}>{roomId}</p>
            {/* <p>Or Join using Room ID</p> */}
            {/* <p>{roomId}</p>  */}
            {user.role === "admin" && (
              <button
                className={styles.button}
                onClick={handleJoinRoom}
              >
                Join Room
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CreateRoom;
