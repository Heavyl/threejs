/**Basic class to create DOM element
 * 
 * @param {String} type Html tag of the element
 * @param {String} id The id of the element
 * @param {Array | String} classes A class or array of classes as strings
 */

export default class Element{
    constructor(tag = 'div', id = null, classes = null ){
        //Create element
        this.element = document.createElement(tag)
        
        //Add id
        if(id){ this.element.setAttribute('id', id) }

        //Add classes
        if(classes){ 
            if(Array.isArray(classes)){
                classes.forEach(_class => {
                    this.element.classList.add(_class) 
                })
            }else {
                this.element.classList.add(classes)
            }
        }
        return this.element
    }/**
     * 
     * @param {String} child The child to apply the modification. Use .querySelector syntaxe
     * @param {String | Number} newContent 
     */
    updateContent(child, newContent){
        
            this.element.querySelector(child).textContent = newContent
            console.log(child)
            
        

    }
}