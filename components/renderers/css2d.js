
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'

export const labelRenderer = new CSS2DRenderer()

labelRenderer.setSize( window.innerWidth, window.innerHeight )
labelRenderer.domElement.style.position = 'absolute'
labelRenderer.domElement.style.top = '0px'
document.body.appendChild( labelRenderer.domElement )