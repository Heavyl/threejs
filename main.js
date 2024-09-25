import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'
import { camera } from './components/cameras/camera'
import { globalSpeed, scale, timeOffset } from './globalParameters'

import { orbitControls, scene } from './components/scenes/main-scene'

import { renderer } from './components/renderers/mainRenderer'
import { labelRenderer } from './components/renderers/css2d'
import { solarSystemObject } from './data/solarSystem'
import { distanceCounter } from './components/domElements/distanceCounter'



//------------- Stats init ----------------

const stats = new Stats()
document.body.appendChild(stats.dom)

//------------------- GUI setup -------------------

const gui = new GUI()

//------------- ThreeJS clock init ----------------

const clock = new THREE.Clock()

//------------- On Load Events ----------------

window.addEventListener('load', ()=>{
  //Start Clock
  clock.start()
  //Set canvas size on loading page
  setCanvasSize()

  //Setup event for click on labels
  const labels = document.querySelectorAll('.label')  
  
  labels.forEach((label)=>{
      label.addEventListener('pointerdown', (e)=>{
        const newTarget = scene.getObjectByName(e.target.dataset.name)
        camera.oldTarget = camera.target //Keep track of old target
        camera.target = newTarget // set new target to be the selected one

       
        //Switch in transition mode if target is different from before
        if(camera.oldTarget != camera.target ){
          console.log("transition start! ", 'Target :', camera.target)
          camera.resetTravel()
          camera.setDistanceToFocused()
          camera.distanceToTarget = camera.distanceToFocused
          

          !camera.inTransition ? camera.inTransition = true : camera.resetTransition()
        }else{          
          if(camera.focusTarget !== camera.target){
            camera.focusTarget = camera.target
            camera.inTravel = true 
            console.log("Travel start")
          }else{
            console.log(camera.target.name, 'Already in focus')
          }
          
        }
      })
  })
  //Dom element integration
  const canvas = document.querySelector('#three')

  document.body.appendChild(distanceCounter)
})

//------------- On resize Events ----------------

window.addEventListener("resize", (e)=>{
  setCanvasSize()
})

//------------ Animation Loop -----------------


function animate(){
  window.requestAnimationFrame(animate)
  
  //Set elapsed time
  const elapsedTime = clock.getElapsedTime() 
  let time = elapsedTime + timeOffset
  
  //render
  renderer.render(scene, camera)
  labelRenderer.render( scene, camera )
 
  
  //Get camera target coordinate before every other animation
  camera.getOldCoord()

  //Object state machine
  for( const [name, object] of Object.entries(solarSystemObject)){

    //Orbits
    if(object.isOrbiting){
      if(camera.inTravel){
        object.play = false
      }else{
        object.play = true
        object.orbit(time)
      }
    }
    //Rotations
    if(object.isRotating){
      object.rotate(time)
    }
  }

  //Camera state machine
  if(camera.inTravel){    
    camera.travel(time)
    
  }else{
    camera.position.add(camera.getDelta())
   
  }
  if(camera.inTransition){    
    camera.changeFocus(orbitControls)  
   
  }else{
    orbitControls.target = camera.target.coordinate
    
  }

  //ui state machine 
  
  distanceCounter.querySelector('p').textContent = toRealDistance(camera.distanceToTarget)
  
  update()

}

animate()

//---------------- Functions --------------

function update(){
  stats.update()
  orbitControls.update()
}

/**
 * Set canvas size depending on the width and height of the window.
 * Function to be called on load and on resize event
 */
function setCanvasSize(){

  //Set aspect
  const aspect = {
    width : window.innerWidth,
    height : window.innerHeight
  }
  aspect.width = window.innerWidth
  aspect.height = window.innerHeight
  
  //Set aspect Ratio
  camera.aspect = aspect.width / aspect.height
  camera.updateProjectionMatrix()

  //Set rendererSize
  renderer.setSize(aspect.width, aspect.height)
  labelRenderer.setSize( aspect.width, aspect.height )
}
/**
 * Convert computed distance to real distance. reverse 
 * @param {*} computedDistance 
 * @returns 
 */
function toRealDistance(computedDistance){
  const realDistance =  Math.floor((computedDistance/scale) * 10 )
  const toString = realDistance.toString().length
  let number = 0
  let format = ''

 
  if(toString >= 7 & toString < 10){
    number = formatMillion(realDistance)
    format = 'million'
    console.log(number)
  }
  else if(toString > 9){
    number = formatBillion(realDistance)
    format = 'billion'
  }else{
    number = numberWithSpaces(realDistance)
  }
  
  return number  + ' ' + format + ' Km'
}
/**
 * Format number and add spaces
 * @param {Number} x 
 * @returns 
 */
function numberWithSpaces(x) {
  var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}

function formatMillion(number){
    return (number / 1000000).toFixed(2) 
}
function formatBillion(number){
  return (number / 1000000000).toFixed(2) 
}