let fullData = [];

const express = require("express");

const app = express();
const server = app.listen(3000, () => {
    console.log("listening at 3000");
});
app.use(express.static("public"));

const socket = require("socket.io");

const io = socket(server);

io.sockets.on('connection', (socket) => {
    console.log("new connection: " + socket.id);

    socket.on('start', (data) => {
        socket.emit('start', fullData);
    });
});

const { Accelerometer, Board } = require("johnny-five");
const board = new Board();

board.on("ready", () => {
    const accelerometer = new Accelerometer({
        controller: "MPU6050"
    });

    accelerometer.on("change", () => {
        const { acceleration, inclination, orientation, pitch, roll, x, y, z } = accelerometer;
        fullData.push(acceleration);

        if (fullData.length > 2000) {
            fullData = fullData.slice(fullData.length - 1100);
        }
    });
});
