const PixelPusher = require('node-pixel-pusher')
const nodeCanvas = require('canvas')
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 5078 });

const service = new PixelPusher.Service()

const MAX_FPS = 30

service.on('discover', (device) => {
	setup(device)
})

function setup(device){
	const width = device.deviceData.pixelsPerStrip
	const height = device.deviceData.numberStrips
	const canvas = nodeCanvas.createCanvas(width, height)
	const ctx = canvas.getContext('2d')

	device.startRendering(() => {
		// Clear canvas
		ctx.clearRect(0, 0, width, height);
		
		const ImageData = ctx.getImageData(0, 0, width, height)

		// Send data to LEDs
		device.setRGBABuffer(ImageData.data)
	}, MAX_FPS) 
}