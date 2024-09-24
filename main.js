import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'
import { camera } from './components/cameras/camera'
import { timeOffset } from './globalParameters'

import { orbitControls, scene } from './components/scenes/main-scene'

import { renderer } from './components/renderers/mainRenderer'
import { labelRenderer } from './components/renderers/css2d'
import { solarSystemObject } from './data/solarSystem'



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
})

//------------- On resize Events ----------------

window.addEventListener("resize", (e)=>{
  setCanvasSize()
})
//-------------- Helpers------------------

const arrow = new THREE.ArrowHelper(
  camera.target.coordinates,
  camera.position,
  10,
)

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
      object.orbit(time)
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

