import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

// const socket = io("http://localhost:3000", { transports: ["websockets"] });

const JitsiCall = () => {
  const jitsiContainerRef = useRef(null);

  useEffect(() => {


    // Load the Jitsi Meet API script
    const loadJitsiScript = () => {
      const existingScript = document.getElementById("jitsi-script");
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://join-meet.maxicus.com/external_api.js";
        script.id = "jitsi-script";
        script.async = true;
        document.body.appendChild(script);
        script.onload = initJitsiMeet;
      } else {
        initJitsiMeet();
      }
    };

    const initJitsiMeet = () => {
      if (!window.JitsiMeetExternalAPI) {
        console.error("Jitsi Meet API script not loaded");
        return;
      }

      const roomName = `Room-${Math.random().toString(36).substr(2, 9)}`

      // socket.emit("callUser", { to: recipientId, roomName });


      const domain = "join-meet.maxicus.com";
      const options = {
        roomName, // Generate a unique room name
        parentNode: jitsiContainerRef.current,
        jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsibmFtZSI6Ik1hbmFnZXIifX0sImF1ZCI6InBoeWdpdGFsX21lZXQiLCJpc3MiOiJwaHlnaXRhbF9tZWV0Iiwic3ViIjoibWVldC5qaXRzaSIsInJvb20iOiIqIn0.-l5Semd_1uNBbIUXQOz_AwDtnjGU_lR_9U9imaTSDNs', // JWT for authentication
        configOverwrite: {
          startWithAudioMuted: false, // Allow audio to start unmuted
          startWithVideoMuted: false, // Allow video to start unmuted
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            "microphone",
            "camera",
            "chat",
            "fullscreen",
            "raisehand",
            "tileview",
            "hangup",
            "screensharing",
          ], // Customize the toolbar
          SHOW_JITSI_WATERMARK: false, // Hide the Jitsi watermark
          DEFAULT_BACKGROUND: "#ffffff", // Optional: Add a custom background color
        },
        userInfo: {
          displayName: "Manager", // Customize the participant's display name
        },
      };

      const api = new window.JitsiMeetExternalAPI(domain, options);

      // Set event listeners for additional functionality
      api.addListener("videoConferenceJoined", () => {
        console.log("Video conference joined!");
      });

      api.addListener("participantJoined", (participant) => {
        console.log("Participant joined:", participant);
      });

      // Cleanup the Jitsi Meet API when the component unmounts
      return () => api.dispose();
    };

    loadJitsiScript();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* <header style={{ padding: "10px", background: "#f0f0f0" }}>
        <h1>Join the Meeting</h1>
      </header> */}
      <div
        ref={jitsiContainerRef}
        style={{
          flex: 1,
          border: "1px solid #ccc",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      ></div>
    </div>
  );
};

export default JitsiCall;
