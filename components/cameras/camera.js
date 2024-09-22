import Camera from '../../classes/Camera'
import { earth } from '../Objects/planets/earth'

const aspect = {
    width : window.innerWidth,
    height : window.innerHeight
}

const camera = new Camera()
camera.target = earth
camera.fov = 75
camera.near = 0.001
camera.far = 100000
camera.aspect = aspect.width / aspect.height

camera.position.z = 5
camera.position.y = 5

export { camera }