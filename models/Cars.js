class Car {
    constructor(name, length, height, width, payload) {
        this.name = name
        this.length = length
        this.height = height
        this.width = width
        this.payload = payload
    }
}

const Cars = [
    new Car('SPRINTER', 300, 250, 170, 1700),
    new Car('SMALL STRAIGHT', 500, 250, 170, 2500),
    new Car('LARGE STRAIGHT', 700, 350, 200, 4000)
]

module.exports = Cars
