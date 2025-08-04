import * as THREE from  'three';
import KeyboardState from '../libs/util/KeyboardState.js'
import {TeapotGeometry} from '../build/jsm/geometries/TeapotGeometry.js';
import {initRenderer, 
        initDefaultSpotlight,
        createGroundPlaneXZ,
        SecondaryBox, 
        onWindowResize} from "../libs/util/util.js";
import { Camera } from '../build/three.module.js';

let scene, renderer, light, camera, keyboard;
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // View function in util/utils
light = initDefaultSpotlight(scene, new THREE.Vector3(5.0, 5.0, 5.0)); // Use default light    
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );
keyboard = new KeyboardState();

var groundPlane = createGroundPlaneXZ(10, 10, 40, 40); // width, height, resolutionW, resolutionH
scene.add(groundPlane);

// Create objects
createTeapot( 2.0,  0.4,  0.0, Math.random() * 0xffffff);
createTeapot(0.0,  0.4,  2.0, Math.random() * 0xffffff);  
createTeapot(0.0,  0.4, -2.0, Math.random() * 0xffffff);    

let camPos  = new THREE.Vector3(0, 1, 0);
let camUp   = new THREE.Vector3(0.0, 1.0, 0.0);
let camLook = new THREE.Vector3(0.0, 0.0, 0.0);
var message = new SecondaryBox("");

// Main camera
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
   camera.position.copy(camPos);
   camera.up.copy( camUp );
   camera.lookAt(camLook);

 


let cameraHolder = new THREE.Object3D();
   cameraHolder.position.copy(camPos);
    cameraHolder.add(camera);
    scene.add(cameraHolder);
addObjToCamera();
render();

function addObjToCamera(){
   var geometry = new TeapotGeometry(0.08);
   let color = Math.random() * 0xffffff;
   var material = new THREE.MeshPhongMaterial({color, shininess:"200"});
   material.side = THREE.DoubleSide;
   var obj = new THREE.Mesh(geometry, material);
   obj.castShadow = true;
   obj.position.set(0, 0, 0);
   camera.add(obj);
}

function updateCamera()
{
   cameraHolder.position.copy(camPos);
   cameraHolder.lookAt(camLook);

   message.changeMessage("Pos: {" + camPos.x + ", " + camPos.y + ", " + camPos.z + "} " + 
                         "/ LookAt: {" + camLook.x + ", " + camLook.y + ", " + camLook.z + "}");
}

function keyboardUpdate() {

   keyboard.update();
   
      keyboard.update();
      if ( keyboard.pressed("left") )     camPos.x--;//x
      if ( keyboard.pressed("right") )    camPos.x++;//x
      if ( keyboard.pressed("up") )       camPos.y++;//y
      if ( keyboard.pressed("down") )     camPos.y--;//y
      if ( keyboard.pressed("pageup") )   camPos.z++;//z
      if ( keyboard.pressed("pagedown") ) camPos.z--;//z
      if ( keyboard.pressed("w")) camLook.z++;
      if ( keyboard.pressed("s")) camLook.z--; //o x y z do lookat tem dominio de -1 a 1, não pode ir maior que isso, tem q editar
      if ( keyboard.pressed("a")) camLook.x++;
      if ( keyboard.pressed("d")) camLook.x--;
      if ( keyboard.pressed("q")) camLook.y--;
      if ( keyboard.pressed("e")) camLook.y++;              

      /*
      let angle = THREE.MathUtils.degToRad(10); 
      if ( keyboard.pressed("A") )  cube.rotateY(  angle );
      if ( keyboard.pressed("D") )  cube.rotateY( -angle );
   
      if ( keyboard.pressed("W") )
      {
         scale+=.1;
         cube.scale.set(scale, scale, scale);
      }
      if ( keyboard.pressed("S") )
      {
         scale-=.1;
         cube.scale.set(scale, scale, scale);
      }  */
   
   updateCamera();
}

function createTeapot(x, y, z, color )
{
   var geometry = new TeapotGeometry(0.5);
   var material = new THREE.MeshPhongMaterial({color, shininess:"200"});
      material.side = THREE.DoubleSide;
   var obj = new THREE.Mesh(geometry, material);
      obj.castShadow = true;
      obj.position.set(x, y, z);
   scene.add(obj);
}

function render()
{
   requestAnimationFrame(render);
   keyboardUpdate();
   renderer.render(scene, camera) // Render scene
}