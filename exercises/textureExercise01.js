import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

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

const woodTop = '../assets/textures/woodTop.png';
const wood = '../assets/textures/wood.png';
const tiles = '../assets/textures/tiles.jpg';
const basket = '../assets/textures/basket.png';
let sceneObject;

// create the ground plane
/*
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane); */





let loader = new THREE.TextureLoader();

sceneObject = loadMultitexturedCube();
scene.add(sceneObject.object);


function loadMultitexturedCube(){
  let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  const zoom = 1/3;
  const offset = 1/3;
  let cubeTexturedMaterials = [];

  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) cubeTexturedMaterials.push(setMaterial(tiles, zoom, zoom, i * offset, j * offset));

  let cube = new THREE.Mesh(cubeGeometry, cubeTexturedMaterials);
  cube.position.set(0.0, 2.0, 0.0);
  return {name: 'cube', object: cube};
}

function loadWoodStump(){
  let cylinderGeometry = new THREE.CylinderGeometry( 1, 1, 4, 32 );
  let cylinderTexturedMaterials = [
    setMaterial(wood), //calota
    setMaterial(woodTop), //y-
    setMaterial(woodTop) //y+
  ];
  let cylinder = new THREE.Mesh( cylinderGeometry, cylinderTexturedMaterials );
  cylinder.position.set(0.0, 2.0, 0.0);
  return {name: 'cylinder', object: cylinder};
}

let plane;
function loadBasketballScene(){
  let basketballGeometry = new THREE.SphereGeometry( 4, 32, 32 );
  let basketballMaterials = 
    setMaterial(basket, 1, 1, 0, 0, 'rgb(255,150,0)');
    //new THREE.MeshLambertMaterial({color: 0xFF0000});

  let basketball = new THREE.Mesh( basketballGeometry, basketballMaterials );
  basketball.position.set(0.0, 2.0, 0.0);
  return {name: 'basketball', object: basketball};
}

function setMaterial(file, repeatU = 1, repeatV = 1, offsetU = 0, offsetV = 0, color = 'rgb(255,255,255)'){
  let mat = new THREE.MeshLambertMaterial({ map: loader.load(file), color:color});
   mat.map.colorSpace = THREE.SRGBColorSpace;
   mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
   mat.map.minFilter = mat.map.magFilter = THREE.LinearFilter;
   mat.map.repeat.set(repeatU,repeatV); 
   mat.map.offset.set(offsetU,offsetV);
   return mat;
}

const KEY_1 = 49; // 1 key
const KEY_2 = 50; // 2 key
const KEY_3 = 51; // 3 key
window.addEventListener('keydown', (event) => movementControls(event.keyCode, true));
window.addEventListener('keyup', (event) => movementControls(event.keyCode, false));

function movementControls(key, value){
  switch (key){
    case KEY_1:
      if (!sceneObject.name.startsWith("cylinder")){
        scene.remove(sceneObject.object);
        if (plane) scene.remove(plane);
        sceneObject = loadWoodStump();
        scene.add(sceneObject.object);
      }
      break;
    case KEY_2:
      if (!sceneObject.name.startsWith("cube")){
        scene.remove(sceneObject.object);
        if (plane) scene.remove(plane);
        sceneObject = loadMultitexturedCube();
        scene.add(sceneObject.object);
      }
      break;
    case KEY_3:
      if (!sceneObject.name.startsWith("basketball")){
        scene.remove(sceneObject.object);
        sceneObject = loadBasketballScene();
        sceneObject.object.visible = true;
        scene.add(sceneObject.object);
      }

  }
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