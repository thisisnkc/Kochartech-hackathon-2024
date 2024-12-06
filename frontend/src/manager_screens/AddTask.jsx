import React, { useState } from "react";
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("PENDING");
  const createdBy = localStorage.getItem("name"); // Fetching createdBy from localStorage

  const handleSubmit = async () => {
    if (!title || !description || !assignedTo || !createdBy) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/tasks/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          priority,
          assignedTo,
          createdBy:{
            name:"Nikhil Kumar",
            email:"nikhil.kumar@phygital.com",
            password:"Nik@1234",
            id:2,
            role:"WORKER"

          },
          status,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Task created successfully!");
        // Optionally clear form fields after successful submission
        setTitle("");
        setDescription("");
        setPriority("");
        setAssignedTo("");
        setStatus("");
      } else {
        const errorData = await response.json();
        alert(`Failed to create task: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Add Task
      </Typography>
      <TextField
        fullWidth
        label="Task Name"
        variant="outlined"
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        fullWidth
        label="Description"
        variant="outlined"
        margin="normal"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Priority</InputLabel>
        <Select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          variant="outlined"
        >
          <MenuItem value="LOW">LOW</MenuItem>
          <MenuItem value="MEDIUM">MEDIUM</MenuItem>
          <MenuItem value="HIGH">HIGH</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Assigned To"
        variant="outlined"
        margin="normal"
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
      />
     
      <Button
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Box>
  );
};

export default AddTask;
