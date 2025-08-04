import * as THREE from  'three';
import {initRenderer, 
		initCamera,
		onWindowResize,
		lightFollowingCamera,
		initDefaultSpotlight,
   degreesToRadians} from "../libs/util/util.js";
import {OrbitControls} from '../build/jsm/controls/OrbitControls.js';


let scene = new THREE.Scene();
let camera = initCamera(new THREE.Vector3(0, 15, 45)); // Init camera in this position
let renderer = initRenderer(); 
	renderer.setClearColor(new THREE.Color("lightslategray"));
let light = initDefaultSpotlight(scene, camera.position, 5000);

let orbitcontrols = new OrbitControls (camera, renderer.domElement);

window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

let plane, obj;

function sceneBox(){
  obj = createBoxGeometry();
  scene.add(obj);
}

function sceneSphere(){
  obj = createSphereGeometry(); 
  scene.add(obj);
}


window.addEventListener('keydown', (event) => movementControls(event.keyCode, true));
window.addEventListener('keyup', (event) => movementControls(event.keyCode, false));

function movementControls(key, value){

  switch(key){
    case 65: // A key
      obj.rotateY(0.1);
      break;
    case 68: // D key
      obj.rotateY(-0.1);
      break;
    case 87: // W key
      obj.rotateX(0.1);
      break;
    case 83: // S key
      obj.rotateX(-0.1);
      break;
  }
}

function createBoxGeometry(){
  
  let boxGeometry = new THREE.BoxGeometry(5, 5, 0.5);
  let boxTextureZ = new THREE.TextureLoader().load("../assets/textures/NormalMapping/cross.png");
  let boxTextureY = new THREE.TextureLoader().load("../assets/textures/NormalMapping/crossTop.png");
  let boxTextureX = new THREE.TextureLoader().load("../assets/textures/NormalMapping/crossSide.png"); 
  let normalMap = new THREE.TextureLoader().load("../assets/textures/NormalMapping/crossNormal.png");

  let boxMaterialX = new THREE.MeshStandardMaterial({
    map: boxTextureX
  });
  let boxMaterialY = new THREE.MeshStandardMaterial({
    map: boxTextureY
  })
  let boxMaterialZ = new THREE.MeshStandardMaterial({
    map: boxTextureZ,
    normalMap: normalMap
  })

  let boxMaterial = [ boxMaterialX, boxMaterialX, boxMaterialY, boxMaterialY,boxMaterialZ, boxMaterialZ ];
  let box = new THREE.Mesh(boxGeometry, boxMaterial);

  //box.scale.set(3, 3, 3);
  
  box.position.set(0.0, 0.0, 0.0);
  return box;
}

function createPlane(width = 500, height = 500, widthSegments = 10, heightSegments = 10, gcolor = "rgb(153, 148, 148)") {
    if (!gcolor) gcolor = "rgb(200,200,200)";
    let planeGeometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    let planeTexture = new THREE.TextureLoader().load("../assets/textures/floorWood.jpg");
    planeTexture.repeat.set(4, 4);
    planeTexture.wrapS = planeTexture.wrapT = THREE.RepeatWrapping;
 
    let planeMaterial = new THREE.MeshStandardMaterial({
        map: planeTexture,
        color: gcolor 
    });
 
    let mat4 = new THREE.Matrix4();
    let plane = new THREE.Mesh(planeGeometry, planeMaterial); 
    plane.receiveShadow = true;

    plane.matrixAutoUpdate = false;
    plane.matrix.identity();
    plane.matrix.multiply(mat4.makeTranslation(0.0, -0.1, 0.0)); 
    plane.matrix.multiply(mat4.makeRotationX(degreesToRadians(-90)));

    return plane;
}

function createSphereGeometry() {
  let sphereGeometry = new THREE.SphereGeometry(3, 64, 64);
  let sphereTexture = new THREE.TextureLoader().load("../assets/textures/Displacement/rockWall.jpg");
  let normalMap = new THREE.TextureLoader().load("../assets/textures/Displacement/rockWall_Normal.jpg");
  let dispMap = new THREE.TextureLoader().load("../assets/textures/Displacement/rockWall_Height.jpg");

  sphereTexture.repeat.set(4, 3);
  normalMap.repeat.set(4, 3);
  dispMap.repeat.set(4, 3);
  sphereTexture.wrapS = sphereTexture.wrapT = THREE.RepeatWrapping;
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
  dispMap.wrapS = dispMap.wrapT = THREE.RepeatWrapping;

  let sphereMaterial = new THREE.MeshStandardMaterial({
    map: sphereTexture,
    normalMap: normalMap,
    displacementMap: dispMap,
    displacementScale: 0.2
  });
  let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(0.0, 15.0, 0.0);
  sphere.scale.set(5, 5, 5);
  return sphere;
}

//sceneBox();
sceneSphere();
scene.add(createPlane());
render();

function render() {
	lightFollowingCamera(light, camera);
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

