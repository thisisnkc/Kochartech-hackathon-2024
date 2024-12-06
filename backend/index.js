const express = require("express");
const { PrismaClient } = require("@prisma/client");
const {Role} = require("@prisma/client");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

// Middleware to parse JSON
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
