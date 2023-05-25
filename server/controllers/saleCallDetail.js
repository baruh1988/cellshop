const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
const Call = require("../models/call")
const CallType = require("../models/callType");
const Inventory = require("../models/inventory");
const InventoryItemType = require("../models/inventoryItemType");
const NewDevice = require("../models/newDevice");
const SaleCallDetail = require("../models/saleCallDetail");
const { response, request } = require("express");

// function createRecord(callId, inventoryId, newDeviceId, quantity){
//     SaleCallDetail.create({
//         callId: callId,
//         inventoryId: inventoryId,
//         newDeviceId: newDeviceId,
//         quantity: quantity
//     })
//     .then((createResult) => {
//         return response.status(200).json({
//             process: true,
//             message: "Sale call detail created",
//             data: createResult
//         })
//     })
//     .catch((createError) => {
//         return response.status(500).json({
//             process: false,
//             message: createError.message,
//             level: "createRecord"
//         })
//     })
// }

router.post("/createSaleCallDetail", (request,response,next) => {
    const callId = request.body.callId;
    const inventoryId = request.body.inventoryId;
    let newDeviceId = request.body.newDeviceId;
    const quantity = request.body.quantity;
    if(typeof(quantity) != "number"){
        return response.status(200).json({
            process: true,
            message: "Invalid quantity value, expected number"
        })
    }
    else if(quantity < 1){
        return response.status(200).json({
            process: true,
            message: "Qunatity can't be less than 1"
        })
    }
    Call.findOne({where: {id:callId}})
    .then((findOneCallResult) => {
        if(findOneCallResult){
            CallType.findOne({where: {id:findOneCallResult.callTypeId}})
            .then((findOneCallTypeResult) => {
                if(findOneCallTypeResult){
                    if(findOneCallTypeResult.name.toLowerCase() != "sale"){
                        return response.status(200).json({
                            process: true,
                            message: "Call type must be `Sale`"
                        })
                    }
                    if(findOneCallResult.active){
                        Inventory.findOne({where: {id:inventoryId}})
                        .then((findOneInventoryItemResult) => {
                            if(findOneInventoryItemResult){
                                InventoryItemType.findOne({where: {id:findOneInventoryItemResult.inventoryItemTypeId}})
                                .then((findOneInventoryItemTypeResult) => {
                                    if(findOneInventoryItemTypeResult){
                                        if(findOneInventoryItemTypeResult.name.toLowerCase() == "device"){
                                            NewDevice.findOne({where: {id:newDeviceId}})
                                            .then((findOneNewDeviceResult) => {
                                                if(findOneNewDeviceResult){
                                                    if(!findOneNewDeviceResult.inStock){
                                                        return response.status(200).json({
                                                            process: true,
                                                            message: "New device not in stock"
                                                        })
                                                    }
                                                    if(quantity > 1){
                                                        return response.status(200).json({
                                                            process: true,
                                                            message: "New device quantity can't be larger than 1"
                                                        })
                                                    }
                                                    // createRecord(callId, inventoryId, newDeviceId, quantity);
                                                    SaleCallDetail.create({
                                                        callId: callId,
                                                        inventoryId: inventoryId,
                                                        newDeviceId: newDeviceId,
                                                        quantity: quantity
                                                    })
                                                    .then((createResult) => {
                                                        return response.status(200).json({
                                                            process: true,
                                                            message: "Sale call detail created",
                                                            data: createResult
                                                        })
                                                    })
                                                    .catch((createError) => {
                                                        return response.status(500).json({
                                                            process: false,
                                                            message: createError.message,
                                                            level: 5
                                                        })
                                                    })
                                                }
                                                else{
                                                    return response.status(200).json({
                                                        process: true,
                                                        message: "New device not found"
                                                    })
                                                }
                                            })
                                            .catch((findOneNewDeviceError) => {
                                                return response.status(500).json({
                                                    process: false,
                                                    message: findOneNewDeviceError.message,
                                                    level: 5.1
                                                })
                                            })
                                        }
                                        else{
                                            newDeviceId = null
                                            // createRecord(callId, inventoryId, newDeviceId, quantity);
                                            SaleCallDetail.create({
                                                callId: callId,
                                                inventoryId: inventoryId,
                                                newDeviceId: newDeviceId,
                                                quantity: quantity
                                            })
                                            .then((createResult) => {
                                                return response.status(200).json({
                                                    process: true,
                                                    message: "Sale call detail created",
                                                    data: createResult
                                                })
                                            })
                                            .catch((createError) => {
                                                return response.status(500).json({
                                                    process: false,
                                                    message: createError.message,
                                                    level: 5
                                                })
                                            })
                                        }
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
                                        level: 4
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
                            message: "Call not active"
                        })
                    }
                }
                else{
                    return response.status(200).json({
                        process: true,
                        message: "Call type not found"
                    })
                }
            })
            .catch((findOneCallTypeError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneCallTypeError.message,
                    level: 2
                })
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Call not found"
            })
        }
    })
    .catch((findOneCallError) => {
        return response.status(500).json({
            process: false,
            message: findOneCallError.message,
            level: 1
        })
    })
});

router.post("/editSaleCallDetail", (request,response,next) => {
    const id = request.body.id;
    const newCallId = request.body.newCallId;
    const newInventoryId = request.body.newInventoryId;
    let newNewDeviceId = request.body.newNewDeviceId;
    const newQuantity = request.body.newQuantity;
    SaleCallDetail.findOne({where: {id:id}})
    .then((findOneSaleCallDetailResult) => {
        if(findOneSaleCallDetailResult){
            if(typeof(newQuantity) != "number"){
                return response.status(200).json({
                    process: true,
                    message: "Invalid quantity value, expected number"
                })
            }
            else if(newQuantity < 1){
                return response.status(200).json({
                    process: true,
                    message: "Qunatity can't be less than 1"
                })
            }
            Call.findOne({where: {id:newCallId}})
            .then((findOneCallResult) => {
                if(findOneCallResult){
                    CallType.findOne({where: {id:findOneCallResult.callTypeId}})
                    .then((findOneCallTypeResult) => {
                        if(findOneCallTypeResult){
                            if(findOneCallTypeResult.name.toLowerCase() != "sale"){
                                return response.status(200).json({
                                    process: true,
                                    message: "Call type must be `Sale`"
                                })
                            }
                            if(findOneCallResult.active){
                                Inventory.findOne({where: {id:newInventoryId}})
                                .then((findOneInventoryItemResult) => {
                                    if(findOneInventoryItemResult){
                                        InventoryItemType.findOne({where: {id:findOneInventoryItemResult.inventoryItemTypeId}})
                                        .then((findOneInventoryItemTypeResult) => {
                                            if(findOneInventoryItemTypeResult){
                                                if(findOneInventoryItemTypeResult.name.toLowerCase() == "device"){
                                                    NewDevice.findOne({where: {id:newNewDeviceId}})
                                                    .then((findOneNewDeviceResult) => {
                                                        if(findOneNewDeviceResult){
                                                            if(!findOneNewDeviceResult.inStock){
                                                                return response.status(200).json({
                                                                    process: true,
                                                                    message: "New device not in stock"
                                                                })
                                                            }
                                                            if(newQuantity > 1){
                                                                return response.status(200).json({
                                                                    process: true,
                                                                    message: "New device quantity can't be larger than 1"
                                                                })
                                                            }
                                                            findOneSaleCallDetailResult.set({
                                                                callId: newCallId,
                                                                inventoryId: newInventoryId,
                                                                newDeviceId: newNewDeviceId,
                                                                quantity: newQuantity
                                                            })
                                                            findOneSaleCallDetailResult.save()
                                                            .then((saveResult) => {
                                                                return response.status(200).json({
                                                                    process: true,
                                                                    message: "Sale call detail updated",
                                                                    data: saveResult
                                                                })
                                                            })
                                                            .catch((saveError) => {
                                                                return response.status(500).json({
                                                                    process: false,
                                                                    message: saveError.message,
                                                                    level: 6
                                                                })
                                                            })
                                                        }
                                                        else{
                                                            return response.status(200).json({
                                                                process: true,
                                                                message: "New device not found"
                                                            })
                                                        }
                                                    })
                                                    .catch((findOneNewDeviceError) => {
                                                        return response.status(500).json({
                                                            process: false,
                                                            message: findOneNewDeviceError.message,
                                                            level: 6.1
                                                        })
                                                    })
                                                }
                                                else{
                                                    newNewDeviceId = null;
                                                    findOneSaleCallDetailResult.set({
                                                        callId: newCallId,
                                                        inventoryId: newInventoryId,
                                                        newDeviceId: newNewDeviceId,
                                                        quantity: newQuantity
                                                    })
                                                    findOneSaleCallDetailResult.save()
                                                    .then((saveResult) => {
                                                        return response.status(200).json({
                                                            process: true,
                                                            message: "Sale call detail updated",
                                                            data: saveResult
                                                        })
                                                    })
                                                    .catch((saveError) => {
                                                        return response.status(500).json({
                                                            process: false,
                                                            message: saveError.message,
                                                            level: 6
                                                        })
                                                    })
                                                }
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
                                                level: 5
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
                                        level: 4
                                    })
                                })
                            }
                            else{
                                return response.status(200).json({
                                    process: true,
                                    message: "Call not active"
                                })
                            }
                        }
                        else{
                            return response.status(200).json({
                                process: true,
                                message: "Call type not found"
                            })
                        }
                    })
                    .catch((findOneCallTypeError) => {
                        return response.status(500).json({
                            process: false,
                            message: findOneCallTypeError.message,
                            level: 3
                        })
                    })
                }
                else{
                    return response.status(200).json({
                        process: true,
                        message: "Call not found"
                    })
                }
            })
            .catch((findOneCallError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneCallError.message,
                    level: 2
                })
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Sale call detail not found"
            })
        }
    })
    .catch((findOneSaleCallDetailError) => {
        return response.status(500).json({
            process: false,
            message: findOneSaleCallDetailError.message,
            level: 1
        })
    })
});

router.get("/getAllSaleCallDetails", (request,response,next) => {
    SaleCallDetail.findAll()
    .then((findAllSaleCallDetailsResult) => {
        return response.status(200).json({
            process: true,
            message: `Found ${findAllSaleCallDetailsResult.length} sale call detail/s`,
            data: findAllSaleCallDetailsResult
        })
    })
    .catch((findAllSaleCallDetailsError) => {
        return response.status(500).json({
            process: false,
            message: findAllSaleCallDetailsError.message,
            level: 1
        })
    })
});

router.get("/getSaleCallDetailById", (request,response,next) => {
    const id = request.body.id;
    SaleCallDetail.findOne({where: {id:id}})
    .then((findOneSaleCallDetailResult) => {
        if(findOneSaleCallDetailResult){
            return response.status(200).json({
                process: true,
                message: "Sale call detail found",
                data: findOneSaleCallDetailResult
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Sale call detail not found"
            })
        }
    })
    .catch((findOneSaleCallDetailError) => {
        return response.status(500).json({
            process: false,
            message: findOneSaleCallDetailError.message,
            level: 1
        })
    })
});

router.post("/deleteSaleCallDetail", (request,response,next) => {
    const id = request.body.id;
    SaleCallDetail.findOne({where: {id:id}})
    .then((findOneSaleCallDetailResult) => {
        if(findOneSaleCallDetailResult){
            findOneSaleCallDetailResult.destroy()
            .then(() => {
                return response.status(200).json({
                    process: true,
                    message: "Sale call detail deleted"
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
                message: "Sale call detail not found"
            })
        }
    })
    .catch((findOneSaleCallDetailError) => {
        return response.status(500).json({
            process: false,
            message: findOneSaleCallDetailError.message,
            level: 1
        })
    })
});

module.exports = router;