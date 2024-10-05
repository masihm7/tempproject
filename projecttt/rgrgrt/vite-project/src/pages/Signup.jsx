import { useState, useContext } from "react";
// import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import stylessignup from '../styles/Signup.module.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const { register } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [alert, setAlert] = useState(null);
  // const navigate = useNavigate();


const navigate = useNavigate();
  const goToLogin = () => {
    navigate('/login'); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ username, email, password, role }); 
    try {
      await register(username, email, password, role);
      setAlert({ type: "success", message: "Registration successful!" });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error during registration:", error);
      setAlert({
        type: "error",
        message: "Registration failed. Please try again.",
      });
    }
  };
  

  return (
    <div id={stylessignup.popsign}>
            <div className={stylessignup.container}>
      <h2>Sign Up</h2>
      {alert && (
        <div className={stylessignup.alert}>
          {alert.message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className={stylessignup.inputgroup}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={stylessignup.inputgroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={stylessignup.inputgroup}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={stylessignup.inputgroup}>
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            {/* <option value="organizer">Organizer</option> */}
          </select>
        </div>
        <button type="submit" className={stylessignup.button}>
          Register
        </button>
      </form>
      <div className={stylessignup.link} onClick={goToLogin}>
        Already have an account? 
        {/* <Link to="/login">Login here</Link> */}
      </div>
    </div>
    </div>
  );
};

export default Signup;

