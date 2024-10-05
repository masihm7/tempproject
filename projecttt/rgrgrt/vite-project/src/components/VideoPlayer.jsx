import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import io from 'socket.io-client';
import styles from '../styles/VideoPlayer.module.css';

let socket;

const VideoPlayer = ({ videoLink, roomId }) => {  // Make sure roomId is passed as a prop
    const playerRef = useRef(null);
    const [playing, setPlaying] = useState(false);  // Track whether the video is playing or paused
    const [playedSeconds, setPlayedSeconds] = useState(0); // Track the current playback time
    const [muted, setMuted] = useState(false); // Initial mute to handle autoplay restrictions
    const [lastSyncTime, setLastSyncTime] = useState(0); // Track the last time we synced the video
    const [isAdmin, setIsAdmin] = useState(false); // Assume you handle user role

    useEffect(() => {
        // Initialize Socket.io connection
        socket = io('http://localhost:8000/');

        // Join the room when component mounts
        socket.emit('joinRoom', { roomId, userId: 'some-unique-user-id' });  // Ensure roomId is passed here

        // Listen for play/pause and timestamp control events from other users
        socket.on('video-control', ({ action, time }) => {
            console.log(`Received action: ${action}, time: ${time}, roomid:${roomId}`);

            // Handle play action
            if (action === 'play') {
                setPlaying(true);
                if (time !== undefined && Math.abs(time - playerRef.current.getCurrentTime()) > 1) {
                    // Sync if time difference is significant (>1 second)
                    playerRef.current.seekTo(time, 'seconds');
                }
            }
            // Handle pause action
            else if (action === 'pause') {
                setPlaying(false);
                if (time !== undefined && Math.abs(time - playerRef.current.getCurrentTime()) > 1) {
                    // Sync if time difference is significant
                    playerRef.current.seekTo(time, 'seconds');
                }
            }
        });

        // Handle new video event and automatically start playing the video
        socket.on('new-video', (newVideoLink) => {
            if (newVideoLink === videoLink) {
                setPlaying(true);
            }
        });

        // Cleanup on component unmount
        return () => {
            socket.disconnect();
        };
    }, [videoLink, roomId]);  // Add roomId to dependencies

    const handlePlay = () => {
        const currentTime = playerRef.current.getCurrentTime(); // Get the current time of the video
        setPlaying(true);
        setLastSyncTime(currentTime); // Track last sync time
        socket.emit('video-control', { roomId, action: 'play', time: currentTime });  // Include roomId
    };

    const handlePause = () => {
        const currentTime = playerRef.current.getCurrentTime();
        setPlaying(false);
        socket.emit('video-control', { roomId, action: 'pause', time: currentTime });  // Include roomId
    };

    const clickclick = () => {
        if (playing) {
            handlePause();
        } else {
            handlePlay();
        }
    }

    const handleProgress = (state) => {
        setPlayedSeconds(state.playedSeconds);  // Track current time while the video is playing

        // Periodically sync every 5 seconds to avoid drift
        if (isAdmin && state.playedSeconds - lastSyncTime > 5) {
            const currentTime = playerRef.current.getCurrentTime();
            setLastSyncTime(currentTime);
            socket.emit('video-control', { roomId, action: 'sync', time: currentTime });  // Include roomId
        }
    };

    return (
        <div className={styles.playercontainer}>
            <button onClick={clickclick}>clickclick</button>
            <ReactPlayer
                ref={playerRef}
                url={videoLink}
                controls
                width="100%"
                height="100%"
                playing={playing}
                muted={muted}
                onPlay={handlePlay}
                onPause={handlePause}
                onProgress={handleProgress}
                onDuration={(duration) => console.log('Duration:', duration)}
                onSeek={handleProgress}
                config={{
                    youtube: {
                        playerVars: {
                            autoplay: 1, 
                        }
                    }
                }}
            />
        </div>
    );
};

export default VideoPlayer;
