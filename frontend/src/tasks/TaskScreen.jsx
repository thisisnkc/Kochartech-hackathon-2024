import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Modal,
  Input,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { io } from "socket.io-client";


const TaskScreen = () => {
  const [taskStates, setTaskStates] = useState({
    1: "Pending",
    2: "Pending",
    3: "Pending",
  });
  const [openModal, setOpenModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [image, setImage] = useState(null);

  const jitsiContainerRef = useRef(null);
  const [incomingCall, setIncomingCall] = useState(null);

  // const socket = io("http://localhost:3000", { transports: ["websockets"] });


  // useEffect(() => {
  //   // Listen for incoming calls
  //   socket.on("incomingCall", ({ from, roomName }) => {
  //     console.log("Incoming call from:", from);
  //     setIncomingCall({ from, roomName });
  //   });
  // }, [socket]);

  // const acceptCall = () => {
  //   if (!incomingCall) return;

  //   // Join the specified Jitsi room
  //   initJitsi(incomingCall.roomName);
  //   setIncomingCall(null);
  // };

  const handleStateChange = (taskId) => {
    setTaskStates((prevState) => {
      const currentState = prevState[taskId];
      let newState = "Pending";

      if (currentState === "Pending") {
        newState = "In Progress";
        console.log(`Task ${taskId} is now in progress`);
      } else if (currentState === "In Progress") {
        newState = "Done";
        console.log(`Task ${taskId} is now done`);
        setSelectedTaskId(taskId);  // Track which task was marked as done
        setOpenModal(true);  // Open the modal for image upload
      } else if (currentState === "Done") {
        console.log(`Task ${taskId} is already completed`);
      }

      return {
        ...prevState,
        [taskId]: newState,
      };
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));  // Create an object URL for the image
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setImage(null);  // Reset the image when closing the modal
  };

  const tasks = [
    { id: 1, title: "Task 1", description: "Description for Task 1", priority: "High" },
    { id: 2, title: "Task 2", description: "Description for Task 2", priority: "Medium" },
    { id: 3, title: "Task 3", description: "Description for Task 3", priority: "Low" },
  ];

  //  const declineCall = () => {
  //   // Dismiss the popup
  //   setIncomingCall(null);
  // };

  // const initJitsi = (roomName) => {
  //   if (!window.JitsiMeetExternalAPI) {
  //     console.error("Jitsi Meet API script not loaded");
  //     return;
  //   }

  //   const domain = "join-meet.maxicus.com";
  //   const options = {
  //     roomName,
  //     parentNode: jitsiContainerRef.current,
  //     userInfo: { displayName: "Recipient" },
  //   };

  //   new window.JitsiMeetExternalAPI(domain, options);
  // };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: "2rem",
        background: "linear-gradient(135deg, #FF9A8B, #FF6A88, #FF99AC)",
        color: "#fff",
      }}
    >
        {/* <div style={styles.popup}>
          <div style={styles.popupContent}>
            <h3>Incoming Call</h3>
            <p>From: {incomingCall.from}</p>
            <div style={styles.buttonContainer}>
              <button onClick={acceptCall} style={styles.acceptButton}>
                Accept
              </button>
              <button onClick={declineCall} style={styles.declineButton}>
                Decline
              </button>
            </div>
          </div>
        </div> */}
      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "2rem",
          textShadow: "2px 4px 6px rgba(0,0,0,0.3)",
        }}
      >
        Task Screen
      </Typography>
      {tasks.map((task) => (
        <Accordion
          key={task.id}
          sx={{
            marginBottom: "1rem",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              "& .MuiAccordionSummary-content": {
                flexGrow: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              },
            }}
          >
            <Typography sx={{ fontWeight: "bold", color: "#FF6A88" }}>
              {task.title}
            </Typography>
            <Typography
              sx={{
                color: "#FF6A88",
                fontSize: "0.9rem",
                fontWeight: "bold",
                marginLeft: "1rem",
              }}
            >
              {task.priority}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              sx={{
                color: "#333",
                marginBottom: "1rem",
              }}
            >
              {task.description}
            </Typography>
            <Button
              variant="contained"
              color={
                taskStates[task.id] === "Pending"
                  ? "warning"
                  : taskStates[task.id] === "In Progress"
                  ? "primary"
                  : "success"
              }
              onClick={() => handleStateChange(task.id)}
              sx={{
                textTransform: "uppercase",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              {taskStates[task.id]}
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Modal for Image Upload */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "8px",
            width: "400px",
            textAlign: "center",
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
            Task Completed - Upload Image
          </Typography>
          <Input
            type="file"
            onChange={handleImageUpload}
            sx={{
              marginBottom: "1rem",
              border: "1px solid #ddd",
              padding: "8px",
              borderRadius: "4px",
            }}
          />
          {image && (
            <Box sx={{ marginBottom: "1rem" }}>
              <img src={image} alt="Uploaded Task" width="100%" />
            </Box>
          )}
          <Button
            variant="contained"
            color="success"
            onClick={handleCloseModal}
            sx={{
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
          >
            Submit
          </Button>
        </Box>
      </Modal>
      {/* <div
        ref={jitsiContainerRef}
        style={{ width: "100%", height: "100vh", display: incomingCall ? "none" : "block" }}
      ></div> */}
    </Box>
  );
};

// const styles = {
//   popup: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//   },
//   popupContent: {
//     backgroundColor: "#fff",
//     padding: "20px",
//     borderRadius: "10px",
//     textAlign: "center",
//     boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
//   },
//   buttonContainer: {
//     display: "flex",
//     justifyContent: "space-around",
//     marginTop: "20px",
//   },
//   acceptButton: {
//     backgroundColor: "#4CAF50",
//     color: "#fff",
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
//   declineButton: {
//     backgroundColor: "#F44336",
//     color: "#fff",
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
// };

export default TaskScreen;
