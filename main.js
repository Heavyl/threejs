import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'
import {EffectComposer}  from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'

import { au, timeOffset } from './globalParameters'

import Planet from './Classes/Planet'
import Star from './Classes/Star'
import Ring from './Classes/Ring'
import CelestialBody from './Classes/CelestialBody';





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
const saturnRingsTexture = textureLoader.load('/textures/saturn/saturnRings.png')
saturnRingsTexture.wrapS = saturnRingsTexture.wrapT = THREE.RepeatWrapping

const sunColorTexture = textureLoader.load('/textures/sun/sunColor.jpg')


/**
 * SKYBOX
 */

//Cube loader
const cubeLoader = new THREE.CubeTextureLoader()
const skyTexture = cubeLoader.load([
  '/textures/sky/px.png',
  '/textures/sky/px.png',
  '/textures/sky/py.png',
  '/textures/sky/ny.png',
  '/textures/sky/pz.png',
  '/textures/sky/nz.png'
])
console.log(skyTexture)
scene.background = skyTexture
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
sun.intensity = 50
sun.build()

scene.add(sun)


//---------------Earth-------------------
const earthSystem = new THREE.Group()
earthSystem.name = 'Earth System'

const earthMaterial = new THREE.MeshStandardMaterial({
  map : earthColorTexture,
  aoMap : earthSpecularTexture,
  roughness :  1,
  bumpMap : earthNormalTexture,
  bumpScale : -3
})

const earth = new Planet(6371, null, 23.5, earthMaterial)
earth.revolutionSpeed = 0.465
earth.orbitingSpeed = 29.72
earth.name = 'Earth'
earth.orbitTarget = sun
earth.distanceFromTarget = 1 * au 
earth.orbitPathColor = 0xff0000

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
const jupiter = new Planet(71492, sun, 0, jupiterMaterial)
jupiter.orbitingSpeed = 13.058
jupiter.revolutionSpeed = 13.06
jupiter.name = 'Venus'
jupiter.planeTilt = ((Math.PI /360) *2 ) * 1.304
jupiter.axialTilt = ((Math.PI /360) *2 ) * 3.12
jupiter.orbitTarget = sun
jupiter.distanceFromTarget =  5.202 * au

jupiter.build()

//------------------Saturn---------------------

const saturnMaterial = new THREE.MeshStandardMaterial({
  map : saturnColorTexture,
  roughness : 1
})
const saturn = new Planet(58232, sun, 0, saturnMaterial)
saturn.orbitingSpeed = 9.6725
saturn.revolutionSpeed = 9.68
saturn.name = 'Saturn'
saturn.planeTilt = ((Math.PI /360) *2 ) * 2.485
saturn.axialTilt = ((Math.PI /360) *2 ) * 26.73
saturn.orbitTarget = sun
saturn.distanceFromTarget =  9.5 * au


console.log(saturn.radius)

saturn.build()
const saturnRingsMaterial = new THREE.MeshStandardMaterial({
  map : saturnRingsTexture,
  // alphaMap : saturnRingsTexture,
  side: THREE.DoubleSide,
  transparent : true,
  opacity : 1,
  roughness : 0.5
  
})
saturn.receiveShadow = true
saturn.castShadow = true
saturn.body.add( new Ring(saturn, 135000, saturn.radius+ 10000, saturnRingsMaterial))

//------------------Uranus---------------------

const uranusMaterial = new THREE.MeshPhysicalMaterial({
  map : uranusColorTexture,
  roughness : 0.8
})
const uranus = new Planet(25362, sun, 0, uranusMaterial)
uranus.orbitingSpeed = 6.835
uranus.revolutionSpeed = 2.59
uranus.name = 'Uranus'
uranus.planeTilt = ((Math.PI /360) *2 ) * 0.773
uranus.axialTilt = ((Math.PI /360) *2 ) * 97.8
uranus.orbitTarget = sun
uranus.distanceFromTarget =  19.189 * au

uranus.build()

//------------------Neptune---------------------

const neptuneMaterial = new THREE.MeshPhysicalMaterial({
  map : neptuneColorTexture,
  
})
const neptune = new Planet(24622, sun, 0, neptuneMaterial)
neptune.orbitingSpeed = 5.43
neptune.revolutionSpeed = 2.68
neptune.name = 'Neptune'
neptune.planeTilt = ((Math.PI /360) *2 ) * 1.304
neptune.axialTilt = ((Math.PI /360) *2 ) * 28.32
neptune.orbitTarget = sun
neptune.distanceFromTarget =  30.069 * au

neptune.build()

sun.add(mars)
sun.add(mercury)
sun.add(venus)
sun.add(jupiter)
sun.add(saturn)
sun.add(uranus)
sun.add(neptune)
earth.add(moon)
sun.add(earth)

let cameraTarget = earth

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
renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap

const labelRenderer = new CSS2DRenderer()
labelRenderer.setSize( window.innerWidth, window.innerHeight )
labelRenderer.domElement.style.position = 'absolute'
labelRenderer.domElement.style.top = '0px'
document.body.appendChild( labelRenderer.domElement )

/**
 * POST PROCESSING
 */


/**
 * ORBIT CONTROLS ***************************************
 */
const orbitControls = new OrbitControls(camera,labelRenderer.domElement)
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
window.addEventListener('load', setCanvasSize())
//Resize canvas for responsivness
window.addEventListener("resize", (e)=>{
  setCanvasSize()
})



/**
 * GUI ***************************************
 */
const gui = new GUI()

/**
 * LABELS
 */





/**
 * ANIMATION ***************************************
 */
let x = 0.001

function animate(){
  
  //Set elapsed time
  elapsedTime = clock.getElapsedTime() 
  let time = elapsedTime + timeOffset
  
  //render
  renderer.render(scene, camera)
  labelRenderer.render( scene, camera )

  //Rotations
  earth.rotate(time)
  mercury.rotate(time)
  mars.rotate(time)
  venus.rotate(time,true)
  jupiter.rotate(time)
  saturn.rotate(time)
  saturn.rotate(time)
  neptune.rotate(time)
  
  
  const oldCamTargetCoordinate = new THREE.Vector3()
  cameraTarget.body.getWorldPosition(oldCamTargetCoordinate)

  //Orbits
  earth.orbit(time, sun, false)  
  moon.orbit(time, earth)
  mercury.orbit(time, sun, false)
  venus.orbit(time, sun, false)
  mars.orbit(time, sun, false)
  jupiter.orbit(time, sun, false)
  saturn.orbit(time, sun, false)
  uranus.orbit(time, sun, false)
  neptune.orbit(time, sun, false)


  const delta = cameraTarget.coordinate.clone().sub(oldCamTargetCoordinate)

  
  window.requestAnimationFrame(animate)
  camera.position.add(delta)

  // //Camera logic
  // const cameraDistance = cameraTarget.position.distanceTo(camera.position)
  // if( cameraDistance > 10000 ){
  //   cameraTarget = sun
  //   if( x <= 1){
      
  //     orbitControls.target = orbitControls.target.clone().add(cameraTarget.coordinate.clone().sub(orbitControls.target).multiplyScalar(x)) 
  //     x = x + 0.0001
  //   }
    
  //   console.log(cameraDistance)
  // }
  
  update()

  // console.log(Math.round(elapsedTime))
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
function setCanvasSize(){
  //Set aspect
  aspect.width = window.innerWidth
  aspect.height = window.innerHeight
  
  //Set aspect Ratio
  camera.aspect = aspect.width / aspect.height
  camera.updateProjectionMatrix()

  //Set rendererSize
  renderer.setSize(aspect.width, aspect.height)
  labelRenderer.setSize( aspect.width, aspect.height )
}


