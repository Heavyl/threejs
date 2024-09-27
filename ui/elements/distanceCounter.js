import Element from "../../classes/Element"

const classes = []
const distanceCounter = new Element('div', 'distance-counter', classes)
const name = new Element('p','counter-target-name')
const counter = new Element('p', 'counter-value')
name.innerHTML = 'qsdqsd' 
counter.innerHTML = '0' 
distanceCounter.appendChild(name)
distanceCounter.appendChild(counter)


export {distanceCounter}

