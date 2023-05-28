const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
const FixCallDetail = require("../models/fixCallDetail");
const Inventory = require("../models/inventory")
const InventoryItemType = require("../models/inventoryItemType");
const FixCallDetailInventory = require("../models/fixCallDetailInventory");
const { response, request } = require("express");
const nodemon = require("nodemon");

router.post("/createFixCallDetailInventoryItem", (request,response,next) => {
    const fixCallDetailId = request.body.fixCallDetailId;
    const inventoryId = request.body.inventoryId;
    const quantity = request.body.quantity;
    FixCallDetail.findOne({where: {id:fixCallDetailId}})
    .then((findOneFixCallDetailResult) => {
        if(findOneFixCallDetailResult){
            Inventory.findOne({where: {id:inventoryId}})
            .then((findOneInventoryItemResult) => {
                if(findOneInventoryItemResult){
                    InventoryItemType.findOne({where: {id:findOneInventoryItemResult.inventoryItemTypeId}})
                    .then((findOneInventoryItemTypeResult) => {
                        if(findOneInventoryItemTypeResult){
                            if(findOneInventoryItemTypeResult.name.toLowerCase() != "part"){
                                return response.status(200).json({
                                    process: true,
                                    message: "Inventory item type must be `Part`"
                                })
                            }
                            if(quantity < 1){
                                return response.status(200).json({
                                    process: true,
                                    message: "Quantity can't be less than 1"
                                })
                            }
                            FixCallDetailInventory.create({
                                fixCallDetailId: fixCallDetailId,
                                inventoryId: inventoryId,
                                quantity: quantity
                            })
                            .then((createResult) => {
                                return response.status(200).json({
                                    process: true,
                                    message: "Fix call detail inventory item created",
                                    data: createResult
                                })
                            })
                            .catch((createError) => {
                                return response.status(500).json({
                                    process: false,
                                    message: createError.message,
                                    level: 4
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
                message: "Fix call detail not found"
            })
        }
    })
    .catch((findOneFixCallDetailError) => {
        return response.status(500).json({
            process: false,
            message: findOneFixCallDetailError.message,
            level: 1
        })
    })
});

router.post("/editFixCallDetailInventoryItem", (request,response,next) => {
    const id = request.body.id;
    const newFixCallDetailId = request.body.newFixCallDetailId;
    const newInventoryId = request.body.newInventoryId;
    const newQuantity = request.body.newQuantity;
    FixCallDetailInventory.findOne({where: {id:id}})
    .then((findOneFixCallDetailInventoryItemResult) => {
        if(findOneFixCallDetailInventoryItemResult){
            FixCallDetail.findOne({where: {id:newFixCallDetailId}})
            .then((findOneFixCallDetailResult) => {
                if(findOneFixCallDetailResult){
                    Inventory.findOne({where: {id:newInventoryId}})
                    .then((findOneInventoryItemResult) => {
                        if(findOneInventoryItemResult){
                            InventoryItemType.findOne({where: {id:findOneInventoryItemResult.inventoryItemTypeId}})
                            .then((findOneInventoryItemTypeResult) => {
                                if(findOneInventoryItemTypeResult){
                                    if(findOneInventoryItemTypeResult.name.toLowerCase() != "part"){
                                        return response.status(200).json({
                                            process: true,
                                            message: "Inventory item type must be `Part`"
                                        })
                                    }
                                    if(newQuantity < 1){
                                        return response.status(200).json({
                                            process: true,
                                            message: "Quantity can't be lower than 1"
                                        })
                                    }
                                    findOneFixCallDetailInventoryItemResult.set({
                                        fixCallDetailId: newFixCallDetailId,
                                        inventoryId: newInventoryId,
                                        quantity: newQuantity
                                    })
                                    findOneFixCallDetailInventoryItemResult.save()
                                    .then((saveResult) => {
                                        return response.status(200).json({
                                            process: true,
                                            message: "Fix call detail invetory item updated",
                                            data: saveResult
                                        })
                                    })
                                    .catch((saveError) => {
                                        return response.status(500).json({
                                            process: false,
                                            message: saveError.message,
                                            level: 4
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
                            level: 3
                        })
                    })
                }
                else{
                    return response.status(200).json({
                        process: true,
                        message: "Fix call detail not found"
                    })
                }
            })
            .catch((findOneFixCallDetailError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneFixCallDetailError.message,
                    level: 2
                })
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Fix call detail inventory item not found"
            })
        }
    })
    .catch((findOneFixCallDetailInventoryItemError) => {
        return response.status(500).json({
            process: false,
            message: findOneFixCallDetailInventoryItemError.message,
            level: 1
        })
    })
});

router.get("/getAllFixCallDetailInventoryItems", (request,response,next) => {
    FixCallDetailInventory.findAll()
    .then((findAllFixCallDetailInventoryItemsResult) => {
        return response.status(200).json({
            process: true,
            message: `Found ${findAllFixCallDetailInventoryItemsResult.length} fix call detail inventory item/s`,
            data: findAllFixCallDetailInventoryItemsResult
        })
    })
    .catch((findAllFixCallDetailInventoryItemsError) => {
        return response.status(500).json({
            process: false,
            message: findAllFixCallDetailInventoryItemsError.message,
            level: 1
        })
    })
});

router.get("/getFixCallDetailInventoryItemById", (request,response,next) => {
    const id = request.body.id;
    FixCallDetailInventory.findOne({where: {id:id}})
    .then((findOneFixCallDetailInventoryItemResult) => {
        if(findOneFixCallDetailInventoryItemResult){
            return response.status(200).json({
                process: true,
                message: "Fix call detail inventory item found",
                data: findOneFixCallDetailInventoryItemResult
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Fix call detail inventory item not found"
            })
        }
    })
    .catch((findOneFixCallDetailInventoryItemError) => {
        return response.status(500).json({
            process: false,
            message: findOneFixCallDetailInventoryItemError.message,
            level: 1
        })
    })
});

router.post("/deleteFixCallDetailInventoryItem", (request,response,next) => {
    const id = request.body.id;
    FixCallDetailInventory.findOne({where: {id:id}})
    .then((findOneFixCallDetailInventoryItemResult) => {
        if(findOneFixCallDetailInventoryItemResult){
            findOneFixCallDetailInventoryItemResult.destroy()
            .then(() => {
                return response.status(200).json({
                    process: true,
                    message: "Fix call detail inventory item deleted"
                })
            })
            .catch((destroyError) => {
                return response.status(500).json({
                    process: false,
                    message: destroyError.message,
                    level: 2
                })
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Fix call detail inventory item not found"
            })
        }
    })
    .catch((findOneFixCallDetailInventoryItemError) => {
        return response.status(500).json({
            process: false,
            message: findOneFixCallDetailInventoryItemError.message,
            level: 1
        })
    })
});

module.exports = router;