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

const TaskScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [taskStates, setTaskStates] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [image, setImage] = useState(null);

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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef2f3, #8e9eab)",
        padding: "2rem",
      }}
    >
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
    </Box>
  );
};

export default TaskScreen;
