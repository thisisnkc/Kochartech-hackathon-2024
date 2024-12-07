import React, { useState } from "react";
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

const TaskScreen = () => {
  const [taskStates, setTaskStates] = useState({
    1: "Pending",
    2: "Pending",
    3: "Pending",
  });
  const [openModal, setOpenModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [image, setImage] = useState(null);

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
        setSelectedTaskId(taskId); // Track which task was marked as done
        setOpenModal(true); // Open the modal for image upload
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
      setImage(URL.createObjectURL(file)); // Create an object URL for the image
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setImage(null); // Reset the image when closing the modal
  };

  const tasks = [
    {
      id: 1,
      title: "Task 1",
      description: "Description for Task 1",
      priority: "High",
    },
    {
      id: 2,
      title: "Task 2",
      description: "Description for Task 2",
      priority: "Medium",
    },
    {
      id: 3,
      title: "Task 3",
      description: "Description for Task 3",
      priority: "Low",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        padding: "2rem",
        background: "linear-gradient(135deg, #020202, #2575FC)",
        color: "#fff",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "2rem",
          textShadow: "2px 4px 6px rgba(0,0,0,0.3)",
        }}
      >
        Today's Recap
      </Typography>
      <div className="recap">
        <div>
          <h2>
            6<span> Tasks</span>
          </h2>
          <h3>Scheduled</h3>
        </div>
        <div>
          <h2>
            4<span> Tasks</span>
          </h2>
          <h3>Done</h3>
        </div>
      </div>
      <div>
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
          className="tasks"
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
              className="submitBtn"
              variant="contained"
              // color="success"
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
      </div>
    </Box>
  );
};

export default TaskScreen;
