import * as THREE from 'three'

const canvas = document.querySelector('#three')
export const renderer = new THREE.WebGLRenderer({
  canvas :canvas, 
  antialias : true
})

renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap