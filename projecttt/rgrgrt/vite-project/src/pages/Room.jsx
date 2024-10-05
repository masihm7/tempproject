import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import AuthContext from "../context/AuthContext";
import VideoPlayer from "../components/VideoPlayer";
import Chat from "../components/Chat";
import axios from "axios";
import styles from "../styles/Room.module.css";
import { useNavigate } from "react-router-dom";

let socket;

const Room = () => {
  const { token, user, logout } = useContext(AuthContext);
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [link, setLink] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const fetchRoom = async () => {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const res = await axios.get(
          `http://localhost:8000/api/room/${roomId}`,
          config
        );
        setRoom(res.data);
      } catch (error) {
        console.error("Failed to fetch room:", error);
      }
    };

    fetchRoom();

    // Initialize Socket.io connection
    socket = io("http://localhost:8000/");
    socket.emit("joinRoom", { roomId, userId: user.id });

    // Listen for new video link updates
    socket.on("new-video", (videoLink) => {
      setRoom((prevRoom) => ({ ...prevRoom, videoLink }));
    });

    // Listen for video control actions
    socket.on("video-control", (action) => {
      handleVideoControlFromServer(action);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [roomId, token, user.id]);

  const handleWatch = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const data = {
      roomId,
      link,
      role: user.role,
    };
    console.log("Sending video link:", data);

    try {
      await axios.post("http://localhost:8000/api/video/link", data, config);
      console.log("Video link submitted successfully");
      setLink("");
    } catch (error) {
      console.log("Failed to watch video:", error);
    }
  };

  const handleVideoControl = (action) => {
    socket.emit("video-control", { roomId, action });
  };

  const handleVideoControlFromServer = (action) => {
    console.log("Received video control action from server:", action);
    const videoElement = document.getElementById("video-player");
    if (videoElement) {
      if (action === "play") {
        videoElement.play();
      } else if (action === "pause") {
        videoElement.pause();
      }
    }
  };

  const gotocreate = () => {
    navigate("/create-room");
  };
  const gotojoin=()=>{
    navigate("/join-room")
  }

  return (
    <div id={styles.poproom}>
      {user.role === "admin" ? (
        <button className={styles.createroomButton} onClick={gotocreate}>
          Create Another
        </button>
      ) : (
        <button className={styles.joinroomButton} onClick={gotojoin}>
          Join Room
        </button>
      )}
      <p id={styles.roomidbar}>{roomId}</p>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
      <div className={styles.container}>
        {user.role === "admin" && (
          <form onSubmit={handleWatch} className={styles.videoLinkForm}>
            <div className={styles.textField}>
              <input
                type="text"
                placeholder="Video Link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className={styles.textFieldInput}
              />
            </div>
            <button type="submit" className={styles.button}>
              Watch
            </button>
          </form>
        )}
        <div className={styles.videoPlayer}>
          {room?.videoLink && (
            <VideoPlayer
              id="video-player"
              videoLink={room.videoLink}
              roomId = {roomId}
              onPlay={() => handleVideoControl("play")}
              onPause={() => handleVideoControl("pause")}
              className={styles.videoPlayer}
            />
          )}
        </div>
        <div className={styles.chatContainer}>
          <Chat roomId={roomId} user={user.username} />
        </div>
      </div>
    </div>
  );
};

export default Room;
