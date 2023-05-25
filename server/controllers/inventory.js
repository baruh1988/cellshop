const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
const Manufacturer = require("../models/manufacturer");
const Model = require("../models/model");
const InventoryItemType = require("../models/inventoryItemType");
const Inventory = require("../models/inventory");
const { response, request } = require("express");

router.post("/createInventoryItem", (request,response,next) => {
    const modelId = request.body.modelId;
    const inventoryItemTypeId = request.body.inventoryItemTypeId;
    let description = request.body.description;
    const serialNumber = request.body.serialNumber;
    const quantity = request.body.quantity;
    const price = request.body.price;
    const quantityThreshold = request.body.quantityThreshold;
    const image = request.body.image;
    InventoryItemType.findOne({where: {id:inventoryItemTypeId}})
    .then((findOneInventoryItemTypeResult) => {
        if(findOneInventoryItemTypeResult){
            Model.findOne({where: {id: modelId}})
            .then((findOneModelResult) => {
                if(findOneModelResult){
                    Inventory.findOne({where: {
                        modelId: modelId,
                        inventoryItemTypeId: inventoryItemTypeId,
                        description: description
                    }})
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
                                inventoryItemTypeId: inventoryItemTypeId,
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
                                    message: createInventoryItemEntryError.message,
                                    level: 4
                                })
                            })
                        }
                    })
                    .catch((findOneInventoryItemError) => {
                        return response.status(500).json({
                            process: false,
                            message: findOneInventoryItemError.message,
                            level: 3
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
                    message: findOneModelError.message,
                    level: 2
                })
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Inventory item type not found"
            })
        }
    })
    .catch((findOneInventoryItemTypeError) => {
        return response.status(500).json({
            process: false,
            message: findOneInventoryItemTypeError.message,
            level: 1
        })
    })
})

router.post('/editInventoryItem', (request,response,next) => {
    const id = request.body.id;
    const newModelId = request.body.newModelId;
    const newInventoryItemTypeId = request.body.newInventoryItemTypeId
    let newDescription = request.body.newDescription;
    const newSerialNumber = request.body.newSerialNumber;
    const newQunatity = request.body.newQunatity;
    const newPrice = request.body.newPrice;
    const newQunatityThreshold = request.body.newQunatityThreshold;
    const newImage = request.body.newImage;
    InventoryItemType.findOne({where: {id:newInventoryItemTypeId}})
    .then((findOneInventoryItemTypeResult) => {
        if(findOneInventoryItemTypeResult){
            Inventory.findOne({where: {id:id}})
            .then((findOneInventoryItemResult) => {
                if(findOneInventoryItemResult){
                    Model.findOne({where: {id:newModelId}})
                    .then((findOneModelResult) => {
                        if(findOneModelResult){
                            Inventory.findOne({where: {
                                modelId:newModelId,
                                inventoryItemTypeId: newInventoryItemTypeId,
                                description: newDescription
                            }})
                            .then((findOneExistingInventoryItemResult) => {
                                if(findOneExistingInventoryItemResult != null && id != findOneExistingInventoryItemResult.id){
                                    return response.status(200).json({
                                        process: true,
                                        message: "Inventory item already exist"
                                    })
                                }
                                else{
                                    findOneInventoryItemResult.set({
                                        modelId: newModelId,
                                        inventoryItemTypeId: newInventoryItemTypeId,
                                        description: newDescription,
                                        serialNumber: newSerialNumber,
                                        quantity: newQunatity,
                                        price: newPrice,
                                        quantityThreshold: newQunatityThreshold,
                                        image: newImage
                                    });
                                    findOneInventoryItemResult.save()
                                    .then((saveResult) => {
                                        return response.status(200).json({
                                            process: true,
                                            message: "Inventory item was updated",
                                            data: saveResult
                                        })
                                    })
                                    .catch((saveError) => {
                                        return response.status(500).json({
                                            process: false,
                                            message: saveError.message,
                                            level: 5
                                        })
                                    })
                                }
                            })
                            .catch((findOneExistingInventoryItemError) => {
                                return response.status(500).json({
                                    process: false,
                                    message: findOneExistingInventoryItemError.message,
                                    level: 4
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
                            message: findOneModelError.message,
                            level: 3
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
                    message: findOneInventoryItemError.message,
                    level: 2
                })
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Inventory item type not found"
            }) 
        }
    })
    .catch((findOneInventoryItemTypeError) => {
        return response.status(500).json({
            process: false,
            message: findOneInventoryItemTypeError.message,
            level: 1
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