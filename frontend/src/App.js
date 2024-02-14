
import React, { useEffect, useRef, useState } from "react";
import { Button, IconButton, TextField } from "@material-ui/core";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PhoneIcon from "@material-ui/icons/Phone";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import "./App.css";

// const socket = io.connect("http://ec2-52-66-246-17.ap-south-1.compute.amazonaws.com/");
const socket = io.connect("http://ec2-43-204-235-117.ap-south-1.compute.amazonaws.com/");
// const socket = io.connect("http://localhost:5000");
function App() {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState(null); // Initialize stream as null
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [capturedPhoto, setCapturedPhoto] = useState(null); // State to store captured photo
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const [sessionId, setSessionId] = useState(""); // State to store session ID
  const [sessionLink,setSessionLink]=useState("");
  const [JoinMeeting, setJoinMeeting]=useState("");

  useEffect(() => {
    // Request user media access only after component mounts
    navigator.mediaDevices
      .getUserMedia({ video: {
        frameRate: 24,
        width: {
            min: 480, ideal: 720, max: 1280
        },
        aspectRatio: 1.33333
    }, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      })
      .catch((error) => {
        // Handle user rejection or errors here
        console.error("Error accessing media devices:", error);
      });

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);

    });
    const params = new URLSearchParams(window.location.search);
    const sessionIdParam = params.get("session");
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
      // You may want to trigger the call automatically here
      // based on your application's requirements
    }
  }, []);

  const createSession = () => {
    const sessionId = Math.random().toString(36).substring(7);
    setSessionId(sessionId);
    const sessionLink = `${window.location.origin}/?session=${sessionId}/${me}`;
    setSessionLink(sessionLink );
    console.log(sessionLink);
    // You may want to display the session ID to the user for sharing
  };

  // const generateSessionId = () => {
  //   const uniqueId=Math.random().toString(36).substring(7);
  //   // Generate a random session ID
    

  //   return Math.random().toString(36).substring(7);
  // };

  const Join = () => {
    console.log(window.location.href);
    const parts = (window.location.href).split('/');
    const mePart = parts[parts.length - 1];
    console.log(mePart);
    setIdToCall(mePart);
    callUser(idToCall);


  };
  


  const capturePhoto = () => {
    if (stream) {
      const videoWidth = myVideo.current.videoWidth;
      const videoHeight = myVideo.current.videoHeight;

      const canvas = document.createElement("canvas");
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(myVideo.current, 0, 0, videoWidth, videoHeight);
      const dataURI = canvas.toDataURL("image/png");

      // Trigger automatic download
      const link = document.createElement("a");
      link.href = dataURI;
      link.download = "captured_photo.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Set the captured photo in state
      setCapturedPhoto(dataURI);
    }
  };

  const callUser = (mePart) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" }
          // Add more ICE servers if needed
        ]
      }
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: mePart,
        signalData: data,
        from: me,
        name: name
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" }
        ]
      }
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  return (
    <>
      <h1 style={{ textAlign: "center", color: '#fff' }}>Chat Box</h1>
      <div className="container">
        <div className="video-container">
          <div className="video">
            {stream &&  <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
          </div>
          <div className="video">
            {callAccepted && !callEnded ?
            <video playsInline ref={userVideo} autoPlay style={{ width: "300px"}} />:
            null}
          </div>
        </div>
        <div className="myId">
          <TextField
            id="filled-basic"
            label="Name"
            variant="filled"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <CopyToClipboard text={sessionLink} style={{ marginBottom: "2rem" }}>
            <Button variant="contained" color="primary" startIcon={<AssignmentIcon fontSize="large" />}>
              Copy ID
            </Button>
            {/* console.log({sessionLink}); */}
          </CopyToClipboard>    

          <TextField
            id="filled-basic"
            label="ID to call"
            variant="filled"
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
          />
          <div className="call-button">
            {callAccepted && !callEnded ? (
              <Button variant="contained" color="secondary" onClick={leaveCall}>
                End Call
              </Button>
            ) : (
              <IconButton color="primary" aria-label="call" onClick={() => callUser(idToCall)}>
                <PhoneIcon fontSize="large" />
              </IconButton>
            )}
            {idToCall}
          </div>
        </div>
        <div>
          {receivingCall && !callAccepted ? (
              <div className="caller">
              <h1 >{name} is calling...</h1>
              <Button variant="contained" color="primary" onClick={answerCall}>
                Answer
              </Button>
            </div>
          ) : null}
        </div>
        {/* Render the captured photo */}
        {capturedPhoto && (
          <div className="captured-photo">
            <h2>Captured Photo</h2>
            <img src={capturedPhoto} alt="Captured" />
          </div>
        )}

      <div className="capture-button">
        <Button variant="contained" color="primary" onClick={capturePhoto}>
          Capture Photo
        </Button>
      </div>
      <div className="capture-button">
        <Button variant="contained" color="primary" onClick={createSession}>
          Create Session
        </Button>
      </div>
      <div className="capture-button">
        <Button variant="contained" color="primary" onClick={() => { Join(); callUser(idToCall); }}>
          Join Meeting 
       </Button>
      </div>

      
      </div>
    </>
  );
}

export default App;
