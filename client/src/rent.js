class Rent {
    constructor(CarId,UserId,cost,StartDate,EndDate,invoice){
        if(invoice){
            this.invoice = invoice;
        }
        this.CarId = CarId;
        this.UserId = UserId;
        this.cost = cost;
        this.StartDate = StartDate;
        this.EndDate = EndDate;
    }


    /**
     * Construct a Rent from a plain object
     * @param {{}} json 
     * @return {Car} the newly created Rent object
     */
    static from(json) {
        const t =  Object.assign(new Rent(), json);
        return t;
    }
}