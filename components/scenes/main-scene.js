import * as THREE from 'three'
import { cubeLoader } from '../loaders/cubeLoader'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import { labelRenderer } from '../renderers/css2d'
import { camera } from '../cameras/camera'

import { earth, moon } from '../objects/planets/earth'
import { sun } from '../objects/stars/sun'
import { mercury } from '../objects/planets/mercury'
import { venus } from '../objects/planets/venus'
import { deimos, mars, phobos } from '../objects/planets/mars'
import { jupiter } from '../objects/planets/jupiter'
import { saturn } from '../objects/planets/saturn'
import { uranus } from '../objects/planets/uranus'
import { neptune } from '../objects/planets/neptune'


const scene = new THREE.Scene({
    name: 'Scene'
})

//-------------- Objects --------------


const solarSystem = new THREE.Group()
solarSystem.name = "Solar System"

solarSystem.add(
    sun,
    mercury,
    venus,
    earth.add(moon),
    mars.add(deimos, phobos),
    jupiter,
    saturn,
    uranus,
    neptune
)

scene.add(solarSystem)
scene.add(camera)


//------------ Orbit Control ------------- 

export const orbitControls = new OrbitControls(camera,labelRenderer.domElement)
orbitControls.enableDamping = true
orbitControls.dampingFactor = 0.02
orbitControls.target = camera.target.coordinate

orbitControls.enablePan = false

//-------------- Skybox --------------

const skyTexture = cubeLoader.load([
    '/textures/sky/px.png',
    '/textures/sky/px.png',
    '/textures/sky/py.png',
    '/textures/sky/ny.png',
    '/textures/sky/pz.png',
    '/textures/sky/nz.png'
])
scene.background = skyTexture

//------------ Lights -------------

const ambientLigth = new THREE.AmbientLight(0xffffff, 0.005)
scene.add(ambientLigth)

export {scene}
