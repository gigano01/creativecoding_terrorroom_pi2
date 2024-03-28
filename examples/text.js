const PixelPusher = require('node-pixel-pusher')
const nodeCanvas = require('canvas')

const service = new PixelPusher.Service()

const MAX_FPS = 30

service.on('discover', (device) => {
  createRenderer(device)
})

const STYLES = ["", "20px Times New Roman"];
const COLORS = ["red",'green','yellow'];

function createRenderer(device) {
  const width = device.deviceData.pixelsPerStrip
  const height = device.deviceData.numberStrips
  const canvas = nodeCanvas.createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  console.log(`Creating renderer ${width}x${height} ${MAX_FPS}fps`)

  device.startRendering(() => {
    // Clear the canvas
    ctx.fillStyle = 'black'
    ctx.fillRect(0,0,width, height)
    
    // Start drawing
    ctx.font = "20px Arial";
    ctx.fillStyle = "RED";
    ctx.fillText('Hello, World!', 0, 48);

    // Get data
    const ImageData = ctx.getImageData(0, 0, width, height)

    // Send data to LEDs
    device.setRGBABuffer(ImageData.data)
  }, MAX_FPS) 
}

function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min + 1) + min
  )
}