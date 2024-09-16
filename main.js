import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'
import {EffectComposer}  from 'three/examples/jsm/postprocessing/EffectComposer.js';

import { au } from './globalParameters'

import Planet from './Classes/Planet'
import Star from './Classes/Star'
import Satelite from './Classes/Satelite'






/**
 * SCENE CREATION ***************************************
 */
const scene = new THREE.Scene()

/**
 * CAMERA SETUP ***************************************
 */

const aspect = {
  width : window.innerWidth,
  height : window.innerHeight
}
const fov = 75

const camera = new THREE.PerspectiveCamera(fov, aspect.width / aspect.height, 0.1, 100000)
scene.add(camera)

camera.position.z = 20
camera.position.y = 20

/**
 * STATS ***************************************
 */

const stats = new Stats()
document.body.appendChild(stats.dom)

/**
 * LOADING MANAGER ***************************************
 */

const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = ()=>{
  console.log('start')
}

loadingManager.onLoad = ()=>{
  console.log('load')
}
loadingManager.onProgress = ()=>{
  console.log('Loading...')
}
loadingManager.onError = ()=>{
  console.log('Error !')
}


/**
 * TEXTURE LOADER ***************************************
 */
// const textureLoader = new THREE.TextureLoader(loadingManager)
const textureLoader = new THREE.TextureLoader()
const earthColorTexture = textureLoader.load('/textures/earth/earthColor.jpg')
const earthCloudTexture = textureLoader.load('/textures/earth/earthClouds.jpg')
const earthNormalTexture = textureLoader.load('/textures/earth/earthNormal.jpg')
const earthSpecularTexture = textureLoader.load('/textures/earth/earthSpecular.jpg')
const moonColorTexture = textureLoader.load('/textures/moon/moonColor.jpg')

const mercuryColorTexture = textureLoader.load('/textures/mercury/mercuryColor.jpg')
const marsColorTexture = textureLoader.load('/textures/mars/marsColor.jpg')
const venusColorTexture = textureLoader.load('/textures/venus/venusColor.jpg')
const venusClouds = textureLoader.load('/textures/venus/venusClouds.jpg')
const jupiterColorTexture = textureLoader.load('/textures/jupiter/jupiterColor.jpg')
const uranusColorTexture = textureLoader.load('/textures/uranus/uranusColor.jpg')
const neptuneColorTexture = textureLoader.load('/textures/neptune/neptuneColor.jpg')
const saturnColorTexture = textureLoader.load('/textures/saturn/saturnColor.jpg')


const sunColorTexture = textureLoader.load('/textures/sun/sunColor.jpg')
/*
 * CELESTIAL BODY IMPLEMENTATION 
 */

//-----------------sun------------------

const sunMaterial = new THREE.MeshPhysicalMaterial({
  name : 'Sun Surface',
  emissiveMap: sunColorTexture,
  emissive: 'white',
  emissiveIntensity: 1
})
const sunSurfaceMaterial = new THREE.MeshPhysicalMaterial({
  emissive: 'yellow',
  transparent:true,
  opacity: 1
})
const sun = new Star( 696342, sunMaterial)
sun.name = 'Sun'
sun.intensity = 100
sun.build()

scene.add(sun)


//---------------Earth-------------------
const earthSystem = new THREE.Group()
earthSystem.name = 'Earth System'

const earthMaterial = new THREE.MeshPhysicalMaterial({
  map : earthColorTexture,
  aoMap : earthSpecularTexture,
  roughness :  0.8,
  bumpMap : earthNormalTexture,
  bumpScale : -2
})

const earth = new Planet(6371, null, 23.5, earthMaterial)
earth.revolutionSpeed = 0.4651 
earth.orbitingSpeed = 30
earth.name = 'Earth'
earth.orbitTarget = sun
// earth.planeTilt = ((Math.PI*2) / 360) *23
earth.distanceFromTarget = 1 * au + sun.radius

earth.build()


//Earth Atmosphere
const atmosphereMaterial = new THREE.MeshStandardMaterial({
  name: 'Outline material',
  transparent : true,
  opacity: 0.5,
  side : THREE.BackSide,
  color: new THREE.Color(0, 5, 255),
  depthWrite : false
})
const atmosphereMaterial2 = new THREE.MeshStandardMaterial({
  name: 'Diffuse atmosphere',
  roughness: 1,
  transparent : true,
  opacity: 0.2,
  color: new THREE.Color(0, 5, 255),
  depthWrite : false
  
})
earth.atmosphere.thickness = 300
const atmosphereMaterials = [atmosphereMaterial, atmosphereMaterial2]
earth.atmosphere.addLayer(2, atmosphereMaterials)
earth.body.add(earth.atmosphere.layers)

//Low atmosphere
const lowAtmosphereMaterial = new THREE.MeshStandardMaterial({
  name :'Low atmosphere Clouds',
  transparent: true,
  alphaMap : earthCloudTexture,
  opacity : 0.2,
})
earth.lowAtmosphere.addLayer(10, lowAtmosphereMaterial, 10 )
earth.body.add(earth.lowAtmosphere.layers)

//Moon
const moonMaterial = new THREE.MeshPhysicalMaterial({
  map : moonColorTexture
})
const moon = new Planet(1737, earth, 0, moonMaterial)
moon.orbitingSpeed = 10.02
moon.name = 'Moon'
moon.orbitTarget = earth
moon.planeTilt = ((Math.PI /360) *2 ) * 5.68
moon.axialTilt = ((Math.PI /360) *2 ) * 6.68
moon.distanceFromTarget = 0.0025 * au
moon.build()


//------------------Mercury---------------------

const mercuryMaterial = new THREE.MeshPhysicalMaterial({
  map : mercuryColorTexture
})
const mercury = new Planet(2439, sun, 0, mercuryMaterial)
mercury.orbitingSpeed = 0
mercury.orbitingSpeed = 47.362
mercury.revolutionSpeed = 0.003
mercury.name = 'Mercury'
mercury.planeTilt = ((Math.PI /360) *2 ) * 7
mercury.axialTilt = ((Math.PI /360) *2 ) * 0.035
mercury.orbitTarget = sun
mercury.distanceFromTarget =  0.4 * au

mercury.build()

//------------------Venus---------------------

const venusMaterial = new THREE.MeshPhysicalMaterial({
  map : venusColorTexture
})
const venus = new Planet(6051, sun, 0, venusMaterial)
venus.orbitingSpeed = 35.025
venus.revolutionSpeed = 0.0018
venus.name = 'Venus'
venus.planeTilt = ((Math.PI /360) *2 ) * 3.4
venus.axialTilt = ((Math.PI /360) *2 ) * 177.3
venus.orbitTarget = sun
venus.distanceFromTarget =  0.723 * au

venus.build()

//Venus Atmosphere
const venusAtmosphereMaterial = new THREE.MeshStandardMaterial({
  name: 'Outline material',
  transparent : true,
  opacity: 0.1,
  side : THREE.BackSide,
  color: new THREE.Color(255,10, 10),
  depthWrite : false
})
const venusAtmosphereMaterial2 = new THREE.MeshStandardMaterial({
  name: 'Diffuse atmosphere',
  transparent : true,
  opacity: 0,
  color: new THREE.Color(255, 255, 255),
  depthWrite : false,
})

venus.atmosphere.thickness = 200
const venusAtmosphereMaterials = [venusAtmosphereMaterial, venusAtmosphereMaterial2]
venus.atmosphere.addLayer(2, venusAtmosphereMaterials)
venus.body.add(venus.atmosphere.layers)

//Low atmosphere
const venusLowAtmosphereMaterial = new THREE.MeshStandardMaterial({
  map : venusClouds,
  name :'Low atmosphere Clouds',
  transparent: true,
  opacity : 0.4,
})
venus.lowAtmosphere.addLayer(5, venusLowAtmosphereMaterial, 10 )
venus.body.add(venus.lowAtmosphere.layers)

//------------------Mars---------------------

const marsMaterial = new THREE.MeshPhysicalMaterial({
  map : marsColorTexture
})
const mars = new Planet(3389, sun, 0, marsMaterial)
mars.orbitingSpeed = 24.13
mars.revolutionSpeed = 0.24
mars.name = 'Mars'
mars.planeTilt = ((Math.PI /360) *2 ) * 1.85
mars.axialTilt = ((Math.PI /360) *2 ) * 25.2
mars.orbitTarget = sun
mars.distanceFromTarget =  1.523 * au

mars.build()

//Mars Atmosphere
const marsAtmosphereMaterial = new THREE.MeshStandardMaterial({
  name: 'Outline material',
  transparent : true,
  opacity: 0.2,
  side : THREE.BackSide,
  color: new THREE.Color(255,10, 10),
  depthWrite : false
})
const marsAtmosphereMaterial2 = new THREE.MeshStandardMaterial({
  name: 'Diffuse atmosphere',
  transparent : true,
  opacity: 0.1,
  color: new THREE.Color(255, 200, 10),
  depthWrite : false,
})

mars.atmosphere.thickness = 100
const marsAtmosphereMaterials = [marsAtmosphereMaterial, marsAtmosphereMaterial2]
mars.atmosphere.addLayer(2, marsAtmosphereMaterials)
mars.body.add(mars.atmosphere.layers)

//------------------Jupiter---------------------

const jupiterMaterial = new THREE.MeshPhysicalMaterial({
  map : jupiterColorTexture
})
const jupiter = new Planet(60510, sun, 0, jupiterMaterial)
jupiter.orbitingSpeed = 35.025
jupiter.revolutionSpeed = 0.0018
jupiter.name = 'Venus'
jupiter.planeTilt = ((Math.PI /360) *2 ) * 3.4
jupiter.axialTilt = ((Math.PI /360) *2 ) * 177.3
jupiter.orbitTarget = sun
jupiter.distanceFromTarget =  0.723 * au

jupiter.build()

sun.add(mars)
sun.add(mercury)
sun.add(venus)
sun.add(jupiter)
earth.add(moon)
sun.add(earth)

let cameraTarget = jupiter

/**
 * LIGHT ***************************************
 */

const ambientLigth = new THREE.AmbientLight(0xffffff, 0.005)
scene.add(ambientLigth)



/**
 * RENDERER ***************************************
 */
const canvas = document.querySelector('#three')
const renderer = new THREE.WebGLRenderer({
  canvas :canvas, 
  antialias : true
})


/**
 * POST PROCESSING
 */


/**
 * ORBIT CONTROLS ***************************************
 */
const orbitControls = new OrbitControls(camera,canvas)
orbitControls.enableDamping = true
orbitControls.dampingFactor = 0.02
orbitControls.target = cameraTarget.coordinate
// orbitControls.autoRotate = true
orbitControls.enablePan = false



/**
 * CLOCK ***************************************
 */
const clock = new THREE.Clock()
let elapsedTime = null

/**
 * MOUSE LISTENER ***************************************
 */
let cursor = {
  x : 0,
  y : 0
}

window.addEventListener('mousemove',(event)=>{
  cursor.x = event.clientX/aspect.width - 0.5
  cursor.y = event.clientY/aspect.height -0.5
  
})

/**
 * CANVAS SIZE ***************************************
 */

//Set canvas size on loading page
window.addEventListener('load', setCanvasSize(camera, renderer))
//Resize canvas for responsivness
window.addEventListener("resize", (e)=>{
  setCanvasSize(camera,renderer)
})



/**
 * GUI ***************************************
 */
const gui = new GUI()



/**
 * ANIMATION ***************************************
 */
let x = 0.001

function animate(){
  

  //Set elapsed time
  elapsedTime = clock.getElapsedTime()

  //render
  renderer.render(scene, camera)

  //Rotation
  earth.rotate()
  mercury.rotate()
  mars.rotate()
  venus.rotate(true)
  
  const oldCamTargetCoordinate = new THREE.Vector3()
  cameraTarget.body.getWorldPosition(oldCamTargetCoordinate)

  //Orbit
  earth.orbit(elapsedTime, sun, false)  
  moon.orbit(elapsedTime, earth)
  mercury.orbit(elapsedTime, sun, false)
  venus.orbit(elapsedTime, sun, false)
  mars.orbit(elapsedTime, sun, false)
  jupiter.orbit(elapsedTime, sun, false)


  const delta = cameraTarget.coordinate.clone().sub(oldCamTargetCoordinate)

  
  window.requestAnimationFrame(animate)
  camera.position.add(delta)

  const cameraDistance = cameraTarget.position.distanceTo(camera.position)
  if( cameraDistance > 10000 ){
    cameraTarget = sun
    if( x <= 1){
      
      orbitControls.target = orbitControls.target.clone().add(cameraTarget.coordinate.clone().sub(orbitControls.target).multiplyScalar(x)) 
      x = x + 0.0001
    }
    
    console.log(cameraDistance)
  }
  
  update()

  console.log(Math.round(elapsedTime))
}

animate()

/**
 * FUNCTIONS ***************************************
 */

function update(){
  stats.update()
  orbitControls.update()

}


/**
 * Set canvas size depending on the width and height of the window.
 * Function to be called on load and on resize event
 * @param {THREE.Camera} camera 
 * @param {THREE.WebGLRenderer} renderer 
 */
function setCanvasSize(camera,renderer){
  //Set aspect
  aspect.width = window.innerWidth
  aspect.height = window.innerHeight
  
  //Set aspect Ratio
  camera.aspect = aspect.width / aspect.height
  camera.updateProjectionMatrix()

  //Set rendererSize
  renderer.setSize(aspect.width, aspect.height)
}


