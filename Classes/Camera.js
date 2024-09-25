import * as THREE from 'three'


export default class Camera extends THREE.PerspectiveCamera{
    constructor(){
        super()
        this.fov
        this.target 
        this.delta
        this.oldTargetCoordinate = new THREE.Vector3()
        this.oldCoordinate = new THREE.Vector3()
        this.coordinates = this.position
        this.focusTarget = null
        
        //Transition
        this.inTransition = false
        this.transValue = 1
        this.transStep = 0.005
        this.transCount = 0

        //Travelling
        this.inTravel = false
        this.travelValue = 1
        this.travelStep = 0.01
        this.travelCount = 0 
        this.travelStartAt = 0
        this.travelSpeed = 100
        this.distanceToTarget = 0

    }
   
    getOldCoord(){
        this.target.body.getWorldPosition(this.oldTargetCoordinate)  
        this.getWorldPosition(this.oldCoordinate)  
    }
    /**
     * Get delta between old target position and new target position
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
     * Set distance from actual camera position to target position
     */
    setDistanceToTarget(){
        //Calculate distance between position and target 
        this.distanceToTarget = this.target.coordinate.distanceTo(this.position)
        console.log('distance to ', this.target.name, ' :', this.distanceToTarget)
        
    }
    /**
     * Takes an OrbitControls in input and manage smooth transition on camera target change
     * @param {THREE.orbitControls} orbitControls The orbit control 
     */
    changeFocus(orbitControls){
        
        if( this.transCount < this.transValue){      
            orbitControls.target = orbitControls.target
            .clone()
            .add(this.target.coordinate.clone()
            .sub(orbitControls.target)
            .multiplyScalar(this.transCount)) 
            // orbitControls.target.lerp(this.target.coordinate, this.transCount)
            this.transCount += this.transStep 
            return
        }
        
        this.resetTransition()
           
    }
    
    travel(time){         
        
        //set travel start time. Based on THREE.Clock time
        if(this.travelStartAt === 0){
            this.travelStartAt = time
        }
        //Calculate travel time 
        const timeDelta =  time - this.travelStartAt
        const travelTime =  Math.max(3, this.distanceToTarget / this.travelSpeed)

        const distance = this.position.distanceTo(this.target.coordinate)

        //Do this while elapsed time inferior to  travel time
        if( timeDelta <= travelTime ){  
            const deltaFromBody = this.target.computedRadius * 2

            if(distance <= deltaFromBody * 2) this.resetTravel()

            const tNormalized = (timeDelta) / (travelTime)
            const distanceDelta = this.target.coordinate.clone().sub(this.position.clone()).addScalar(deltaFromBody)
            
            this.position.addScaledVector(distanceDelta, easeInOutCubic(tNormalized) )
            console.log('Distance :' , distance )
            console.log('Delta from body :', deltaFromBody*2)
            
            return
        }       
        this.resetTravel()
        this.position.add(this.getDelta())     
    }
    resetTransition(){
        this.transCount = 0
        this.inTransition = false
        console.log('Transition over')
    }
    resetTravel(){
        this.travelCount = 0
        this.inTravel = false
        this.travelStartAt = 0
        console.log('Travel over')
    }
    

}
/**
 * Ease-in ease out function, with an "elastic" twist
 * @param {Number} x 
 * @returns 
 */
function easeInOutBack(x){
    const c1 = 1.70158
    const c2 = c1 * 1.525

    return x < 0.5
    ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
    : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2
}
/**
 * Classic Ease-in ease out function
 * @param {Number} x 
 * @returns 
 */
function easeInOutCubic(x) {
    return x < 0.5 
        ? 4 * x * x * x 
        : 1 - Math.pow(-2 * x + 2, 3) / 2
}