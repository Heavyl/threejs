import Camera from '../../classes/Camera'

const aspect = {
    width : window.innerWidth,
    height : window.innerHeight
}

const camera = new Camera()
camera.fov = 75
camera.near = 0.01
camera.far = 100000
camera.aspect = aspect.width / aspect.height

export { camera }