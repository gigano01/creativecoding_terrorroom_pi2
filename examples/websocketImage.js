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
      // Buffer to string
      var data = msg.toString();
      console.log(data);
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Start drawing
      switch (data) {
        case 'Serge':
          var myimg = await nodeCanvas.loadImage('img/chomper.png');
          ctx.drawImage(myimg, 0, 0, width, height);
          break;
        case 'Wim':
          var myimg = await nodeCanvas.loadImage('img/cherry.png');
          ctx.drawImage(myimg, 0, 0, width, height);
          break;
        case 'Jonas':
          var myimg = await nodeCanvas.loadImage('img/walnut.png');
          ctx.drawImage(myimg, 0, 0, width, height);
          break;
        default:
          //some more cases
      }
    });
  });
  
  device.startRendering(() => {
    // Get data
    const ImageData = ctx.getImageData(0, 0, width, height)

    // Send data to LEDs
    device.setRGBABuffer(ImageData.data)
  }, MAX_FPS) 
}