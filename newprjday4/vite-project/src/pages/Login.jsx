import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import styles from '../styles/Login.module.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const goToSignup = () => {
    navigate('/Signup'); 
  };
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      setAlert({ type: "success", message: "Login successful!" });
      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/create-room");
        } else {
          navigate("/join-room");
        }
      }, 2000); // Redirect to appropriate page after 2 seconds
    } catch (error) {
      console.log(error)
      setAlert({
        type: "error",
        message: "Login failed. Please check your credentials.",
      });
    }
  };

  return (
    <div id={styles.poplogin}>
      <div className={styles.containerlogin}>
      <h2>Login</h2>
      {alert && (
        <div
          style={{
            color: alert.type === "error" ? "red" : "green",
            marginBottom: "10px",
          }}
        >
          {alert.message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className={styles.inputgroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputgroup}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>
      <p className={styles.link} onClick={goToSignup}>
        Dont have an account? 
        {/* <Link to="/register">Register here</Link> */}
      </p>
    </div>
    </div>
    
  );
};

export default Login;
