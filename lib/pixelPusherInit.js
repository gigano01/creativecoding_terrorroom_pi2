const PixelPusher = require('node-pixel-pusher')
const { exec } = require('child_process');

function pixelpusherInit() {
	// Execute the push.sh script
	exec('sudo bash /home/pi/project/rpi-matrix-pixelpusher/push.sh -d', (error, stdout, stderr) => {
		if (error) {
			console.error(`Error executing push.sh: ${error}`);
			pixelpusherInit()
			return;
		}
		console.log(`stdout: ${stdout}`);
		console.error(`stderr: ${stderr}`);
	});
	return new PixelPusher.Service()
}
module.exports = { pixelpusherInit }