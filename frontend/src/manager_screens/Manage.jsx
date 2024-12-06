import React from "react";
import { Box, Typography, List, ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Manage = () => {
  const tasks = ["Task 1", "Task 2", "Task 3"];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Manage Tasks
      </Typography>
      <List>
        {tasks.map((task, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={task} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Manage;
