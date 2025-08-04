import * as THREE from  'three';
import GUI from '../libs/util/dat.gui.module.js'
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        InfoBox,
        SecondaryBox,

        setDefaultMaterial,
        initDefaultBasicLight,        
        onWindowResize, 
        createLightSphere} from "../libs/util/util.js";
import {loadLightPostScene} from "../libs/util/utilScenes.js";

let scene, renderer, camera, orbit;
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // View function in util/utils
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor("rgb(30, 30, 42)");
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
   camera.lookAt(0, 0, 0);
   camera.position.set(5, 5, 5);
   camera.up.set( 0, 1, 0 );
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.


let keyboard = new KeyboardState();
// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 3 );
  axesHelper.visible = false;
scene.add( axesHelper );


/*
let dirPosition = new THREE.Vector3(2, 2, 4)
const dirLight = new THREE.DirectionalLight('white', 0.2);
dirLight.position.copy(dirPosition);
 //mainLight.castShadow = true;
scene.add(dirLight); */

showInformation();
let infoBox = new SecondaryBox("");


let ambientColor = "rgb(50,50,50)";
let ambientLight = new THREE.AmbientLight(ambientColor, 0.8);
scene.add(ambientLight);

// Load default scene
loadLightPostScene(scene)
let lightPosition = new THREE.Vector3(1.3, 3.0, 0.0);
let lightColor = "rgb(255,255,255)";

// Sphere to represent the light
let lightSphere = createLightSphere(scene, 0.05, 10, 10, lightPosition);



// REMOVA ESTA LINHA APÓS CONFIGURAR AS LUZES DESTE EXERCÍCIO
//initDefaultBasicLight(scene);


let spotLight = new THREE.SpotLight(lightColor);
setSpotLight(lightPosition);
let currentLight = spotLight;
//--------
// ADD THE SCENE'S BLOCKS
// 2 cylinders, one magenta one yellow, two square prisms, one green one red
const CYLINDER_DIMENSIONS = { radius: 0.2, height: 1, radialSegments: 32 };
const PRISM_DIMENSIONS = { width: 0.5, height: 1, depth: 0.5 };
let yellowCylinder = new THREE.Mesh(new THREE.CylinderGeometry(CYLINDER_DIMENSIONS.radius, CYLINDER_DIMENSIONS.radius, CYLINDER_DIMENSIONS.height, CYLINDER_DIMENSIONS.radialSegments), setDefaultMaterial("rgb(255,255,0)"));
let magentaCylinder = new THREE.Mesh(new THREE.CylinderGeometry(CYLINDER_DIMENSIONS.radius, CYLINDER_DIMENSIONS.radius, CYLINDER_DIMENSIONS.height, CYLINDER_DIMENSIONS.radialSegments), setDefaultMaterial("rgb(255,0,255)"));
let greenSquarePrism = new THREE.Mesh(new THREE.BoxGeometry(PRISM_DIMENSIONS.width, PRISM_DIMENSIONS.height, PRISM_DIMENSIONS.depth), setDefaultMaterial("rgb(0,255,0)"));
let redSquarePrism = new THREE.Mesh(new THREE.BoxGeometry(PRISM_DIMENSIONS.width, PRISM_DIMENSIONS.height, PRISM_DIMENSIONS.depth), setDefaultMaterial("rgb(255,0,0)"));
yellowCylinder.position.set(0.0, 0.25, -1.0);
magentaCylinder.position.set(0.0, 0.25, 1.0);
greenSquarePrism.position.set(1.0, 0.25, 0.0);
redSquarePrism.position.set(-1.0, 0.25, 0.0);

yellowCylinder.castShadow = true;
magentaCylinder.castShadow = true;
greenSquarePrism.castShadow = true;
redSquarePrism.castShadow = true;
scene.add(yellowCylinder);
scene.add(magentaCylinder);
scene.add(greenSquarePrism);
scene.add(redSquarePrism);


//---------------------------------------------------------
// Load external objects
buildInterface();
render();

function setSpotLight(position)
{
  spotLight.position.copy(position);
  spotLight.angle = THREE.MathUtils.degToRad(40);    
  spotLight.decay = 1.2; // The amount the light dims along the distance of the light.
  spotLight.penumbra = 0.1; // Percent of the spotlight cone that is attenuated due to penumbra. 

    // Shadow settings
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 512;
  spotLight.shadow.mapSize.height = 512;
  spotLight.name = "Spot Light"
  spotLight.target.position.set(2.85, 0, 0); 
  scene.add(spotLight.target);

  scene.add(spotLight);
}

function keyboardUpdate()
{
  keyboard.update();
  if ( keyboard.pressed("D") )
  {
    lightPosition.x += 0.05;
    updateLightPosition();
  }
  if ( keyboard.pressed("A") )
  {
    lightPosition.x -= 0.05;
    updateLightPosition();
  }
  if ( keyboard.pressed("W") )
  {
    lightPosition.y += 0.05;
    updateLightPosition();
  }
  if ( keyboard.pressed("S") )
  {
    lightPosition.y -= 0.05;
    updateLightPosition();
  }
  if ( keyboard.pressed("E") )
  {
    lightPosition.z -= 0.05;
    updateLightPosition();
  }
  if ( keyboard.pressed("Q") )
  {
    lightPosition.z += 0.05;
    updateLightPosition();
  }
  if (keyboard.pressed("1"))
    // 1 changes angle of spotlight
  {
    spotLight.target.position.x += 0.05;
    infoBox.changeMessage("Spotlight Target X: " + spotLight.target.position.x.toFixed(2));
    scene.add(spotLight.target); // Ensure the target is added to the scene
  }
  if (keyboard.pressed("3"))
  {
    spotLight.target.position.x -= 0.05;
    infoBox.changeMessage("Spotlight Target X: " + spotLight.target.position.x.toFixed(2));
    scene.add(spotLight.target); // Ensure the target is added to the scene
  }


}

function buildInterface()
{
  // GUI interface
  let gui = new GUI();
}

function updateLightPosition()
{
  currentLight.position.copy(lightPosition);
  lightSphere.position.copy(lightPosition);
  infoBox.changeMessage("Light Position: " + lightPosition.x.toFixed(2) + ", " +
                          lightPosition.y.toFixed(2) + ", " + lightPosition.z.toFixed(2));
}


function showInformation()
{
  // Use this to show information onscreen
  let controls = new InfoBox();
    controls.add("Lighting - Types of Lights");
    controls.addParagraph();
    controls.add("Use the WASD-QE keys to move the light");
    controls.show();
}
function render()
{
  keyboardUpdate();
  requestAnimationFrame(render);
  renderer.render(scene, camera)

}
