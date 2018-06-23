// Andrew Craigie 2018
// Trippy Tesseract Rotation in 4D Space

let tessRact1;

let uValue = 0;
let uT = 0;

let showPoints = true;
let showAxises = false;

function setup() {
	const canvas = createCanvas(windowWidth, windowHeight, WEBGL);

			// Params: Side length, unitValue, x, y, z
	tessRact1 = new Tesseract(80, uValue, 0, 0, 0);

	colorMode(HSB, 1.0, 1.0, 1.0, 1.0);

}

function draw() {
	background(1.0, 0.0, 0.0);

	camera(1500, -400, 1500, 0, 0, 0, 0, 1, 0);

	let sL = tessRact1.sideLength;

	if (showPoints){
		for (let i = 0; i < tessRact1.nodes.length; i++){

			let node = tessRact1.nodes[i];
			let h0 = map(node.unitU , -1, 1 , 0.0, 1.0);

			fill(h0, 1.0, 1.0);
			noStroke();
			push();

			translate(node.x , node.y, node.z);
			sphere(50);

			for (let j = 0; j < 20; j++){

				let jh = map(j, 0, 19, -TWO_PI, TWO_PI);

				let h = map(sin((jh / 20) + node.unitU) , -1, 1 , 0.0, 1.0);
				fill(h, 1.0, 1.0);

				translate(node.x * (0.5 * Math.sin(node.unitU * j)) ,
					node.y * (0.4 * Math.cos(node.unitU)),
				 	node.z * (0.5 * Math.cos(node.unitU)));

				sphere(30 + (j * node.unitU) + (j / 0.5));
			}
			pop();

		}
	}

	tessRact1.rotate('XU', Math.PI * 0.005);
	tessRact1.rotate('XY', Math.PI * 0.005);

	uValue = 0.5
	tessRact1.unitValue = uValue;

	uT += 0.01;

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
