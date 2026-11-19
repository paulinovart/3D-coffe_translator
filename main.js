import * as THREE from "three";

import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm"

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";



let craftBag1,craftBag2, craftBag3;
let coffeBean;
let coffeBeanBodies = [];
let coffeBeanMeshes = [];
let craftBags = [];
let currentStep = 1;
let selectedCraftBag

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
  camera.position.set(2,0,0)

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
//controls.cursorStyle = "grab";
//controls.autoRotate = true;
controls.autoRotateSpeed = true;
controls.enableDamping = true;



const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

/*
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
LOADING MANAGER
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
 */
const manager = new THREE.LoadingManager();

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
CHARGEMENT MODELES SAC CRAFT 3D
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
*/

const dracoloader = new DRACOLoader(manager);
dracoloader.setDecoderPath(
    "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
);


const loader = new GLTFLoader(manager);
loader.setDRACOLoader(dracoloader);
//sac de café n°1
loader.load("/models/sac_cafe_craft.glb", (gltf) => {
    craftBag1 = gltf.scene;
    craftBag1.name = 'craft-bag-1';
    scene.add(craftBag1); 
    craftBags.push(craftBag1);
    renderer.render(scene, camera);
})

//sac de café n°2

loader.load("/models/sac_cafe_craft.glb", (gltf) => {
    craftBag2 = gltf.scene;
    craftBag2.name = 'craft-bag-2';
    scene.add(craftBag2);
    craftBags.push(craftBag2);
    renderer.render(scene, camera);
    
})
//sac de café n°3
loader.load("/models/sac_cafe_craft.glb", (gltf) => {
    craftBag3 = gltf.scene;
    craftBag3.name = 'craft-bag-3';
    scene.add(craftBag3);
    craftBags.push(craftBag3);
    renderer.render(scene, camera);
    
})


// pour regler les positions de base apres le load des modeles

manager.onLoad = () => {
    craftBag1.position.set(0,0,0);
    craftBag2.position.set(0,0,0.3);
    craftBag3.position.set(0,0,0.6);
    console.log(craftBags)
    
};
/*
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
CHARGEMENT MODELES GRAIN CAFE
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
*/

loader.load("/models/coffee_bean_2.glb", (gltf) => {
coffeBean = gltf.scene;
})

window.addEventListener("keydown",()=>{
    if (currentStep !== 2) return;
    console.log("key pressed")
    console.log(coffeBeanMeshes)
    scene.add(coffeBean);
    coffeBean.position.set(1,1,0)
    coffeBean.scale.set(0.2,0.2,0.2)
    coffeBeanMeshes.push(coffeBean)

})


/*
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
AJOUT DE LA PHYSIQUE AVEC CANNON-ES
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
*/

const world = new CANNON.World({
    
    gravity:new CANNON. Vec3(0,-9.81,0)
    
})

const groundPhysMat = new CANNON.Material()
const groundBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(10, 0.1, 10)),
    //shape: new CANNON.Box (new CANNON.Vec3(10,10,.1)),
    type: CANNON.Body.STATIC,
    material:groundPhysMat
})

world.addBody(groundBody)
//groundBody.quaternion.setFromEuler(-Math.PI/2,0,0)


const timeStep =1/60;




const coffeBeanPhysMat = new CANNON.Material()
const coffeBeanBody = new CANNON.Body({
    mass:10,
    shape: new CANNON.Cylinder(1, 1, 1, 16),

    position:new CANNON.Vec3(0,4,0),
    material:coffeBeanPhysMat
})

world.addBody(coffeBeanBody)
coffeBeanBodies.push(coffeBeanBody)


/*
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
RAYCASTER AU HOVER
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
 */

const mouse = new THREE.Vector2(10, 10);
const raycaster = new THREE.Raycaster(undefined, undefined);
let hovered = null;

window.addEventListener("pointermove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

});
/*
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
ETAPE 1 ==> selection
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
 */


window.addEventListener("click", () => {

    if (currentStep !== 1) return; // ==> si l'etape n'est pas 1, arrete la fonction 
  
    raycaster.setFromCamera(mouse, camera);
  
    const hits = raycaster.intersectObjects(craftBags, true);
    if (hits.length > 0) {
      const selectedCraftBag = hits[0].object;
  
      console.log("sac selectionné :", selectedCraftBag);
      console.log(currentStep);
  
      changeStep();
    }
  });



/*
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
FONCTION CHANGEMENT ETAPES
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
 */



  function changeStep() {

   currentStep += 1; 
  
    // switch (newStep) {
  
    //   case 2:
    //     afficherFenetre();
    //     break;
  
    //   case 3:
    //     lancerAnimation();
    //     break;
  
    //   case 4:
    //     console.log("Fin du jeu !");
    //     break;
    // }
  }

/*
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
ANIMATE
-------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------
 */

function animate(time) {
    //rendu à chaque frame du canvas

// pour la physique

world.step(timeStep)

    for (let i = 0; i < coffeBeanBodies.length; i++) {
      // coffeBeanMeshes[i].position.copy(coffeBeanBodies[i].position);
       //coffeBeanMeshes[i].quaternion.copy(coffeBeanBodies[i].quaternion);
    }




    raycaster.setFromCamera(mouse, camera)
    const hits = raycaster.intersectObjects(craftBags)
    hovered = hits.length > 0 ? hits[0].object : null;
    
    for (const craftBag of craftBags){

       const targetY = craftBag.children[0] === hovered ? 0.1 : 0;
       craftBag.position.y = THREE.MathUtils.lerp(craftBag.position.y, targetY, 0.15);
    

    }

    controls.update();
  

    renderer.render(scene, camera);
  }
  
  //RENDERER
  
  renderer.setAnimationLoop(animate);
  
  renderer.render(scene, camera);
  