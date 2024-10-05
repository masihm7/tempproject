import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import io from 'socket.io-client';
import styles from '../styles/VideoPlayer.module.css';

let socket;

const VideoPlayer = ({ videoLink }) => {
    const playerRef = useRef(null);
    const [playing, setPlaying] = useState(false);  // Track whether the video is playing or paused
    const [playedSeconds, setPlayedSeconds] = useState(0); // Track the current playback time

    useEffect(() => {
        // Initialize Socket.io connection
        socket = io('http://localhost:8000/');

        // Listen for play/pause and timestamp control events from other users
        socket.on('video-control', ({ action, time }) => {
            console.log(`Received action: ${action}, time: ${time}`);

            // If action is play, set playing to true and sync the current time
            if (action === 'play') {
                setPlaying(true);
                // Update to the current timestamp
                playerRef.current.seekTo(time, 'seconds');  // Sync to the provided timestamp
            } 
            // If action is pause, set playing to false
            else if (action === 'pause') {
                setPlaying(false);
            }
        });

        // Cleanup on component unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    const handlePlay = () => {
        setPlaying(true);  // Start playing the video locally
        const currentTime = playerRef.current.getCurrentTime(); // Get the current time of the video
        socket.emit('video-control', { action: 'play', time: currentTime });  // Notify other users to play the video
    };

    const handlePause = () => {
        setPlaying(false);  // Pause the video locally
        const currentTime = playerRef.current.getCurrentTime(); // Get the current time of the video
        socket.emit('video-control', { action: 'pause', time: currentTime });  // Notify other users to pause the video
    };

    const handleProgress = (state) => {
        setPlayedSeconds(state.playedSeconds);  // Track current time while the video is playing
    };

    return (
        <div className={styles.playercontainer}>
            <ReactPlayer
                ref={playerRef}
                url={videoLink}
                controls
                width="100%"
                height="100%"
                playing={playing}  // Control video playing state based on the 'playing' state
                onPlay={handlePlay}  // Emit play event when the video starts playing
                onPause={handlePause}  // Emit pause event when the video pauses
                onProgress={handleProgress}  // Track playback progress
                onDuration={(duration) => console.log('Duration:', duration)} // Log duration if needed
                onSeek={handleProgress}  // Sync when user seeks the video
                config={{
                    youtube: {
                        playerVars: { 
                            autoplay: 0, // Ensure autoplay is handled manually
                        }
                    }
                }}
            />
        </div>
    );
};

export default VideoPlayer;
