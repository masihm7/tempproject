import "./styles/App.css";
import "./pages/LandingPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Landingpage } from "./pages/LandingPage";
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import Room from "./pages/Room";
import { AuthProvider } from '../src/context/AuthContext';

function App() {
  return (
     <AuthProvider>
        <Router>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/create-room" element={<CreateRoom />} />
          <Route path="/join-room" element={<JoinRoom />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </Router>
     </AuthProvider>
      
  );
}

export default App;
