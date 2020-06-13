class Car {
    constructor(id,model,brand,category,plate){
        if(id){
            this.id =id;
        }
        this.model = model;
        this.brand = brand;
        this.category = category;
        this.plate = plate;
    }

    /**
     * Construct a Car from a plain object
     * @param {{}} json 
     * @return {Car} the newly created Car object
     */
    static from(json) {
        const t =  Object.assign(new Car(), json);
        return t;
    }
}

module.exports = Car