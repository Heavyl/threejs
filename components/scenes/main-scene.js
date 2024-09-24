import * as THREE from 'three'
import { cubeLoader } from '../loaders/cubeLoader'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import { labelRenderer } from '../renderers/css2d'
import { camera } from '../cameras/camera'


import { solarSystemObject } from '../../data/solarSystem'
import Planet from '../../classes/Planet'
import Star from '../../classes/Star'
import CelestialBody from '../../classes/CelestialBody'


const scene = new THREE.Scene({
    name: 'Scene'
})

//-------------- Objects --------------

const systemObj = solarSystemObject
const solarSystem = new THREE.Group()
solarSystem.name = "Solar System"

for( const [name, object] of Object.entries(systemObj)){
    populate( solarSystem, object )
}

scene.add(solarSystem)


//------------ Orbit Control ------------- 

scene.add(camera)


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

/**
 * Small function to automatically add any CelestialBody (and child classes) to the right parent. 
 * If the object have an 'orbitTarget' paremeter defined, object use this target as a parent.
 * Else it add the object to the firstParent indicated as second parameter.
 * @example 
 * @param {Planet | Star | CelestialBody} firstParent The firstParent where every other will be attached
 * @param {Planet | Star | CelestialBody} object The object to add to the scene, as a child of it's 'orbitTarget'
 * @returns 
 */
function populate( firstParent, object){
    const parent = object.orbitTarget
    parent ? parent.add(object) : firstParent.add(object)      
    
}