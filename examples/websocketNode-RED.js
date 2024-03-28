const PixelPusher = require('node-pixel-pusher')
const nodeCanvas = require('canvas')
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 7071 });

const service = new PixelPusher.Service()

const MAX_FPS = 30

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
  
    ws.on('message', async (msg) => {
      var data = msg.toString();
      //console.log(data);
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Start drawing
      var myimg = await nodeCanvas.loadImage(data);
      ctx.drawImage(myimg, 0, 0, width, height);
    });
  });
  
  device.startRendering(() => {
    // Get data
    const ImageData = ctx.getImageData(0, 0, width, height)

    // Send data to LEDs
    device.setRGBABuffer(ImageData.data)
  }, MAX_FPS) 
}