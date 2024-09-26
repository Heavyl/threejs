import Element from "../../classes/Element"

const classes = []
const distanceCounter = new Element('div', 'distance-counter', classes)
const text = new Element('p')
text.innerHTML = '0' 
distanceCounter.appendChild(text)
distanceCounter.updateTarget = text

export {distanceCounter}

