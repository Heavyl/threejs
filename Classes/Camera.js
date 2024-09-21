import * as THREE from 'three'


export default class Camera extends THREE.PerspectiveCamera{
    constructor(){
        super()
        this.fov
        this.target = new THREE.Vector3(0,0,0)//Set cam to world origin
        this.delta
        this.coordinates = new THREE.Vector3()
        this.oldTargetCoordinate = new THREE.Vector3()
        this.oldCoordinate = new THREE.Vector3()

        //Transition
        this.inTransition = false
        this.transCount = 1
        this.transStep = 0.01

        //Camera travelling
        this.inTravel = false
        this.travelStep = 0.01
        this.travelCount = 1
        

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

    /**
     * Takes an OrbitControls in input and manage smooth transition on camera target change
     * @param {THREE.orbitControls} orbitControls The orbit control 
     */
    changeFocus(orbitControls){
        
        if( this.transStep < this.transCount){      
            orbitControls.target = orbitControls.target
            .clone()
            .add(this.target.coordinate.clone()
            .sub(orbitControls.target)
            .multiplyScalar(this.transStep)) 
            // orbitControls.target.lerp(this.target.coordinate, this.step)
            this.transStep = this.transStep + 0.01
            return
        }

        this.resetTransition()
           
    }
    travel(){ 
        if( this.travelStep < this.travelCount){      
            const scalar = this.target.computedDistFromCam
            this.position.lerp(this.target.coordinate.clone().addScalar(scalar), this.travelStep)
            this.travelStep = this.travelStep + 0.01
            return
        }       
        this.resetTravel()
        this.position.add(this.getDelta())     
    }
    resetTransition(){
        this.transStep = 0.01
        this.inTransition = false
        console.log('Transition over')
    }
    resetTravel(){
        this.travelStep = 0.01
        this.inTravel = false
        console.log('Travel over')
    }
    

}