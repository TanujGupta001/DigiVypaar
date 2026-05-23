const express = require('express');
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");

require('dotenv').config();
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST',' PUT', 'DELETE'],
    credentials: true
}));

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    },
});

io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);
    
    socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
})

app.use(express.json({limit: "10mb"}));
app.use(express.json());
app.set("io", io);
app.use(cookieParser());
