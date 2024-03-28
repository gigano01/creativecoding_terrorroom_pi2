function drawColor (color, colorLib, ctx) {
	const colorData = colorLib[color]
	ctx.fillStyle = colorData.c
	ctx.fillRect(colorData.x,colorData.y,colorData.w,colorData.h)
}

function drawText(text,style, vw, vh, ctx) {
	let x, y
	if (style.x != undefined) {x = style.x} else {x = vw / 2}
	if (style.y != undefined) {y = style.y} else {y = vh / 2}

	ctx.fillStyle = style.color
	ctx.font = style.font
	ctx.textAlign = style.align
	ctx.textBaseline = style.baseline

	ctx.fillText(text, x, y)
}

//SETUP VARIABLES
function setupVisuals(width, height) {
	const colorLib = {
		1: {
			x: 0, y: 0, w: width / 2, h: height / 2, c: 'red' //rood
		},
		2: {
			x: width / 2, y: 0, w: width / 2, h: height / 2, c: "yellow" //geel
		},
		3: {
			x: 0, y: height / 2, w: width / 2, h: height / 2, c: "green" //groen
		},
		4: {
			x: width / 2, y: height / 2, w: width / 2, h: height / 2, c: "blue" //blauw
		},
		5: {
			x: 0, y: 0, w: width, h: height, c: "rgb(255,0,0)" //fout ROOD
		},
		6: {
			x: 0, y: 0, w: width, h: height, c: "rgb(255,255,255)" //fout WIT
		},
		7: {
			x: 0, y: height / 2, w: width, h: height / 2, c: "rgb(3, 252, 107)" //appelblauwzeegroen (blauw & groen)
		},
		8: {
			x: 0, y: 0, w: width, h: height/2, c: "rgb(252, 136, 3)" //oranje (rood & geel)
		},
		9: {
			x: width / 2, y: height / 2, w: width / 2, h: height / 2, c: "red" //verkeerd rood
		},
		10: {
			x: 0, y: height / 2, w: width / 2, h: height / 2, c: "yellow" //verkeerd geel
		},
		11: {
			x: width / 2, y: 0, w: width / 2, h: height / 2, c: "green" // verkeerd groen
		},
		12: {
			x: 0, y: 0, w: width / 2, h: height / 2, c: "blue" //verkeerd blauw
		},	
	}
	
	let setupText = {
		"pre-init": {
			font:  "15px Comic Sans", color: "white", text: "STARTUP", align: "center", baseline:"middle"
		},
		"init": {
			font:  "12px areal", color: "white", text: "de servr is\nop aan het \nstarten \nevn gdld!", align: "left", baseline:"top",x:0,y:0
		},
		"ready": {
			font:  "18px Comic Sans", color: "white", text: "READY",align: "center", baseline:"middle"
		}
	}

	return { colorLib, setupText }
}

module.exports = { drawColor, drawText, setupVisuals }