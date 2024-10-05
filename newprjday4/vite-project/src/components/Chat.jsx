import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import styles from "../styles/Chat.module.css"; // Import CSS module

const socket = io("http://localhost:8000/", {
  transports: ["websocket"],
});

const Chat = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null); // Reference to track the end of the chat list

  useEffect(() => {
    socket.emit("joinRoom", { roomId });

    socket.on("message", (msg) => {
      console.log(msg); // This will show the structure of the incoming message
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off(); // Cleanup the socket connection
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom whenever a new message arrives
  }, [messages]); // Dependency array ensures this runs every time `messages` changes

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (message.trim()) {
      socket.emit("sendMessage", { roomId, message });
      setMessage(""); // Clear the input field after sending the message
    }
  };

  return (
    <div id={styles.popchat}>
      <div className={styles.container}>
        <ul className={styles.list}>
          {messages.map((msg, index) => (
            <li key={index} className={styles.listItem}>
              <strong>{msg.username}: </strong> {msg.message}
            </li>
          ))}
          <div ref={chatEndRef} /> {/* Reference to the end of the chat list */}
        </ul>
        <input
          className={styles.textField}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
