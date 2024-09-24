import * as THREE from 'three'


export default class Camera extends THREE.PerspectiveCamera{
    constructor(){
        super()
        this.fov
        this.target 
        this.delta
        this.oldTargetCoordinate = new THREE.Vector3()
        this.oldCoordinate = new THREE.Vector3()
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

        
    }
    setTarget(newTarget){
        this.target = newTarget
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
    setTimeDelta(time){

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
        const timeDelta =  time - this.travelStartAt
        console.log('Time delta', timeDelta)

        
        if( this.travelCount < this.travelValue){      
            const scalar = this.target.computedDistFromCam
            const distance = this.target.coordinate.clone().sub(this.position)

            console.log('scalar',scalar)
            this.position.lerp(this.target.coordinate.clone().addScalar(scalar), easeInOutBack(this.travelCount))
            this.travelCount +=  this.travelStep
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
        console.log('Travel over')
    }
    

}

function easeInOutBack(x){
    const c1 = 1.70158
    const c2 = c1 * 1.525

return x < 0.5
  ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
  : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2
}