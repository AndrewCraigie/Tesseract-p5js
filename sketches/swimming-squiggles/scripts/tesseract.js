// © Andrew Craigie 2018
// Tesseract

class Tesseract {


  constructor(sideLength, unitValue, x, y, z) {


    this.sideLength = sideLength;
    this.unitValue = unitValue;

    this.x = x;
    this.y = y;
    this.z = z;

    this.nodes = this.makeNodes(this.pointDefs, this.sideLength, this.x, this.y, this.z);
    this.faces = this.makeFaces(this.faceDefs, this.nodes);

  }


}

Tesseract.prototype.Trans4D = function(){

  this.cosA = t => Math.cos(t);
  this.sinA = t => Math.sin(t);
  this.negCosA = t => -Math.cos(t);
  this.negSinA = t => -Math.sin(t);

  /* beautify preserve:start */
  this.XY = [

    [this.cosA, this.negSinA, 0,      0     ],
    [this.sinA, this.cosA,    0,      0     ],
    [    0,         0,        1,      0     ],
    [    0,         0,        0,      1     ]

  ];

  this.YZ = [

    [    1,       0,          0,      0     ],
    [    0,  this.cosA,   this.sinA,  0     ],
    [    0,  this.negSinA,this.cosA,  0     ],
    [    0,       0,          0,      1     ]

  ];

  this.XZ = [

    [this.cosA,   0,    this.negSinA, 0     ],
    [    0,       1,          0,      0     ],
    [this.sinA,   0,      this.cosA,  0     ],
    [    0,       0,          0,      1     ]

  ];

  this.XW = [

    [this.cosA,   0,         0,   this.sinA ],
    [    0,       1,         0,       0     ],
    [    0,       0,         1,       0     ],
    [this.negSinA,0,         0,   this.cosA ]

  ];

  this.YW = [

    [    1,       0,        0,        0     ],
    [    0,   this.cosA,    0, this.negSinA ],
    [    0,       0,        1,        0     ],
    [    0,   this.sinA,    0,   this.cosA  ]

  ];

  this.ZW = [

    [    1,       0,        0,         0       ],
    [    0,       1,        0,         0       ],
    [    0,       0,    this.cosA, this.negSinA],
    [    0,       0,    this.sinA,  this.cosA  ]

  ];
 /* beautify preserve:end */

};

Tesseract.prototype.trans4D = new Tesseract.prototype.Trans4D();

// Tesseract.prototype.rotate = function(plane, t) {
//
//   // Work in progress!!
//
//   let rotMat = this.trans4D[plane];
//
//   for (let i = 0; i < this.nodes.length; i++) {
//
//     let n = this.nodes[i];
//     let axes = [
//       ['unitX', n.unitX],
//       ['unitY', n.unitY],
//       ['unitZ', n.unitZ],
//       ['unitW', n.unitW]
//     ];
//
//
//     for (let i = 0; i < axes.length; i++) {
//
//       let axisLetter = axes[i][0];
//       let value = axes[i][1];
//
//       let tempValue = 0;
//       let matLine = rotMat[i];
//
//       for (fx of matLine) {
//         if (typeof fx === 'function') {
//           tempValue += value * fx.call(null, t);
//         } else if (fx === 1) {
//           tempValue = value;
//         }
//       }
//
//       // Node unit values have been updated
//       n[axisLetter] = tempValue;
//     }
//
//     // Need to calculate x,y,z values
//     n.x = n.unitX ;
//     n.y = n.unitY ;
//     n.z = n.unitZ ;
//     n.u = n.unitW ;
//
//   }
//
// };

Tesseract.prototype.rotate = function(plane, t){

  // TODO: Work out a way to refactor cases
  // to call the same function passing in the
  // appropriate rotation matrix

  let sinA = Math.sin(t);
  let cosA = Math.cos(t);

  switch (plane) {
    case "XY":
      for (let i = 0; i < this.nodes.length; i++) {

        let n = this.nodes[i];
        let newX =  n.unitX * cosA + n.unitY * -(sinA);
        let newY = n.unitX * sinA + n.unitY * cosA;

        let r = 1 - (1 - n.unitW * this.unitValue) * this.sideLength;

        n.unitX = newX;
        n.unitY = newY ;

        n.x = n.unitX * r + this.x;
        n.y = n.unitY * r + this.y;
        n.z = n.unitZ * r + this.z;
        n.u = n.unitW * r;

      }
    break;
    case "YZ":
      for (let i = 0; i < this.nodes.length; i++) {

        let n = this.nodes[i];
        let newY = n.unitY * cosA + n.unitZ * sinA;
        let newZ = n.unitY * -(sinA) + n.unitZ * cosA;

        let r = 1 - (1 - n.unitW * this.unitValue) * this.sideLength;

        n.unitY = newY;
        n.unitZ = newZ;

        n.x = n.unitX * r + this.x;
        n.y = n.unitY * r + this.y;
        n.z = n.unitZ * r + this.z;
        n.u = n.unitW * r;

      }
    break;
    case "XZ":
    for (let i = 0; i < this.nodes.length; i++) {

      let n = this.nodes[i];
      let newX = n.unitX * cosA + n.unitZ * -(sinA);
      let newZ = n.unitX * sinA + n.unitZ * cosA;

      let r = 1 - (1 - n.unitW * this.unitValue) * this.sideLength;

      n.unitX = newX;
      n.unitZ = newZ;

      n.x = n.unitX * r + this.x;
      n.y = n.unitY * r + this.y;
      n.z = n.unitZ * r + this.z;
      n.u = n.unitW * r;

    }
    break;
    case "XU":
      for (let i = 0; i < this.nodes.length; i++) {

        let n = this.nodes[i];
        let newX =  n.unitX * cosA + n.unitW * sinA;
        let newW = -(n.unitX * sinA) + n.unitW * cosA;

        let r = 1 - (1 - n.unitW * this.unitValue) * this.sideLength;

        n.unitX = newX;
        n.unitW = newW ;

        n.x = n.unitX * r + this.x;
        n.y = n.unitY * r + this.y;
        n.z = n.unitZ * r + this.z;
        n.u = n.unitW * r;

      }
    break;
    case "YU":
      for (let i = 0; i < this.nodes.length; i++) {

        let n = this.nodes[i];
        let newY = n.unitY * cosA + n.unitW * -(sinA);
        let newW = n.unitY * sinA + n.unitW * cosA;

        let r = 1 - (1 - n.unitW * this.unitValue) * this.sideLength;

        n.unitY = newY;
        n.unitW = newW ;

        n.x = n.unitX * r + this.x;
        n.y = n.unitY * r + this.y;
        n.z = n.unitZ * r + this.z;
        n.u = n.unitW * r;

      }
    break;
    case "ZU":
      for (let i = 0; i < this.nodes.length; i++) {

        let n = this.nodes[i];
        let newZ = n.unitZ * cosA + n.unitW * -(sinA);
        let newW = n.unitZ * sinA + n.unitW * cosA;

        let r = 1 - (1 - n.unitW * this.unitValue) * this.sideLength;

        n.unitZ = newZ;
        n.unitW = newW ;

        n.x = n.unitX * r + this.x;
        n.y = n.unitY * r + this.y;
        n.z = n.unitZ * r + this.z;
        n.u = n.unitW * r;

      }
    break;

  }

}


Tesseract.prototype.makeNodes = function(pointDefs, sideLength, x, y, z) {

  let nodes = [];

  for (let i = 0; i < pointDefs.length; i++) {

    const coords = pointDefs[i];
    // Calculate initial projection of points to 3D
    let r = 1 - (1 - coords[3] * this.unitValue) * this.sideLength;
    let node = {
      'id': i,
      'unitX': coords[0],// * this.unitValue ,
      'unitY': coords[1],// * this.unitValue ,
      'unitZ': coords[2],// * this.unitValue ,
      'unitW': coords[3],// * this.unitValue ,
      'x': coords[0] * r,
      'y': coords[1] * r,
      'z': coords[2] * r,
      'w': coords[3]
    }
    nodes[i] = node;
  }

  return nodes;
};

Tesseract.prototype.makeFaces = function(faceDefs, nodes) {

  let faces = [];

  for (let i = 0; i < faceDefs.length; i++) {

    let faceDef = faceDefs[i];
    let face = {
      'id': faceDef.id,
      'nodes': [
        nodes[faceDef.nodes[0]],
        nodes[faceDef.nodes[1]],
        nodes[faceDef.nodes[2]],
        nodes[faceDef.nodes[3]]
      ],
      'desc': faceDef.desc
    }

    faces[i] = face;

  }

  return faces;

};


Tesseract.prototype.pointDefs = [
  [-1.0, -1.0, -1.0, -1.0],
  [-1.0, -1.0, -1.0, 1.0],
  [-1.0, -1.0, 1.0, -1.0],
  [-1.0, -1.0, 1.0, 1.0],
  [-1.0, 1.0, -1.0, -1.0],
  [-1.0, 1.0, -1.0, 1.0],
  [-1.0, 1.0, 1.0, -1.0],
  [-1.0, 1.0, 1.0, 1.0],

  [1.0, -1.0, -1.0, -1.0],
  [1.0, -1.0, -1.0, 1.0],
  [1.0, -1.0, 1.0, -1.0],
  [1.0, -1.0, 1.0, 1.0],
  [1.0, 1.0, -1.0, -1.0],
  [1.0, 1.0, -1.0, 1.0],
  [1.0, 1.0, 1.0, -1.0],
  [1.0, 1.0, 1.0, 1.0],

  [-1.0, -1.0, -1.0, -1.0],
  [-1.0, -1.0, -1.0, 1.0],
  [-1.0, -1.0, 1.0, -1.0],
  [-1.0, -1.0, 1.0, 1.0],
  [-1.0, 1.0, -1.0, -1.0],
  [-1.0, 1.0, -1.0, 1.0],
  [-1.0, 1.0, 1.0, -1.0],
  [-1.0, 1.0, 1.0, 1.0],

  [1.0, -1.0, -1.0, -1.0],
  [1.0, -1.0, -1.0, 1.0],
  [1.0, -1.0, 1.0, -1.0],
  [1.0, -1.0, 1.0, 1.0],
  [1.0, 1.0, -1.0, -1.0],
  [1.0, 1.0, -1.0, 1.0],
  [1.0, 1.0, 1.0, -1.0],
  [1.0, 1.0, 1.0, 1.0],

];

Tesseract.prototype.faceDefs = [{
    'id': '0',
    'nodes': [0, 1, 3, 2],
    'desc': ''
  }, //  0
  {
    'id': '1',
    'nodes': [2, 3, 11, 10],
    'desc': ''
  }, //  1
  {
    'id': '2',
    'nodes': [10, 11, 9, 8],
    'desc': ''
  }, //  2
  {
    'id': '3',
    'nodes': [8, 9, 1, 0],
    'desc': ''
  }, //  3
  {
    'id': '4',
    'nodes': [0, 2, 10, 8],
    'desc': ''
  }, //  4

  {
    'id': '5',
    'nodes': [1, 3, 11, 9],
    'desc': 'inner bottom'
  }, //  5 Bottom inner face

  {
    'id': '6',
    'nodes': [4, 6, 7, 5],
    'desc': ''
  }, //  6
  {
    'id': '7',
    'nodes': [6, 14, 15, 7],
    'desc': ''
  }, //  7
  {
    'id': '8',
    'nodes': [14, 12, 13, 15],
    'desc': ''
  }, //  8
  {
    'id': '9',
    'nodes': [12, 4, 5, 13],
    'desc': ''
  }, //  9
  {
    'id': '10',
    'nodes': [4, 12, 14, 6],
    'desc': ''
  }, // 10

  {
    'id': '11',
    'nodes': [5, 13, 15, 7],
    'desc': 'inner top'
  }, // 11 Top inner face

  {
    'id': '12',
    'nodes': [0, 4, 5, 1],
    'desc': ''
  }, // 12 Flaps
  {
    'id': '13',
    'nodes': [2, 6, 7, 3],
    'desc': ''
  }, // 13
  {
    'id': '14',
    'nodes': [10, 11, 15, 14],
    'desc': ''
  }, // 14
  {
    'id': '15',
    'nodes': [8, 12, 13, 9],
    'desc': ''
  }, // 15

  {
    'id': '16',
    'nodes': [1, 5, 7, 3],
    'desc': ''
  }, // 16
  {
    'id': '17',
    'nodes': [3, 7, 15, 11],
    'desc': 'inner back'
  }, // 17  Back inner face

  {
    'id': '18',
    'nodes': [11, 15, 13, 9],
    'desc': ''
  }, // 18

  {
    'id': '19',
    'nodes': [9, 13, 5, 1],
    'desc': 'inner front'
  }, // 19 Front inner face

  {
    'id': '20',
    'nodes': [3, 7, 5, 1],
    'desc': ''
  }, // 20
  {
    'id': '21',
    'nodes': [9, 13, 15, 11],
    'desc': ''
  }, // 21

  {
    'id': '22',
    'nodes': [0, 4, 6, 2],
    'desc': ''
  }, // 22 Outer sides
  {
    'id': '23',
    'nodes': [2, 6, 14, 10],
    'desc': ''
  }, // 23
  {
    'id': '24',
    'nodes': [10, 14, 12, 8],
    'desc': ''
  }, // 24
  {
    'id': '25',
    'nodes': [8, 12, 4, 0],
    'desc': ''
  } // 25

];

Tesseract.prototype.axises = [
  [0, 1],
  [0, 2],
  [0, 4],
  [0, 8],

  [1, 3],
  [1, 5],
  [1, 9],

  [2, 3],
  [2, 6],
  [2, 10],

  [3, 2],
  [3, 7],
  [3, 11],

  [4, 5],
  [4, 6],
  [4, 12],

  [5, 7],
  [5, 13],

  [6, 7],
  [6, 14],

  [7, 15],

  [8, 9],
  [8, 10],
  [8, 12],

  [9, 11],
  [9, 13],

  [10, 11],
  [10, 14],

  [11, 15],

  [12, 13],
  [12, 14],

  [13, 15],

  [14, 15],
];
