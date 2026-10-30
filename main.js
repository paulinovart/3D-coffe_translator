import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
// import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";


const scene = new THREE.Scene(); // scene : comme le viewport ds blender
const viewport = {
  width: window.innerWidth,
  height: window.innerHeight,
};
/*
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
CAMERA
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
 */

const camera = new THREE.PerspectiveCamera(
    55, // field of view (fov) ==> focale de la camera
    viewport.width / viewport.height, // aspect ratio ()
    0.2, // plan de clip proche (near)  ==> à quel point on voit loin ou proche dans une scene
    1000 // plan de clip loin(far)
  );
  camera.position.set(0,0.5,2)

scene.add(camera)

  /*
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
LUMIERE
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
 */

const ambLight = new THREE.AmbientLight(0xffffff, 1);
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(2, 1, 0);
dirLight.target.position.set(0, 0, 0);
dirLight.castShadow = true;
ambLight.castShadow = true;
scene.add(ambLight, dirLight);

/*
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
RENDERER
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
 */

const renderer = new THREE.WebGLRenderer(); // rendre ce que voit la camera
renderer.setSize(viewport.width, viewport.height); // taille du rendu, attention, ça doit etre coherent avec l'aspect ratio

document.body.appendChild(renderer.domElement); // ça crée un Canvas





/*
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
CONTROLS ET HELPERS
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
 */

const controls = new OrbitControls(camera, renderer.domElement)
controls.enablePan;
controls.cursorStyle = "grab";
//controls.autoRotate = true;
controls.autoRotateSpeed = true;
controls.enableDamping = true;



const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );




/*
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
RESIZE
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
 */

//camera.position.z = 0.7; 
//camera.position.y = 0.5;

window.onresize = () => {
  viewport.width = window.innerWidth;
  viewport.height = window.innerHeight;
  camera.aspect = viewport.width / viewport.height;
  camera.updateProjectionMatrix();

  renderer.setSize(viewport.width, viewport.height);

  renderer.render(scene, camera); //il faut le mettre à chaque fois qu'il y a un nouveau parametre, comm le resize
};


/*
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
OBJECTS 3D
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
 */


const planeMaterial = new THREE.MeshBasicMaterial( { color: 0x654321, side: THREE.DoubleSide } );
const planeGeometry = new THREE.PlaneGeometry(2,2)

const testPlane = new THREE.Mesh(planeGeometry, planeMaterial)
testPlane.rotateX (Math.PI/2)
scene.add(testPlane)


/*
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
ANIMATE
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
 */

function animate(time) {
    //rendu à chaque frame du canvas

    controls.update();
  

    renderer.render(scene, camera);
  }
  
  //RENDERER
  
  renderer.setAnimationLoop(animate);
  
  renderer.render(scene, camera);
  