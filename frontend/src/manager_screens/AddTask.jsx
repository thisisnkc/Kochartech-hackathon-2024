import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [userToAssign, setUserToAssign] = useState({});
  const [workers, setWorkers] = useState([]);
  const [status, setStatus] = useState("PENDING");

  const user = useRef([]);

  const getWorkers = useCallback(async () => {
    const users = await fetch("http://localhost:3000/users");
    const usersData = await users.json();

    console.log('users data',usersData);

     const user = usersData.filter(user => user.role === "WORKER");

    setWorkers(user);
  },[]) 

  useEffect(() => {
    getWorkers();
  },[getWorkers])

  const handleSubmit = async () => {
    if (!title || !description || !userToAssign) {
      alert("Please fill all required fields!");
      return;
    }

    let userInfo = localStorage.getItem("userInfo");

    userInfo = JSON.parse(userInfo);


    const assignedWorker = workers.filter(worker => worker.name === userToAssign);

    

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
          assignedTo: assignedWorker[0],
          createdBy:userInfo,
        }),
      });

      console.log('body',{
        title,
        description,
        priority,
        assignedTo: assignedWorker[0],
        createdBy:userInfo,
      })

      if (response.ok) {
        const data = await response.json();
        alert("Task created successfully!");
        // Optionally clear form fields after successful submission
        setTitle("");
        setDescription("");
        setPriority("");
        setUserToAssign();
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
      <FormControl defaultValue="LOW" fullWidth margin="normal">
        <InputLabel>Priority</InputLabel>
        <Select
          value={priority}
          label="Priority"
          onChange={(e) => setPriority(e.target.value)}
          variant="outlined"
        >
          <MenuItem value="LOW">LOW</MenuItem>
          <MenuItem value="MEDIUM">MEDIUM</MenuItem>
          <MenuItem value="HIGH">HIGH</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Assigned To</InputLabel>
        <Select
        label="Assigned To"
          value={userToAssign}
          onChange={(e) => setUserToAssign(e.target.value)}
          variant="outlined"
        >
          {workers && workers?.map((u) => (
            <MenuItem key={u.id} value={u.name}>
              {u.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
     
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
