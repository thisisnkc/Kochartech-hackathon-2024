import React, { useState } from "react";
import { Box, CssBaseline, Divider, Drawer, List, ListItem, ListItemText, Typography } from "@mui/material";
import AddTask from "./AddTask";
import Manage from "./Manage";
import Reports from "./Reports";

const drawerWidth = 240;

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("Add Task");

  const renderContent = () => {
    switch (selectedMenu) {
      case "Add Task":
        return <AddTask />;
      case "Manage":
        return <Manage />;
      case "Reports":
        return <Reports />;
      default:
        return <Typography variant="h6">Select a menu item</Typography>;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Box sx={{ padding: 2 }}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Task Manager
          </Typography>
        </Box>
        <Divider />
        <List>
          {["Add Task", "Manage", "Reports"].map((text) => (
            <ListItem
              button
              key={text}
              onClick={() => setSelectedMenu(text)}
              sx={{
                "&:hover": { backgroundColor: "rgba(0, 0, 255, 0.1)" },
                backgroundColor: selectedMenu === text ? "rgba(0, 0, 255, 0.2)" : "transparent",
                borderRadius: 1,
              }}
            >
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#f9f9f9",
          height: "100vh",
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Dashboard;
