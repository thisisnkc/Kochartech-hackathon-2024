import React, { useState, useEffect, useRef } from "react";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Modal,
  TextField,
  IconButton,
  Paper,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { io } from "socket.io-client";


const TaskScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [taskStates, setTaskStates] = useState({});
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

  const theme = useTheme();

  // Fetch tasks from the API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:3000/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setTasks(data);

        // Initialize task states dynamically based on fetched tasks
        const initialTaskStates = {};
        data.forEach((task) => {
          initialTaskStates[task.id] = task.status || "Pending";
        });
        setTaskStates(initialTaskStates);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleStateChange = (taskId) => {
    setTaskStates((prevState) => {
      const currentState = prevState[taskId];
      let newState = "Pending";

      if (currentState === "Pending") {
        newState = "In Progress";
      } else if (currentState === "In Progress") {
        newState = "Done";
        setSelectedTaskId(taskId);
        setOpenModal(true);
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
      setImage(file); // Store the file object
    }
  };

  const handleSubmit = async () => {
    if (!image || !selectedTaskId) {
      alert("Please select an image and a task before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image); // Attach the image file
    formData.append("taskId", selectedTaskId); // Attach the taskId

    try {
      const response = await fetch("http://localhost:3000/api/tasks/images/add", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      console.log("Image uploaded successfully:", data);

      // Reset modal state
      setOpenModal(false);
      setImage(null);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setImage(null);
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
        background: "linear-gradient(135deg, #eef2f3, #8e9eab)",
        padding: "2rem",
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
          color: theme.palette.primary.main,
          mb: 4,
        }}
      >
        Task Management
      </Typography>
      {tasks.map((task) => (
        <Accordion
          key={task.id}
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            mb: 2,
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.primary.main }} />}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", flexGrow: 1 }}>
              {task.title}
            </Typography>
            <Typography
              sx={{
                color: theme.palette.secondary.main,
                fontWeight: "bold",
              }}
            >
              {task.priority}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mb: 2 }}
            >
              {task.description}
            </Typography>
            <Button
              variant="contained"
              onClick={() => handleStateChange(task.id)}
              sx={{
                textTransform: "uppercase",
                fontWeight: "bold",
              }}
              color={
                taskStates[task.id] === "Pending"
                  ? "warning"
                  : taskStates[task.id] === "In Progress"
                  ? "info"
                  : "success"
              }
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
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Paper
          sx={{
            p: 4,
            width: "90%",
            maxWidth: "400px",
            borderRadius: "8px",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
            position: "relative",
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Task Completed - Upload Image
          </Typography>
          <TextField
            type="file"
            fullWidth
            onChange={handleImageUpload}
            InputProps={{
              inputProps: { accept: "image/*" },
            }}
            sx={{ mb: 2 }}
          />
          {image && (
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 1 }}>Preview:</Typography>
              <img
                src={URL.createObjectURL(image)}
                alt="Uploaded Task"
                style={{ width: "100%" }}
              />
            </Box>
          )}
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleSubmit} // Call the submit function
          >
            Submit
          </Button>
        </Paper>
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
