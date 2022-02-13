const express = require("express");
const { Accelerometer, Board } = require("johnny-five");
const socket = require("socket.io");

let fullData = [];

const app = express();
const board = new Board();
const server = app.listen(3000, () => {
    console.log("listening at 3000");
});
const io = socket(server);

app.use(express.static("public"));

io.sockets.on('connection', (socket) => {
    console.log("new connection: " + socket.id);

    socket.on('start', (data) => {
        socket.emit('start', fullData);
    });
});

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
