const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const todoRoutes = require("./routes/todos");
require("dotenv").config();
const conn = require("./config/database");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
  },
});

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.use("/api/v1", todoRoutes);

try {
  conn.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
    } else {
      console.log("Connected to the database");
    }
  });
} catch (e) {
  console.error("Error:", e);
}

const array = [
  1, 20, 2, 30, 1, 60, 10, 1, 3, 18, 1, 17, 12, 40, 10, 1, 2, 3, 1, 2, 12, 13,
  10, 1, 2, 1, 20, 50, 2, 1,
];

function generateAndSendMessage() {
  const value = Math.floor(Math.random() * array.length - 1) + 1;
  const time = array[value] || 12;
  io.emit("message", time);

  let fly_time = 0;
  let milliseconds = 0;
  let seconds = 0;

  io.emit("setloder", false);
  io.emit("isFlying", true);

  const timerInterval = setInterval(() => {
    if (milliseconds === 100) {
      seconds += 1;
      milliseconds = 0;
    }

    io.emit("seconds", `${String(milliseconds).padStart(2, "0")}_${seconds}`);
    const newTime = fly_time + 1;

    if (newTime >= time * 1000) {
      clearInterval(timerInterval);
      fly_time = 0;
      milliseconds = 0;
      seconds = 0;
    }

    milliseconds += 1;
    fly_time = newTime;
  }, 100);

  setTimeout(() => {
    io.emit("isFlying", false);
    clearInterval(timerInterval);
  }, time * 1000);

  setTimeout(() => {
    clearInterval(timerInterval);
    io.emit("setcolorofdigit", true);
  }, (5 + ((time - 5) / 5 - 0.3) * 5) * 1000);

  setTimeout(() => {
    io.emit("setcolorofdigit", false);
    io.emit("setloder", true);
  }, time * 1000 + 3000);

  setTimeout(generateAndSendMessage, time * 1000 + 8000);
}

// color prediction game time generated every 1 min
function generatedTimeEveryAfterEveryOneMin() {
  let seconds = 59;
  const interval = setInterval(() => {
    io.emit("onemin", seconds);
    // console.log("time",seconds);
    seconds--;
    if (seconds < 0) {
      seconds = 59;
      clearInterval(interval);
      generatedTimeEveryAfterEveryOneMin();
    }
  }, 1000);
}

// color prediction game time generated every 3 min
const generatedTimeEveryAfterEveryThreeMin = () => {
  let min = 2;
  let sec = 59;

  const interval = setInterval(() => {
    io.emit("threemin", `${min}_${sec}`);
    sec--;

    if (sec < 0) {
      sec = 59;
      min--;

      if (min < 0) {
        sec = 59;
        min = 2;
        clearInterval(interval);
        generatedTimeEveryAfterEveryThreeMin();
      }
    }
  }, 1000);
};

const generatedTimeEveryAfterEveryFiveMin = () => {
  let min = 4;
  let sec = 59;

  const interval = setInterval(() => {
    io.emit("fivemin", `${min}_${sec}`);

    sec--;

    if (sec < 0) {
      sec = 59;
      min--;

      if (min < 0) {
        sec = 59;
        min = 4;
        clearInterval(interval);
        generatedTimeEveryAfterEveryFiveMin();
      }
    }
  }, 1000);
};

let lastEmittedNumber = "1_2_3_4_5";

const changeImagesPer6Hours = () => {
  setInterval(() => {
    const newNumber = `${(Number(lastEmittedNumber?.split("_")[0]) + 1) % 10}_${
      (Number(lastEmittedNumber?.split("_")[1]) + 1) % 10
    }_${(Number(lastEmittedNumber?.split("_")[2]) + 1) % 10}_${
      (Number(lastEmittedNumber?.split("_")[3]) + 1) % 10
    }_${(Number(lastEmittedNumber?.split("_")[4]) + 1) % 10}`;
    io.emit("changeimage", newNumber);
    lastEmittedNumber = newNumber;
  }, 1*60*60 * 1000); // every 6 hours
};

let x = true;
io.on("connection", (socket) => {
  if (lastEmittedNumber) {
    socket.emit("changeimage", lastEmittedNumber);
    console.log("new user connecton");
  }
  if (x) {
    console.log("Functions called");
    generateAndSendMessage(); // aviator game every random time
    generatedTimeEveryAfterEveryOneMin(); // color prediction game every 1 time generating time
    generatedTimeEveryAfterEveryThreeMin(); // color prediction game every 3 time generating time
    generatedTimeEveryAfterEveryFiveMin(); // color prediction game every 5 time generating time
    changeImagesPer6Hours();
    x = false;
  }
});

app.get("/", (req, res) => {
  res.send(`<h1>socket port Run at ${PORT}</h1>`);
});

httpServer.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
