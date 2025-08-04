import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ,
        getMaxSize} from "../libs/util/util.js";
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js';


let scene, renderer, camera, material, light, orbit;; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);


// LOAD EXTERNAL OBJECT

loadGLBFile('../assets/objects/', 'toonTank', true, 2.0);

function loadGLBFile(modelPath, modelName, visibility, desiredScale)
{
   var loader = new GLTFLoader( );
   loader.load( modelPath + modelName + '.glb', function ( gltf ) {
      var obj = gltf.scene;
      obj.name = modelName;
      obj.visible = visibility;
      obj.traverse( function ( child ) {
         if( child.isMesh ) child.castShadow = true;
         if( child.material ) child.material.side = THREE.DoubleSide;         
      });

      var obj = normalizeAndRescale(obj, desiredScale);
      var obj = fixPosition(obj);

      scene.add ( obj );   
    });
}

function normalizeAndRescale(obj, newScale)
{
  var scale = getMaxSize(obj); 
  obj.scale.set(newScale * (1.0/scale),
                newScale * (1.0/scale),
                newScale * (1.0/scale));
  return obj;
}

function fixPosition(obj)
{
  // Fix position of the object over the ground plane
  var box = new THREE.Box3().setFromObject( obj );
  if(box.min.y > 0)
    obj.translateY(-box.min.y);
  else
    obj.translateY(-1*box.min.y);
  return obj;
} 

// MAKE OBJECT WITH POINTS

// need to add a square on top and a rectangle on the bottom with points
// so the coords of the square on y = 4 will be (0,4,0) (4,4,0) (4,4,4) (0,4,4)
// now we need the four points on the bottom
// (0,0,0), (8,0,0), (8,0,4), (0,0,4)

/*
let v = [
  0, 4, 0, // 0
  4, 4, 0, // 1
  4, 4, 4, // 2
  0, 4, 4, // 3
  0, 0, 0, // 4
  8, 0, 0, // 5
  8, 0, 4, // 6
  0, 0, 4  // 7
];
// create the square faces
let f = [
  // A face on top, standard 
  // B face on top, inclinated (right face)
  // C face on bottom
  // D face on the front~
  // E face on the back
  // F face on the left 
  0, 2, 3, // A1
  0, 1, 2, // A2
  1, 2, 5, // B1
  2, 5, 6, // B2
  4, 6, 7, // C1
  4, 5, 6, // C2
  0, 1, 4, // D1
  1, 4, 5, // D2
  2, 3, 7, // E1
  2, 6, 7, // E2
  0, 3, 7, // F1
  0, 4, 7  // F2
]
//compute the normals
let n = [
  0, 1, 0, // A1
  0, 1, 0, // A2
  1, 0, 0, // B1
  1, 0, 0, // B2
  0, -1, 0, // C1
  0, -1, 0, // C2
  -1, 0, 0, // D1
  -1, 0, 0, // D2
  0, -1, -1, // E1
  0, -1, -1, // E2
  -1, -1, -1, // F1
  -1, -1, -1 // F2
];

// set buffer attributes
var vertices = new Float32Array(v);
var normals = new Float32Array(n);
var indices = new Uint16Array(f);

// set buffer geometry
let geometry = new THREE.BufferGeometry();

geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
geometry.setIndex(new THREE.BufferAttribute(indices, 1));
geometry.computeVertexNormals(); // Compute normals if not provided

material = new THREE.MeshPhongMaterial({
  color: 0x00ff00, // Set a color for the mesh
  side: THREE.DoubleSide // Render both sides of the mesh
});
material.side = THREE.DoubleSide; // Ensure both sides are rendered
material.flatShading = true; // Use flat shading for the material
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh); // Add the mesh to the scene
*/

// Use this to show information onscreen
let controls = new InfoBox();
  controls.add("Basic Scene");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.show();

render();
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}