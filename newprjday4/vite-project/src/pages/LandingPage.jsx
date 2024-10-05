import "../styles/landingpage.css";
import logo from "../assets/logo.svg";
import ytlogo from "../assets/youtube.svg";
import vlogo from "../assets/vimeo.svg";
import tlogo from "../assets/twitch.svg";
import tiklogo from '../assets/tiktok.svg'
import p1 from "../assets/1.jpg";
import p2 from "../assets/2.jpg";
import p3 from "../assets/3.jpg";
import p4 from "../assets/4.jpg";
import p5 from "../assets/5.jpg";
import p6 from "../assets/6.jpg";
import { useNavigate } from 'react-router-dom';

export const Landingpage = () => {
  const navigate = useNavigate();
  const goToLogin = () => {
    navigate('/login'); 
  };

  return (
    <>
      <div id="dodo">
        <div className="container">
          <header id="navbar">
            <img src={logo} alt="cv" />
            <div id="bar">
              <div style={{ borderRight: "2px solid rgb(222, 227, 230)" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="rgb(222, 227, 230)"
                  viewBox="0 0 24 24"
                >
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </div>
              <div style={{ borderRight: "2px solid rgb(222, 227, 230)" }}>
                <p>Community</p>
              </div>
              <div style={{ borderRight: "2px solid rgb(222, 227, 230)" }}>
                <p>Upgrade</p>
              </div>
              <div style={{ borderRight: "2px solid rgb(222, 227, 230)" }}>
                <p>SignUp</p>
              </div>
              <div onClick={goToLogin}>
                <p>Login</p>
              </div>
            </div>
          </header>
          <section id="section1">
            <div>
              <p>Spend Time Together.</p>
              <button onClick={goToLogin}>Create your room</button>
              <div id="plogo">
                <img src={ytlogo} alt="" />
                <img src={tlogo} alt="" />
                <img src={vlogo} alt="" />
                <img src={tiklogo} alt="" />.
              </div>
            </div>
          </section>
          <section id="section2">
            <div>
            <p>About Watch2Gether</p>
              <div id="splitd">
              <div>
                <p>
                  With Watch2Gether you can watch YouTube together. Services
                  like Vimeo, Netflix, Amazon, Disney & Co are also supported.
                  Create a room and invite friends to your WatchParty.
                </p>
              </div>
              <div>
                <ul className="check-list">
                  <li>Synchronized player for video and audio</li>
                  <li>Talk to your friends in the integrated chat room</li>
                  <li>
                    Enjoy content from YouTube, Vimeo, Dailymotion, and
                    SoundCloud
                  </li>
                  <li>Organize content into playlists</li>
                  <li>Webcam support</li>
                </ul>
              </div>
              </div>
            </div>
            <div>
              <img src={p1} alt="" />
            </div>
            <div>
              <img src={p2} alt="" />
              <img src={p3} alt="" />
              <img src={p4} alt="" />
              <img src={p5} alt="" />
            </div>
            <div>
              <img src={p6} alt="" />
            </div>
          </section>
        </div>
        <footer >
                <div className="container">
                    <a href="">Product documentation</a>
                    <a href="">Contact - Site notice / Impressum</a>
                    <a href="">Data Privacy Policy</a>
                    <a href="">About Us</a>
                </div>
        </footer>
      </div>
    </>
  );
};
