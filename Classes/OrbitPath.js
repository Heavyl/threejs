import { globalMeshResolution } from "../globalParameters";
import * as THREE from 'three'
import CelestialBody from "./CelestialBody";
import degreeToRadian from "../functions/Utility/degreeToRadian";


/**
 * @param { CelestialBody} target Targeted celestial body to get distance and orbit data from
 * @param { THREE.Color} color the color of the  path
 * @param { Number} angle the angle of the  path
 */
export default class OrbitPath{
    constructor( target, color = 0xffffff, angle){
        this.target = target
        this.color = color
        this.resolution = globalMeshResolution
        this.name = target.name
        this.angle = degreeToRadian(angle)

        const curve = new THREE.EllipseCurve(
            this.target.orbitTarget.position.x,  this.target.orbitTarget.position.y,  // ax, aY
            this.target.computedDistance, this.target.computedDistance, // xRadius, yRadius
            0,  2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
        )
    
        // console.log(this.target.orbitTarget)
        const points = curve.getPoints( this.target.computedRadius * this.resolution * 10 )
        const geometry = new THREE.BufferGeometry().setFromPoints( points )
      
        const material = new THREE.LineBasicMaterial({ 
            transparent : true,
            opacity : 0.2,
            color: this.color 
        })
        const ellipse = new THREE.Line( geometry, material )
        ellipse.rotateX(Math.PI/2)
        if(this.angle > 0){
            
        }
        
        ellipse.name = this.target.name + "'s Orbit"
        return ellipse
    }

}