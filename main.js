import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'
import { camera } from './components/cameras/camera'
import { timeOffset } from './globalParameters'

//Object imports
import { orbitControls, scene } from './components/scenes/main-scene'

import { earth, moon } from "./objects/planets/earth"
import { jupiter } from "./objects/planets/jupiter"
import { deimos, mars, phobos } from "./objects/planets/mars"
import { mercury } from "./objects/planets/mercury"
import { neptune } from "./objects/planets/neptune"
import { saturn } from "./objects/planets/saturn"
import { uranus } from "./objects/planets/uranus"
import { venus } from "./objects/planets/venus"


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
  //Set canvas size on loading page
  setCanvasSize()

  //Event for click on labels
  const labels = document.querySelectorAll('.label')  
  
  labels.forEach((label)=>{
      label.addEventListener('pointerdown', (e)=>{
        const newTarget = scene.getObjectByName(e.target.dataset.name)
        camera.oldTarget = camera.target //Keep track of old target
        camera.target = newTarget // set new target to be the selected one
        
        //Switch in transition mode if target is different from before
        if(camera.oldTarget != camera.target ){
          console.log("transition start")
          !camera.inTransition ? camera.inTransition = true : camera.resetTransition()
        }else{          
          console.log("Travel start")

          !camera.inTravel ? camera.inTravel = true : camera.resetTravel()
        }
      })
  })
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
      object.orbit(time)
      console.log(name, object)
    }
    //Rotations
    if(object.isRotating){
      object.rotate(time)
    }
  }

  //Camera state machine
  if(camera.inTravel){
    camera.travel()
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

