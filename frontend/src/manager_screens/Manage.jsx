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
    Modal,
    TextField,
    Paper,
    useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CallIcon from "@mui/icons-material/Call";
import ImageIcon from "@mui/icons-material/Image";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';


const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}


import { useNavigate } from "react-router-dom";

const Manage = () => {
  const [selectedPriority, setSelectedPriority] = useState("HIGH");
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  // const [setSelectedTaskId, setSelectedTaskId] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);

  const [value, setValue] = React.useState(2);
  const [hover, setHover] = React.useState(-1);

  const navigate = useNavigate();
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

    const handleCloseModal = () => {
    setOpenModal(false);
  };

  const navigateToPhygital = async () => {
    console.log("call clicked");
        // await navigate("/login");
  };

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
                <IconButton color="primary" aria-label="call"  onClick={ async ()=>{
                      window.open("/meetings", "_blank", "noopener,noreferrer");
                }}>
                  <CallIcon />
                </IconButton>
                <Button onClick={() => {
                  // setSelectedTaskId(task.id);
                  setImgSrc(task.taskImages[task.taskImages.length - 1 || 0].imagePath);
                  setOpenModal(true)}} variant="outlined">Verify image</Button>
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
            Task Completed 
          </Typography>
          <img
                src={imgSrc}
                alt="Uploaded Task"
                style={{ width: "100%" }}
              />
        <Rating
        name="hover-feedback"
        value={value}
        precision={0.5}
        getLabelText={getLabelText}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      />
      {value !== null && (
        <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
      )}
        </Paper>
      </Modal>
    </Box>
  );
};

export default Manage;
