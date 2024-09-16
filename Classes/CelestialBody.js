import * as THREE from 'three'
import { globalMeshResolution } from '../globalParameters'
import { scale } from '../globalParameters'
import { globalSpeed } from '../globalParameters'
import OrbitPath from './OrbitPath'
  
/**
 * CELESTIAL BODY
 * @param {Number} radius The radius of the celestial body ( in kilometers )
 * @param {THREE.Object3D} orbitTarget The THREE.Object3D target to orbit around
 * @param {Number} axialTilt The axial tilt of the body ( in degrees )
 * @param {THREE.Material} material The material Object for the body
 */
export default class CelestialBody extends THREE.Group{
    constructor(radius = 1000, orbitTarget = null, material = new THREE.MeshStandardMaterial()){
      super()
      this.name = 'Celestial Body'
      //Graphic parameters :
      this.resolution = globalMeshResolution
  
      //Basic init values
      this.radius = radius // in km
      this.revolutionSpeed = 1 // in km/s
      this.coordinate = new THREE.Vector3()
    
      //Materials
      this.material = material
      
      //Orbit
      this.orbitingSpeed = 29.7827 // in km/s
      this.distanceFromTarget = 0

      //Axial and planeTilt
      this.axialTilt = 0
      this.planeTilt = 0

      //Group core
      this.body = new THREE.Group()   
      // this.children = new THREE.Group()          

    } 
    build(){

      //Create Pivot point (to manage planar shifting)
      this.pivotPoint = new THREE.Group()
      this.pivotPoint.name ='Pivot Point'
      

      
      //Set Computed values, to limit scaling abération
      this.computedRadius = this.radius * scale
      this.computedSpeed = scale * this.orbitingSpeed * globalSpeed
      this.computedRevSpeed = scale * this.revolutionSpeed * globalSpeed
      if(this.orbitTarget){
        
        //Set orbit Target
        this.orbitTarget = this.orbitTarget
        this.orbitTargetBody = this.orbitTarget.body

        //Compute distance from target
        this.computedDistance = ((this.orbitTarget.radius + this.distanceFromTarget) / 10) * scale  //Reduce distance from target by a 1000 factor 
        
        //Set orbit path
        this.orbitPath = this.createOrbitPath( 0xffffff )
        this.pivotPoint.attach(this.orbitPath)
        this.pivotPoint.rotateZ(this.planeTilt)
        
      }

      //Axes Helper
      const axeHelper = new THREE.AxesHelper(this.computedRadius + 10 * this.computedRadius)
      axeHelper.name = 'Axes'
      this.body.add(axeHelper)

      //Build Surface geometry
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry( this.computedRadius, this.resolution, this.resolution ), 
        this.material) 
      mesh.name = 'Surface'
      mesh.receiveShadow = true
      mesh.castShadow = true
      

      //Body of celestial Object
      this.body.add(mesh)
      this.body.name = 'Body' 
      if(this.computedDistance){
        this.pivotPoint.position.z = this.computedDistance
      }
      
      //add object to pivot, add pivot to parent
      this.pivotPoint.attach(this.body)
      this.attach(this.pivotPoint)
      this.body.rotateZ(this.axialTilt)
    
    }
    /**
     * Manage body rotation on itself
     * @param {Boolean} clockwise Revolution direction. True if clockwise, false if counterclockwise
     */
    rotate(time, clockwise = false){
      let revoltionDirection = 1
      if(clockwise){
        revoltionDirection = -1
      }
      this.body.rotation.y = time * this.computedRevSpeed 
    }
    /**
     * Manage the orbit animation, update position of body
     * @param {THREE.Clock} time Time from THREE.clock
     * @param {THREE.Object3D} target The orbit target
     * @param {Boolean} clockwise Orbit direction. True if clockwise, false if counterclockwise
     */
    orbit(time, target, clockwise = true){
      
      const targetPosition = new THREE.Vector3()
      target.body.getWorldPosition(targetPosition)

      this.pivotPoint.position.set(targetPosition.x,targetPosition.y, targetPosition.z)
      
      //Manage Orbit direction
      let orbitDirection = 1
      if(clockwise === false){
        orbitDirection = -1
      }
      //Orbit mathematics
      this.pivotPoint.rotateY(this.computedSpeed * scale * globalSpeed ) 
      

      // this.body.position.x  = (this.pivotPoint.position.x + Math.cos(this.computedSpeed* time) * (this.computedDistance * orbitDirection))
      // this.body.position.z  = (this.pivotPoint.position.z + Math.sin(this.computedSpeed * time) * this.computedDistance)
      
      this.body.getWorldPosition(this.coordinate)
      
      
      
      if(this.name == 'Moon'){
        // console.log(this.position) 
        // console.log(targetPosition) 
        
      }
    }
    /**
     * 
     * @param {THREE.Color} color A THREE.Color object
     * @param {Number} angle Angle of planar tilt (in degree)
     * @returns An orbit path to render in physical world
     */
    createOrbitPath(color, angle){  
      return new OrbitPath(this, color, angle)          
    }
  }