const PixelPusher = require('node-pixel-pusher')
const nodeCanvas = require('canvas')

const service = new PixelPusher.Service()

const MAX_FPS = 30

class shape {
  constructor(x,y,w,h,color) {
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    this.color=color;
  }
}

var shapes = [];

service.on('discover', (device) => {
  createRenderer(device)
})

function createRenderer(device) {
  const width = device.deviceData.pixelsPerStrip
  const height = device.deviceData.numberStrips
  const canvas = nodeCanvas.createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  console.log(`Creating renderer ${width}x${height} ${MAX_FPS}fps`)

  device.startRendering(() => {
    // Remove the first object if necessary
    if (shapes.length === 10) {
      // Remove the first object
      shapes.shift();
    }

    // Add a random shape to the list
    shapes.push(new shape(Math.random() * width,Math.random() * height, Math.random() * width/2, Math.random() * height/2, getRandomColor()));

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Start drawing
    shapes.forEach(shape => {
      ctx.fillStyle=shape.color;
      ctx.fillRect(shape.x,shape.y,shape.w,shape.h);
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