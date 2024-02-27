const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const todoRoutes = require('./routes/todos');
require('dotenv').config();
const conn = require('./config/database');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.use("/api/v1", todoRoutes);

conn.connect((err) => {
    if (err) {
        console.log("error", err);
    } else {
        console.log("Connected");
    }
});

// socket .io
function generateAndSendMessage() {
    const time = Math.floor(Math.random() * 20) + 10;
    io.emit("message", time);
    setTimeout(generateAndSendMessage, (time * 1000) + 8000);
}

let x = true;
io.on('connection', (socket) => {
    if (x) {
        console.log("Function called");
        generateAndSendMessage();
        x = false;
    }
});

app.get("/", (req, res) => {
    res.send(`<h1>This is run at ${PORT}</h1>`);
});

server.listen(PORT, () => {
    console.log("Server listening on port", PORT);
});
