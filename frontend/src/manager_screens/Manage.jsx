import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CallIcon from "@mui/icons-material/Call";
import ImageIcon from "@mui/icons-material/Image";
import EditIcon from "@mui/icons-material/Edit";

const Manage = () => {
  const [selectedPriority, setSelectedPriority] = useState("High");

  // Sample data for tasks
  const tasks = {
    High: [
      { name: "High Task 1", status: "Pending", assignedTo: "John Doe" },
      { name: "High Task 2", status: "Done", assignedTo: "Jane Smith" },
    ],
    Medium: [
      { name: "Medium Task 1", status: "Pending", assignedTo: "Alice Brown" },
      { name: "Medium Task 2", status: "Done", assignedTo: "Bob White" },
    ],
    Low: [
      { name: "Low Task 1", status: "Pending", assignedTo: "Charlie Green" },
      { name: "Low Task 2", status: "Done", assignedTo: "Dana Black" },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Manage Tasks
      </Typography>

      {/* Priority Selection Buttons */}
      <Stack direction="row" spacing={2} mb={3}>
        {["High", "Medium", "Low"].map((priority) => (
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
      {tasks[selectedPriority].map((task, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">
              {task.name}
            </Typography>
            <Typography
              variant="body2"
              color={task.status === "Done" ? "green" : "orange"}
              sx={{ ml: 2 }}
            >
              {task.status}
            </Typography>
            <Typography variant="body2" sx={{ ml: "auto" }}>
              Assigned to: {task.assignedTo}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
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
      ))}
    </Box>
  );
};

export default Manage;
