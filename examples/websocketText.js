const PixelPusher = require('node-pixel-pusher')
const nodeCanvas = require('canvas')
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 7071 });

const service = new PixelPusher.Service()

const MAX_FPS = 30

class word {
  constructor(string,x,y,size,color,font) {
    this.string=string;
    this.x=x;
    this.y=y;
    this.size=size;
    this.color=color;
    this.font=font;
  }
}

var words = [];
var counter = 0;

const fonts = ["Arial", "Times New Roman"];

service.on('discover', (device) => {
  createRenderer(device)
})

function createRenderer(device) {
  const width = device.deviceData.pixelsPerStrip
  const height = device.deviceData.numberStrips
  const canvas = nodeCanvas.createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  console.log(`Creating renderer ${width}x${height} ${MAX_FPS}fps`)

  wss.on('connection', (ws) => {
    console.log("Hello!");
  
    ws.on('message', (msg) => {
      // Buffer to string
      var data = msg.toString();
      console.log(data);
      
      // Remove the first object if necessary
      if (words.length === 10) {
        // Remove the first object
        words.shift();
      }
      words.push(new word(data, width, Math.random() * (height-10) + 10, getRandomInt(15,30), getRandomColor(), fonts[getRandomInt(0,1)]));
    });
  });
  
  device.startRendering(() => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Start drawing
    words.forEach(word => {
      ctx.fillStyle = word.color;
      ctx.font = word.size + "px " + word.font;
      ctx.fillText(word.string, word.x, word.y);
      //shift each word to the left
      word.x-=1;
    });
    
    // Get data
    const ImageData = ctx.getImageData(0, 0, width, height)

    // Send data to LEDs
    device.setRGBABuffer(ImageData.data)
  }, MAX_FPS) 
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}