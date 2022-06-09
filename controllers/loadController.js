const Load = require('../models/Load')
const Truck = require('../models/Truck')
const Cars = require('../models/Cars')

const assignTruck = (dimensions, payload) => {
    const truck = Cars.find(car => car.width >= dimensions.width && car.height >= dimensions.height && car.length >= dimensions.length && car.payload >= payload)
    console.log(truck.name)
    return truck.name
}

class LoadController {
    async getLoads(req, res) {
        try {
            switch (req.user.role) {
                case 'SHIPPER':
                    const shipperLoads = await Load.find({created_by: req.user.id})
                    res.json({loads: shipperLoads})
                    break
                case 'DRIVER':
                    const driverLoads = await Load.find({assigned_to: req.user.id})
                    res.json({loads: driverLoads})
                    break
            }
        } catch (e) {
            console.log(e)
            try {
                res.status(500).json({message: 'LoadController error'})
            } catch (e) {
                console.log(e)
            }
        }
    }

    async addLoad(req, res) {
        try {
            if (req.user.role !== 'SHIPPER') {
                return res.status(400).json('You are not a shipper')
            }
            const {name, payload, pickup_address, delivery_address, dimensions} = req.body
            if (!name) {
                return res.status(400).json({message: 'Name is required'})
            } else if (!payload) {
                return res.status(400).json({message: 'Payload is required'})
            } else if (!pickup_address) {
                return res.status(400).json({message: 'Pickup address is required'})
            } else if (!delivery_address) {
                return res.status(400).json({message: 'Delivery address is required'})
            } else if (!dimensions || !dimensions.width || !dimensions.length || !dimensions.height) {
                return res.status(400).json({message: 'Dimensions are required'})
            }
            const message = `Load created by shipper with id ${req.user.id}`
            const load = await new Load({created_by: req.user.id, name, payload, pickup_address, delivery_address, dimensions, logs: [{message}]})
            await load.save()
            res.json({message: 'Load created successfully'})
        } catch (e) {
            console.log(e)
            try {
                res.status(500).json({message: 'LoadController error'})
            } catch (e) {
                console.log(e)
            }
        }
    }

    async getActiveLoad(req, res) {
        try {
            if (req.user.role !== 'DRIVER') {
                return res.status(400).json('You are not a driver')
            }
            const load = await Load.findOne({assigned_to: req.user.id})
            if (!load) {
                return res.status(400).json({message: 'There is no active load'})
            }
            res.json({load})
        } catch (e) {
            console.log(e)
            try {
                res.status(500).json({message: 'LoadController error'})
            } catch (e) {
                console.log(e)
            }
        }
    }

    async updateLoadStateById(req, res) {
        try {
            if (req.user.role !== 'DRIVER') {
                return res.status(400).json('You are not a driver')
            }
            const userId = req.user.id
            const load = await Load.findOne({assigned_to: userId, status: 'ASSIGNED'})
            if (!load) {
                return res.status(400).json({message: 'There is no active load'})
            }
            switch (load.state) {
                case 'En route to Pick Up':
                    await Load.updateOne(({assigned_to: userId, status: 'ASSIGNED'}), {$set: {state: 'Arrived to Pick Up'}})
                    res.json({message: `Load state changed to 'Arrived to Pick Up'`})
                    break
                case 'Arrived to Pick Up':
                    await Load.updateOne(({assigned_to: userId, status: 'ASSIGNED'}), {$set: {state: 'En route to delivery'}})
                    res.json({message: `Load state changed to 'En route to delivery'`})
                    break
                case 'En route to delivery':
                    await Load.updateOne(({assigned_to: userId, status: 'ASSIGNED'}), {$set: {state: 'Arrived to delivery', status: 'SHIPPED'}})
                    await Truck.updateOne({assigned_to: userId}, {$set: {status: 'IS'}})
                    res.json({message: `Load state changed to 'Arrived to delivery'`})
                    break
            }
        } catch (e) {
            console.log(e)
            try {
                res.status(500).json({message: 'LoadController error'})
            } catch (e) {
                console.log(e)
            }
        }
    }

    async getLoadById(req, res) {
        try {
            if (req.user.role !== 'SHIPPER') {
                return res.status(400).json('You are not a shipper')
            }
            const loadId = req.params.id
            const userId = req.user.id
            const load = await Load.findOne({_id: loadId, created_by: userId})
            if (!load) {
                return res.status(400).json({message: `Load with id ${loadId} does not exist`})
            }
            res.json({load})
        } catch (e) {
            console.log(e)
            try {
                res.status(500).json({message: 'LoadController error'})
            } catch (e) {
                console.log(e)
            }
        }
    }

    async updateLoadById(req, res) {
        try {
            if (req.user.role !== 'SHIPPER') {
                return res.status(400).json('You are not a shipper')
            }
            const loadId = req.params.id
            const userId = req.user.id
            const load = await Load.findOne({_id: loadId, created_by: userId})
            if (!load) {
                return res.status(400).json({message: `Load with id ${loadId} does not exist`})
            } else if (load.status !== 'NEW') {
                return res.status(400).json({message: `Can not update load with status ${load.status}`})
            }
            await Load.updateOne({_id: loadId, created_by: userId}, {$set: req.body})
            res.json({message: 'Load details changed successfully'})
        } catch (e) {
            console.log(e)
            try {
                res.status(500).json({message: 'LoadController error'})
            } catch (e) {
                console.log(e)
            }
        }
    }

    async deleteLoadById(req, res) {
        try {
            const userId = req.user.id
            const loadId = req.params.id
            const load = await Load.findOne({_id: loadId, created_by: userId})
            if (!load) {
                return res.status(400).json({message: `Load with id ${loadId} was not found`})
            } else if (load.status !== 'NEW') {
                return res.status(400).json({message: `Can not delete load with status ${load.status}. Available only for loads with status 'NEW'`})
            }
            await load.remove()
            res.json({message: 'Load deleted successfully'})
        } catch (e) {
            console.log(e)
            try {
                res.status(500).json({message: 'LoadController error'})
            } catch (e) {
                console.log(e)
            }
        }
    }

    async postLoadById(req, res) {
        try {
            const loadId = req.params.id
            const userId = req.user.id
            const load = await Load.findOne({_id: loadId, created_by: userId})
            if (!load) {
                return res.status(400).json({message: `Load with id ${loadId} was not found`})
            } else if (load.status !== 'NEW') {
                return res.status(400).json({message: `Can not post load with status ${load.status}. Available only for loads with status 'NEW'`})
            }
            const truckType = assignTruck(load.dimensions, load.payload)
            if (!truckType) {
                return res.status(400).json({message: 'Load dimensions or payload are too high'})
            }
            // await Load.updateOne({_id: loadId, created_by: userId}, {$set: {status: 'POSTED'}})
            const truck = await Truck.findOne({type: truckType, status: 'IS'})
            if (!truck) {
                // await Load.updateOne({_id: loadId, created_by: userId}, {$set: {status: 'NEW'}})
                return res.status(400).json({message: 'No trucks are available for your load now'})
            }
            await Truck.updateOne({assigned_to: truck.assigned_to, type: truckType, status: 'IS'}, {$set: {status: 'OL'}})
            await Load.updateOne({_id: loadId, created_by: userId}, {$set: {status: 'ASSIGNED', assigned_to: truck.assigned_to, state: 'En route to Pick Up'}})
            res.json({message: 'Load posted successfully', driver_found: true})
        } catch (e) {
            console.log(e)
            try {
                res.status(500).json({message: 'LoadController error'})
            } catch (e) {
                console.log(e)
            }
        }
    }

    async getShippingInfoById(req, res) {
        try {
            const userId = req.user.id
            const loadId = req.params.id
            const load = await Load.findOne({_id: loadId, created_by: userId})
            if (!load) {
                return res.status(400).json({message: `Load with id ${loadId} was not found`})
            } else if (load.status !== 'ASSIGNED') {
                return res.status(400).json({message: `Can not get info of load with status ${load.status}. Available only for loads with status 'ASSIGNED'`})
            }
            const truck = await Truck.findOne({assigned_to: load.assigned_to, status: 'OL'})
            if (!truck) {
                return res.status(400).json({message: `Truck info was not found`})
            }
            res.json({load, truck})
                } catch (e) {
            console.log(e)
            try {
                res.status(500).json({message: 'LoadController error'})
            } catch (e) {
                console.log(e)
            }
        }
    }
}

module.exports = new LoadController()
