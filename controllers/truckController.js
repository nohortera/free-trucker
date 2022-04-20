const Truck = require('../models/Truck')

class TruckController {
    async getTrucks(req, res) {
        try {
            console.log(req.user.role)
            if (req.user.role !== 'DRIVER') {
                return res.status(400).json('You are not a driver')
            }
            const id = req.user.id
            const trucks = await Truck.find({created_by: id})
            // if (!trucks.length) {
            //     res.status(400).json({message: 'There is no any truck'})
            // }
            res.status(200).json({trucks})
        } catch (e) {
                console.log(e)
            try {
                res.status(500).json({message: 'TruckController error'})
            } catch (e) {
                console.log(e)
            }
        }
    }

    async addTruck(req, res) {
        try {
            if (req.user.role !== 'DRIVER') {
                return res.status(400).json('You are not a driver')
            }
            const id = req.user.id
            const type = req.body.type
            if (!type) {
                return res.status(400).json({message: 'Please, specify a type of the truck'})
            }
            const truck = await new Truck({created_by: id, type})
            await truck.save()
            res.json({message: 'Truck created successfully'})
        } catch (e) {
            console.log(e)
            try {
                res.status(500).json({message: 'TruckController error'})
            } catch (e) {
                console.log(e)
            }
        }
    }

    async getTruckById(req, res) {
        try {
            if (req.user.role !== 'DRIVER') {
                return res.status(400).json('You are not a driver')
            }
            const userId = req.user.id
            const truckId = req.params.id
            const truck = await Truck.findOne({_id: truckId, created_by: userId})
            if (!truck) {
                return res.status(400).json({message: 'Truck was not found'})
            }
            res.json({truck})
        } catch (e) {
            console.log(e)
            try {
                res.status(500).json({message: 'TruckController error'})
            } catch (e) {
                console.log(e)
            }
        }
    }

    async updateTruckById(req, res) {
        try {
            if (req.user.role !== 'DRIVER') {
                return res.status(400).json('You are not a driver')
            }
            const userId = req.user.id
            const truckId = req.params.id
            const type = req.body.type
            if (!type) {
                return res.status(400).json({message: 'Please, specify a type of the truck'})
            }
            const truck = await Truck.findOne({_id: truckId, created_by: userId})
            if (!truck) {
                return res.status(400).json({message: 'Truck was not found'})
            } else if (truck.assigned_to === userId) {
                return res.status(400).json({message: 'You can not update assigned to you truck info'})
            }
            await Truck.updateOne({_id: truckId, created_by: userId}, {$set: {type}})
            res.json({message: 'Truck details changed successfully'})
        } catch (e) {
            console.log(e)
            try {
                res.status(500).json({message: 'TruckController error'})
            } catch (e) {
                console.log(e)
            }
        }
    }

    async deleteTruckById(req, res) {
        try {
            if (req.user.role !== 'DRIVER') {
                return res.status(400).json('You are not a driver')
            }
            const userId = req.user.id
            const truckId = req.params.id
            const truck = await Truck.findOne({_id: truckId, created_by: userId})
            if (truck.assigned_to === userId) {
                return res.status(400).json({message: 'You can not delete assigned to you truck'})
            }
            await truck.remove()
            res.json({message: 'Truck deleted successfully'})
        } catch (e) {
            console.log(e)
            try {
                res.status(500).json({message: 'TruckController error'})
            } catch (e) {
                console.log(e)
            }
        }
    }

    async assignTruckById(req, res) {
        try {
            if (req.user.role !== 'DRIVER') {
                return res.status(400).json('You are not a driver')
            }
            const userId = req.user.id
            const truckId = req.params.id
            const truck = await Truck.findOne({_id: truckId, created_by: userId})
            if (!truck) {
                return res.status(400).json({message: 'Invalid truck id'})
            }
            const assignedTruck = await Truck.findOne({assigned_to: userId})
            if (assignedTruck) {
                if (assignedTruck.status === 'OL') {
                    return res.status(400).json({message: 'Can not change assigned truck en route'})
                }
                await Truck.updateOne({created_by: userId, assigned_to: userId}, {$set: {assigned_to: null, status: null}})
            }
            await Truck.updateOne({_id: truckId, created_by: userId}, {$set: {assigned_to: userId, status: 'IS'}})
            res.json({message: 'Truck assigned successfully'})
        } catch (e) {
            console.log(e)
            try {
                res.status(500).json({message: 'TruckController error'})
            } catch (e) {
                console.log(e)
            }
        }
    }
}

module.exports = new TruckController()
