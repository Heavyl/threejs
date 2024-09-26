import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'
import { camera } from './components/cameras/camera'
import { distanceFactor, globalSpeed, scale, timeOffset } from './globalParameters'

import { orbitControls, scene } from './components/scenes/main-scene'

import { renderer } from './components/renderers/mainRenderer'
import { labelRenderer } from './components/renderers/css2d'
import { solarSystemObject } from './data/solarSystem'
import { distanceCounter } from './ui/elements/distanceCounter'



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
        camera.oldTarget = camera.nextTarget //Keep track of old target
        camera.nextTarget = newTarget
       
        //If event target is different from last event firing :
        if(camera.oldTarget !== camera.nextTarget ){
          console.log('Target :', camera.nextTarget)
          console.log('Old target', camera.oldTarget)
          camera.setDistanceToNext() 
          camera.distanceToTarget = camera.distanceToNext
          
          
        //If event target is the same as before :
        }else{         
          if(camera.nextTarget !== camera.target){
            camera.target = camera.nextTarget
            console.log("Travel start")
            
            !camera.inTransition ? camera.inTransition = true : camera.resetTransition()
            !camera.inTravel ? camera.inTravel = true : camera.resetTravel()
          }else{
            console.log(camera.target.name, 'Already in focus')
          }
          
        }
      })
  })
  //Dom element integration

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
    camera.changeFocus(orbitControls)  
    
  }else{
    camera.position.add(camera.getDelta())
    orbitControls.target = camera.target.coordinate
  }

  //ui state machine 
  
  updateElement(distanceCounter, 'p', toRealDistance(camera.distanceToTarget))
  
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
 * Convert computed distance to real distance as a display purpose. 
 * @param {Number} computedDistance 
 * @returns a formated number as a string 
 */
function toRealDistance(computedDistance){
  const realDistance =  Math.max( 0, Math.floor((computedDistance/scale) * distanceFactor ))
  const toString = realDistance.toString().length
  let number = 0
  let format = ''
 
  if(toString >= 7 & toString <= 9){
    number = formatMillion(realDistance)
    format = 'million'
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
/**
 * take a distance in entry and return a truncated equivalent in million/billion
 * @param {Number} x 
 * @returns 
 */
function formatMillion(x){
    return (x / 1000000).toFixed(2) 
}
function formatBillion(x){
  return (x / 1000000000).toFixed(2) 
}
/**
 * Update html element with new content
 * @param {HTMLElement} element HTML Element to update
 * @param {String} selector if target is child of element, use .querySelector syntaxe ('div', '.class', '#id')
 * @param {String | Number} content The new content
 */
function updateElement(element, selector, content){
  if(selector){
    element.querySelector(selector).textContent = content
    return
  }
  element.textContent = content
}