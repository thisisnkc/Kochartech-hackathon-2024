import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CallIcon from "@mui/icons-material/Call";
import ImageIcon from "@mui/icons-material/Image";
import EditIcon from "@mui/icons-material/Edit";

const Manage = () => {
  const [selectedPriority, setSelectedPriority] = useState("HIGH");
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setFilteredTasks(data.filter((task) => task.priority === selectedPriority));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Filter tasks by priority when selectedPriority changes
  useEffect(() => {
    const priorityFilteredTasks = tasks.filter((task) => task.priority === selectedPriority);
    setFilteredTasks(priorityFilteredTasks);
  }, [selectedPriority, tasks]);

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Manage Tasks
      </Typography>

      {/* Priority Selection Buttons */}
      <Stack direction="row" spacing={2} mb={3}>
        {["HIGH", "MEDIUM", "LOW"].map((priority) => (
          <Button
            key={priority}
            variant={selectedPriority === priority ? "contained" : "outlined"}
            color="primary"
            onClick={() => setSelectedPriority(priority)}
          >
            {priority}
          </Button>
        ))}
      </Stack>

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <Accordion key={task.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">
                {task.title}
              </Typography>
              <Typography
                variant="body2"
                color={task.status === "DONE" ? "green" : "orange"}
                sx={{ ml: 2 }}
              >
                {task.status}
              </Typography>
              <Typography variant="body2" sx={{ ml: "auto" }}>
                Assigned to: {typeof task.assignedTo === "string" ? task.assignedTo : task.assignedTo.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" mb={2}>
                {task.description}
              </Typography>
              <Stack direction="row" spacing={2}>
                <IconButton color="primary" aria-label="call">
                  <CallIcon />
                </IconButton>
                <Button variant="outlined">Verify image</Button>
                <IconButton color="primary" aria-label="edit task">
                  <EditIcon />
                </IconButton>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          No tasks available for this priority.
        </Typography>
      )}
    </Box>
  );
};

export default Manage;
