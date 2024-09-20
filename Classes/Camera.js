import * as THREE from 'three'


export default class Camera extends THREE.PerspectiveCamera{
    constructor(){
        super()
        this.target = new THREE.Vector3(0,0,0)//Set cam to world origin
        this.oldTarget
        this.delta
        this.oldTargetCoordinate = new THREE.Vector3()
        this.inTransition = false
        this.transDuration = 1000
        this.x = 0.01
    }
    setTarget(newTarget){
        this.target = newTarget
    }
    getOldTargetCoord(){
        this.target.body.getWorldPosition(this.oldTargetCoordinate)  
    }
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
    transition(orbitControls){
        
        if( this.x < 1){
      
            orbitControls.target = orbitControls.target
            .clone()
            .add(this.target.coordinate.clone()
            .sub(orbitControls.target)
            .multiplyScalar(this.x)) 
      
            this.x = this.x + 0.001
            
          }else{
            this.inTransition = false
            this.x = 0.01
          }
          
           
    }

}