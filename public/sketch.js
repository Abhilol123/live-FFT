let socket;
let fullData = [];
let inputSignal = [];
let delay = 500;

function setup() {
    createCanvas(1000, 400);
    background(51);

    socket = io.connect("http://localhost:3000");
    socket.on('start', (data) => {

        if (data.length < delay) {
            socket.emit("start", "less data");
        }

        else {
            fullData = data;
            inputSignal = fullData.slice(fullData.length - delay);
            drawSomething();
            socket.emit("start", "need more data");
        }
    });
}

function draw() {
    let data = "in draw loop"
    socket.emit("start", data);
    noLoop();
}

const res = 300; // Samples per second
const startFreq = 0;
const endFreq = 50;

// graph
const resfact = 10;

let myFFT = [];
let factor;

let fftSolution = [];

function drawSomething() {
    background(51);

    let valX = 0;
    let valY = 0;

    myFFT.maxi = 0;
    myFFT.freq = 0;

    let frequency = startFreq;

    for (let j = startFreq * resfact; j < endFreq * resfact; j++) {
        factor = 2 * j/resfact * Math.PI / res;
        valX = 0;
        valY = 0;
        for (let i = 0; i < inputSignal.length; i++) {
            const r = 100 * inputSignal[i];
            let x = r * Math.cos(i * factor);
            let y = r * Math.sin(i * factor);
            valX += x;
            valY += y;
        }

        frequency = frequency + (endFreq - startFreq)/(resfact * 100);
        const num = dist(valX, valY, 0, 0, 0, 0);

        myFFT.push([frequency, num]);

        if (num > myFFT.maxi) {
            myFFT.maxi = num;
            myFFT.freq = j/resfact;
        }
    }

    stroke(255);
    strokeWeight(1);
    noFill();

    beginShape();
    fftSolution.push(["Frequency", "value"]);
    for (let i = 0; i < myFFT.length; i++) {
        fftSolution.push([myFFT[i][0], height - map(myFFT[i][1], 0, myFFT.maxi, height, 0)]);
        vertex(map(i, 0, myFFT.length, 0, width), map(myFFT[i][1], 0, myFFT.maxi, height, 0));
    }
    endShape();

    myFFT = [];
    fftSolution = [];
}

function mousePressed() {
    if (mouseX > 0 && mouseX < width && mouseY < height && mouseY > 0) {
        let a = map(mouseX, 0, width, startFreq, endFreq);
        alert(a);
    }
}
