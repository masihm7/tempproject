import  { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import AuthContext from '../context/AuthContext';

const LogoutButton = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogout = () => {
        logout(); 
        navigate('/'); 
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
};

export default LogoutButton;
