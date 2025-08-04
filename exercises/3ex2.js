import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
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

const CIRCUMFERENCE_RADIUS = 8;

const CIRCUMFERENCE_RADIUS_2 = 5;

for (let i = 0; i < 12; i++) {
  let s1 = createSphere();
  s1.position.set(0, 0.5, 0);

  s1.translateX(CIRCUMFERENCE_RADIUS * Math.sin(THREE.MathUtils.degToRad(30 * i)));
  s1.translateZ(CIRCUMFERENCE_RADIUS * Math.cos(THREE.MathUtils.degToRad(30*i)));

  scene.add(s1);
}

for (let i = 0; i < 12; i++) {
  let s1 = createSphere();

  let pivot = new THREE.Object3D();
  scene.add(pivot);
  
  pivot.add(s1);
  
  s1.position.set(0, 0.5, CIRCUMFERENCE_RADIUS_2);
  
  pivot.rotateY(THREE.MathUtils.degToRad(30 * i));
}

const CIRCUMFERENCE_RADIUS_3 = 6.5;
for (let i = 0; i < 12; i++) {
  let s1 = createSphere();
  scene.add(s1);
  
  // Start at center
  s1.position.set(0, 0.5, 0);
  
  // Calculate angle in radians
  const angle = THREE.MathUtils.degToRad(30 * i);
  
  // Move sphere out to radius distance along X axis
  s1.translateX(CIRCUMFERENCE_RADIUS_3);
  
  // Rotate around Y axis at the center point
  s1.rotateY(angle);
}

function createSphere()
{
  var sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  var sphereMaterial = new THREE.MeshPhongMaterial( {color:'rgb(180,180,255)',     shininess:"15",            // Shininess of the object
  specular:"rgb(180,180,255)"
} );
  var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
  return sphere;
}

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