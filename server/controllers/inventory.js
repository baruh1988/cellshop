const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
const Manufacturer = require("../models/manufacturer");
const Model = require("../models/model");
const Inventory = require("../models/inventory");
const { response, request } = require("express");

router.post("/createInventoryItem", (request,response,next) => {
    const modelId = request.body.modelId;
    const description = request.body.description;
    const serialNumber = request.body.serialNumber;
    const quantity = request.body.quantity;
    const price = request.body.price;
    const quantityThreshold = request.body.quantityThreshold;
    const image = request.body.image;
    Model.findOne({where: {id: modelId}})
    .then((findOneModelResult) => {
        if(findOneModelResult){
            Inventory.findOne({where: {modelId: modelId}})
            .then((findOneInventoryItemResult) => {
                if(findOneInventoryItemResult){
                    return response.status(200).json({
                        process: true,
                        message: "Inventory item already exist"
                    })
                }
                else{
                    Inventory.create({
                        modelId: modelId,
                        description: description,
                        serialNumber: serialNumber,
                        quantity: quantity,
                        price: price,
                        quantityThreshold: quantityThreshold,
                        image: image
                    })
                    .then((createInventoryItemEntryResult) => {
                        return response.status(200).json({
                            process: true,
                            message: "New inventory item was created",
                            data: createInventoryItemEntryResult
                        })
                    })
                    .catch((createInventoryItemEntryError) => {
                        return response.status(500).json({
                            process: false,
                            message: createInventoryItemEntryError.message
                        })
                    })
                }
            })
            .catch((findOneInventoryItemError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneInventoryItemError.message
                })
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Model not found"
            })
        }
    })
    .catch((findOneModelError) => {
        return response.status(500).json({
            process: false,
            message: findOneModelError.message
        })
    })
})

router.post('/editInventoryItem', (request,response,next) => {
    const id = request.body.id;
    const newModelId = request.body.newModelId;
    const newDescription = request.body.newDescription;
    const newSerialNumber = request.body.newSerialNumber;
    const newQunatity = request.body.newQunatity;
    const newPrice = request.body.newPrice;
    const newQunatityThreshold = request.body.newQunatityThreshold;
    const newImage = request.body.newImage;
    Inventory.findOne({where: {id:id}})
    .then((findOneInventoryItemResult) => {
        if(findOneInventoryItemResult){
            findOneInventoryItemResult.set({
                modelId: newModelId,
                description: newDescription,
                serialNumber: newSerialNumber,
                quantity: newQunatity,
                price: newPrice,
                quantityThreshold: newQunatityThreshold,
                image: newImage
            });
            findOneInventoryItemResult.save()
            .then((updatedInventoryItem) => {
                return response.status(200).json({
                    process: true,
                    message: "Inventory item was updated",
                    data: updatedInventoryItem
                })
            })
            .catch((saveError) => {
                return response.status(500).json({
                    process: false,
                    message: saveError.message
                })
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Inventory item not exist"
            })
        }
    })
    .catch((findOneInventoryItemError) => {
        return response.status(500).json({
            process: false,
            message: findOneInventoryItemError.message
        })
    })
})

router.get("/getAllInventoryItems", (request,response,next) => {
    const modelId = request.body.modelId;
    const description = request.body.description;
    const serialNumber = request.body.serialNumber;
    Inventory.findAll()
    .then((findAllInventoryItemsResult) => {
        if(findAllInventoryItemsResult){
            return response.status(200).json({
                process: true,
                message: `Found ${findAllInventoryItemsResult.length} inventory items`,
                data: findAllInventoryItemsResult
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Found 0 inventory items"
            })
        }
    })
    .catch((findAllInventoryItemsError) => {
        return response.status(500).json({
            process: false,
            message: findAllInventoryItemsError.message
        })
    })
})

router.get('/getInventoryItemById', (request,response,next) => {
    const id = request.body.id;
    Inventory.findOne({where: {id:id}})
    .then((findOneInventoryItemResult) => {
        if(findOneInventoryItemResult){
            return response.status(200).json({
                process: true,
                message: "Inventory item found",
                data: findOneInventoryItemResult
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Inventory item not found"
            })
        }
    })
    .catch((findOneInventoryItemError) => {
        return response.status(500).json({
            process: false,
            message: findOneInventoryItemError.message
        })
    })
})

router.post('/deleteInventoryItem', (request,response,next) => {
    const id = request.body.id;
    Inventory.findOne({where: {id:id}})
    .then((findOneInventoryItemResult) => {
        if(findOneInventoryItemResult){
            findOneInventoryItemResult.destroy()
            .then(() => {
                return response.status(200).json({
                    process: true,
                    message: "Inventory item deleted"
                })
            })
            .catch((destroyError) => {
                return response.status(500).json({
                    process: false,
                    message: destroyError.message
                })
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Inventory item not found"
            })
        }
    })
    .catch((findOneInventoryItemError) => {
        return response.status(500).json({
            process: false,
            message: findOneInventoryItemError.message
        })
    })
})

module.exports = router;