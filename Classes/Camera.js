import * as THREE from 'three'
import { STATE } from '../data/state'
import { easeInOutCubic } from '../functions/transitions'


export default class Camera extends THREE.PerspectiveCamera{
    constructor(){
        super()
        this.fov
        this.target 
        this.oldTargetCoordinate = new THREE.Vector3()
        this.coordinates = this.position
        this.nextTarget = null

        //Travelling
        this.travelSpeed = 100
        this.distanceToNext = 0 //Distance from camera to next target object
        this.distanceToTarget = 0 //Distance from camera to actual camera target
        this.travelStartAt = 0
    }
    /**
     * Keeps track of target old coordonate.Used to calculate delta with next coordonate.
     */
    getOldCoord(){
        this.target.body.getWorldPosition(this.oldTargetCoordinate)  
    }
    /**
     * Get delta between old camera target position and new camera target position
     * Used to "follow" target.
     * @returns {THREE.Vector3}
     */
    getDelta(){
        return this
            .target
            .coordinate
            .clone()
            .sub(this.oldTargetCoordinate)
    }
    /**
     * Calculate distance between camera target position
     * @param {THREE.Object3D} target 
     */
    distanceTo(target){
        return this.position.distanceTo(target.coordinate)
    }
    /**
     * Camera travel animation logic through time
     * @param {Number} time THREE.Clock elapsed time
     * @returns 
     */
    travel(time){              
        //set travel start time. Based on THREE.Clock time
        if(this.travelStartAt === 0){
            this.travelStartAt = time
        }
        //Calculate travel time in function of distance to target
        const timeDelta =  time - this.travelStartAt        
        const travelTime =  Math.max(3, this.distanceToNext / this.travelSpeed)
        const distance = this.position.distanceTo(this.target.coordinate)

        //Do this while elapsed time inferior to travel time
        if( timeDelta <= travelTime ){  
            const deltaFromBody = this.target.computedRadius * 2
            if(distance <= deltaFromBody * 1.8) this.resetTravel()
            const tNormalized = (timeDelta) / (travelTime)

            const distanceDelta = this.target.coordinate.clone().sub(this.position.clone()).addScalar(deltaFromBody)
            this.position.addScaledVector(distanceDelta, easeInOutCubic(tNormalized) )
            this.distanceToTarget = distance - deltaFromBody * 1.8
            return
        }       
        this.resetTravel()
          
    }
    /**
     * Reset travel animation
     */
    resetTravel(){
        STATE.inTravel = false
        this.travelStartAt = 0
        console.log('Travel over')
    }
    /**
     * Update position of the camera through time
     * @param {Number} time THREE.clock.js elapsed time
     * @returns 
     */
    updatePosition(time){ 
        if(STATE.inTravel){
            this.travel(time)
            return
        } 
        this.position.add(this.getDelta())

    }

}
