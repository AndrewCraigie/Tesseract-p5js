// Andrew Craigie 2018
// Trippy Tesseract Rotation in 4D Space

let tessRact1;

let uValue = 0;
let uT = 0;

let camR = 3000.0;

let camX = 0.0;
let camY = 0.0;
let camZ = 0.0;

let targetX = 0.0;
let targetY = 0.0;
let targetZ = 0.0;

let camDirX = 0.0;
let camDirY = 1.0;
let camDirZ = 0.0;

let alphaAngle = 120;
let betaAngle = 120;

let camAlpha = -18.5;
let camBeta = 45;


let showPoints = true;
let showAxises = true;
let showFaces = true;
let noLooping = false;

let orthoCam = false;

function toggleLoop() {
  noLooping = !noLooping;

}

function mousePressed() {
  toggleLoop();
  loop();
}

function updateCamera() {
  camX = camR * cos(radians(camAlpha)) * cos(radians(camBeta));
  camY = camR * sin(radians(camAlpha));
  camZ = camR * cos(radians(camAlpha)) * sin(radians(camBeta));
}

function setup() {
  const c = createCanvas(windowWidth, windowHeight, WEBGL);


  // Params: Side length, unitValue, x, y, z
  tessRact1 = new Tesseract(500, -0.2, 0, 0, 0);

  colorMode(HSB, 1.0, 1.0, 1.0, 1.0);

}



function trippyTesseract() {

  let sL = tessRact1.sideLength;

  if (showPoints) {
    for (let i = 0; i < tessRact1.nodes.length; i++) {

      let node = tessRact1.nodes[i];
      let h0 = map(node.unitW, -1, 1, 0.0, 1.0);

      fill(h0, 1.0, 1.0);
      noStroke();
      push();

      translate(node.x, node.y, node.z);
      sphere(50);

      for (let j = 0; j < 20; j++) {

        let jh = map(j, 0, 19, -TWO_PI, TWO_PI);

        let h = map(sin((jh / 20) + node.unitW), -1, 1, 0.0, 1.0);
        fill(h, 1.0, 1.0);

        translate(node.x * (0.5 * Math.sin(node.unitW * j)),
          node.y * (0.4 * Math.cos(node.unitW)),
          node.z * (0.5 * Math.cos(node.unitW)));

        sphere(30 + (j * node.unitW) + (j / 0.5));
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

function sandbox() {

  let sL = tessRact1.sideLength;

  if (showPoints) {
    for (let i = 0; i < tessRact1.nodes.length; i++) {

      let node = tessRact1.nodes[i];
      //let h0 = map(node.unitW , -1, 1 , 0.0, 1.0);
      let h0 = 0.2;

      let h = 0.6;
      fill(h, 1.0, 1.0);

      noStroke();
      push();

      translate(node.x, node.y, node.z);
      sphere(50);

      for (let j = 0; j < 20; j++) {

        //let jh = map(j, 0, 19, -TWO_PI, TWO_PI);
        //let h = map(sin((jh / 20) + node.unitW) , -1, 1 , 0.0, 1.0);
        //let h = 0.6;

        h = 0.8
        fill(h, 1.0, 1.0);


        // translate(node.x * (0.5 * Math.sin(node.unitW * j)) ,
        // 	node.y * (0.4 * Math.cos(node.unitW)),
        //  	node.z * (0.5 * Math.cos(node.unitW)));

        let tX = Math.sin(node.unitW * j) * 20;
        let tY = Math.cos(-node.unitY) * 20;
        let tZ = Math.sin(-node.unitW) * 20;

        //let tX = 30 * node.unitW;
        //let tY = 30 * node.unitW;
        //let tZ = 30 * node.unitW;

        translate(tX, tY, tZ);

        box(2 * (20 - j) + 10);


        //box(30 + (j * node.unitW) + (j / 0.5));
      }
      pop();

    }
  }

  if (showAxises) {

    for (let k = 0; k < tessRact1.faces.length; k++) {
      let face = tessRact1.faces[k];

      push();
      stroke(1.0, 0.0, 0.5);
      strokeWeight(10);
      if(showFaces){
        if(face.desc.charAt(0) == 'i'){
          fill(0.6, 1.0, 1.0, 0.25);
        } else {
          noFill();
        }


      } else {
        noFill();
      }


      beginShape();
      for (let nI = 0; nI < face.nodes.length; nI++) {
        let nod = face.nodes[nI];
        vertex(nod.x, nod.y, nod.z);
      }
      endShape(CLOSE);
      pop();

    }
  }

  tessRact1.rotate('XU', Math.PI * 0.005);
  //tessRact1.rotate('XY', Math.PI * 0.005);

  //uValue = 0.5
  //tessRact1.unitValue = uValue;

  uT += 0.01;

}

function draw() {
  background(1.0, 0.0, 1.0);

  updateCamera();
  camera(camX, camY, camZ, targetX, targetY, targetZ, camDirX, camDirY, camDirZ);

  if (orthoCam) {
    let m = width / height;
    let w = ((width) * m / 2) * (camR / height);
    let h = ((height) / 2) * (camR * m / height);
    ortho(-w, w, -h, h, -5000, 5000);
  } else {
    perspective();
  }
  noStroke();


  //trippyTesseract();
  sandbox();

  if (noLooping) {
    noLoop();
  }


}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
