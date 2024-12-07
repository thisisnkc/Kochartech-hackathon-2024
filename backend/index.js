const express = require("express");
const { PrismaClient } = require("@prisma/client");
const {Role} = require("@prisma/client");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);


const io = new Server(server , {
  transports: ["websockets"],
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for call initiation
  socket.on("callUser", ({ to, roomName }) => {
    console.log(`Call initiated to ${to} for room ${roomName}`);
    // Notify the recipient
    io.to(to).emit("incomingCall", { from: socket.id, roomName });
  });

  // Join a specific room
  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
    console.log(`${socket.id} joined room ${roomName}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});



// Middleware to parse JSON
app.use(cors({ origin: "*" }));
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Hello, World! Welcome to the Node.js app with Prisma and MySQL.");
});

// API to fetch all users
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.get("/taskImages", async (req, res) => {
  try {
    const taskImages = await prisma.taskImage.findMany();
    res.status(200).json(taskImages);
  } catch (error) {
    console.error("Error fetching task images:", error);
    res.status(500).json({ error: "Failed to fetch task images" });
  }
});

// API to create a new user
app.post("/api/users/add", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }


    if(role !== Role.MANAGER && role !== Role.WORKER){
      return res.status(400).json({ error: "Invalid role" });
    }

    const newUser = await prisma.user.create({
      data: { name, email, password, role },
      select: { id: true, name: true, email: true, role: true },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// API to create a new user
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if ( !email || !password ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      return res.status(400).json({ error: "unknown user" });
    }
    
    
    return res.status(200).json({
      existingUser
    })
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.post("/api/tasks/add", async (req, res) => {
    try {
      const { title, description, priority, assignedTo, createdBy, status } = req.body;
  
      if (!title || !description  || !assignedTo || !createdBy ) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      const newTask = await prisma.task.create({
        data: { title, description, priority, assignedTo, createdBy, status },
        select: { id: true, title: true, description: true, priority: true, assignedTo: true, createdBy: true, status: true },
      });
  
      return res.status(201).json(newTask);
    } catch (error) {
      console.error("Error creating task:", error);
      return res.status(500).json({ error: "Failed to create task" });
    }
  });

  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files to "uploads" folder
      },
      filename: (req, file, cb) => {
        const uniqueName = `image_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName); // Standard image naming format
      },
    }),
  });

  app.post("/api/tasks/images/add", upload.single("image"), async (req, res) => {
    try {
      const { taskId } = req.body;

      console.log('file',req.file);
      const imagePath = `/uploads/${req.file.filename}`; // ask for image in body, and save it in filesystem in uploads folder and return that path and name the file to standard image naming format

      if (!taskId ) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: "Missing required fields" });
      }
  
  
      const newImage = await prisma.taskImage.create({
        data: { task:{
            connect: { id: +taskId }
        }, imagePath },
        select: { id: true,  imagePath: true, task: true, Status: true },
      });
  
      return res.status(201).json(newImage);
    } catch (error) {
      console.error("Error creating task image:", error);
      return res.status(500).json({ error: "Failed to create task image" });
    }
  })

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
