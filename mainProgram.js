const WebSocket = require("ws")
const { drawColor, drawText, setupVisuals } = require("./lib/drawing.js")
const { pixelpusherInit } = require("./lib/pixelPusherInit.js")
const nodeCanvas = require('canvas')

const adress = "ws://192.168.100.1:8080"
let ws = null

//start the pixelpusher
const service = pixelpusherInit()
// const PixelPusher = require('node-pixel-pusher')
// const service = new PixelPusher.Service()

const STATES = {
	procesQueue: "procesQueue", awaitInstruction: "awaitInstructions", showText: "showText", setup: "Setup",
	disconnected: "disconnected", showColor: "color", fail: "fail"
}

let initStage = "pre-init"
let state = STATES.setup //we starten in setup mode zodat we kunnen synchroniseren met de hoofdpi

let activeColor = null
let queue = [1, 2, 3, 4]
let queuePointer = 0

const defaultShowSpeed = 10
let showSpeed = 10
let showTicks = showSpeed


//START SCRIPT
const MAX_FPS = 30

service.on('discover', (device) => {
	setup(device)
})

function setup(device) {
	const width = device.deviceData.pixelsPerStrip
	const height = device.deviceData.numberStrips
	const canvas = nodeCanvas.createCanvas(width, height)
	const ctx = canvas.getContext('2d')

	const { colorLib, setupText } = setupVisuals(width, height)

	// Event handler for WebSocket messages from server

	ws = initWebsocket(new WebSocket(adress))

	// Create a WebSocket server
	device.startRendering(() => {
		//console.log(state)
		ctx.clearRect(0, 0, width, height);

		//draw the correct screen
		switch (state) {
			case STATES.procesQueue:
				if (showTicks > 0) {
					showTicks--
				} else {
					showTicks = showSpeed
					queuePointer++
				}

				if (queuePointer >= queue.length) {
					sendMessage("queueDone", {}, ws)
					state = STATES.awaitInstruction;
					return
				}

				drawColor(queue[queuePointer], colorLib, ctx)
				break;

			case STATES.showColor:
				if (showTicks > 0) {
					showTicks--
				} else {
					sendMessage("colorDone", {}, ws)
					state = STATES.awaitInstruction
				}
				drawColor(activeColor, colorLib, ctx)

				break;

			case STATES.fail:
				if (showTicks > 0) {
					showTicks--
				} else {
					state = STATES.awaitInstruction
				}
				drawColor(activeColor, colorLib, ctx)

				break;

			case STATES.showText:
				//vervang met ontvangen tekst
				drawText("READY", { font: "20px comic sans" }, width, height, ctx)
				break;

			case STATES.setup:
				drawText(setupText[initStage].text, setupText[initStage], width, height, ctx)
				break;

			case STATES.awaitInstruction:
				//doe letterlijk absoluut in geen enkel mogelijk geval een enkel peteuterig klein dingetje.
				break;

			case STATES.disconnected:
				drawText("server\nerror", { font: "24px Times New Roman", align: "center", baseline: "middle", y: height / 3.5, color: "white" }, width, height, ctx)
				break;
			default:
				console.log("ILLEGAL STATE")
				break;
		}

		// Get data
		const ImageData = ctx.getImageData(0, 0, width, height)

		// Send data to LEDs
		device.setRGBABuffer(ImageData.data)
	}, MAX_FPS)
}

//SERVER CODE
const initWebsocket = (wsc) => {
	// Event handler for WebSocket connection open
	wsc.on('open', function open() {
		console.log('Connected to WebSocket server');
	});

	wsc.on('message', (message) => { incoming(message, ws); return false });

	// Event handler for WebSocket connection close
	wsc.on('close', () => {
		console.log('WebSocket connection closed');
		console.log("attempting reconnect")
		ws.close()
		ws.terminate()
		ws = null
		setTimeout(() => {
			ws = initWebsocket(new WebSocket(adress))
		}, 1000)

		state = STATES.disconnected
	});

	// Event handler for WebSocket errors
	wsc.on('error', function error(err) {
		console.error('WebSocket error:', err.message);
	});

	wsc.onerror = function (err) {
		console.error('WebSocket error:', err.message);
	}


	return wsc
}


function incoming(message, ws) {
	const decodedMessage = JSON.parse(message.toString()); // Decode the buffer to obtain the original string

	console.log('Received message from server:', decodedMessage);
	// Check for certain message types
	if (decodedMessage.type === 'setup') {
		console.log('Received setup message from server');
		initStage = decodedMessage.data.stage

		/*start de instalatie op*/
		if (initStage === "ready") {
			state = STATES.awaitInstruction
		}

		// Handle setup message
	} else if (decodedMessage.type === 'data') {
		console.log('Received data message from server');
		// Handle data message

	} else if (decodedMessage.type === 'colorQueue') {
		console.log("Queue data got, processing..")
		resetQueue()
		queue = decodedMessage.data.queue
		state = STATES.procesQueue

	} else if (decodedMessage.type === "color") {
		if (decodedMessage.data.color !== null && decodedMessage.data.color !== undefined) {
			console.log(`Showing color: ${decodedMessage.data.color}`)
			resetQueue()
			activeColor = decodedMessage.data.color
			state = STATES.showColor
		}

	} else if (decodedMessage.type === "fail") {
		console.log("FAILED")
		resetQueue(1)
		for (let i = 0; i < 20; i++) {
			queue.push(5)
			queue.push(6)
		} // fail color
		console.log(queue)
		console.log()
		state = STATES.procesQueue

	} else {
		console.log('Received unknown message from server');
		console.log(decodedMessage.type)
		// Handle unknown message
	}

	//ws.send(JSON.stringify({ type: "ACK" }));
}

function sendMessage(type, data, ws) {
	const message = JSON.stringify({ type: type, data: data });

	if (ws.readyState === WebSocket.OPEN) {
		ws.send(message, (error) => {
			if (error) {
				console.error('Error sending message:', error.message);
			} else {
				console.log('Message sent successfully:', message);
			}
		});
		console.log("Message sent. State:", ws.readyState);
	} else {
		console.warn("WebSocket is not open. Message not sent.");
	}
}

function resetQueue(newShowSpeed) {
	if (!newShowSpeed) { showSpeed = defaultShowSpeed } else { showSpeed = newShowSpeed }

	showTicks = showSpeed
	queuePointer = 0
	queue = []
}