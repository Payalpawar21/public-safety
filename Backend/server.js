require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const alertRoutes = require("./routes/alert");
const volunteerRoutes = require("./routes/volunteer");

const app = express();

/* -------------------- Middleware -------------------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());

/* -------------------- Routes -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/volunteer", volunteerRoutes);

/* -------------------- HTTP Server -------------------- */
const server = http.createServer(app);

/* -------------------- Socket.IO -------------------- */
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  console.log("Socket Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket Disconnected:", socket.id);
  });
});

app.set("io", io);

/* -------------------- Database -------------------- */
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/womensafety")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

/* -------------------- Health Check -------------------- */
app.get("/", (req, res) => {
  res.send("API Running Successfully");
});

/* -------------------- Start Server -------------------- */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});