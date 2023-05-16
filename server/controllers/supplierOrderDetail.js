const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
const SupplierOrder = require("../models/supplierOrder");
const Inventory = require("../models/inventory");
const SupplierOrderDetail = require("../models/supplierOrderDetail");
const { response, request } = require("express");

router.post("/createSupplierOrderDetail", (request,response,next) => {
    const supplierOrderId = request.body.supplierOrderId;
    const inventoryItemId = request.body.inventoryItemId;
    const quantity = request.body.quantity;
    SupplierOrder.findOne({where: {id:supplierOrderId}})
    .then((findOneSupplierOrderResult) => {
        if(findOneSupplierOrderResult){
            Inventory.findOne({where: {id:inventoryItemId}})
            .then((findOneInventoryItemResult) => {
                if(findOneInventoryItemResult){
                    SupplierOrderDetail.create({
                        supplierOrderId: supplierOrderId,
                        inventoryItemId: inventoryItemId,
                        quantity: quantity,
                        received: false
                    })
                    .then((createResult) => {
                        return response.status(200).json({
                            process: true,
                            message: "Supplier order detail created",
                            data: createResult
                        })
                    })
                    .catch((createError) => {
                        return response.status(500).json({
                            process: false,
                            message: createError.message,
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
                message: "Supplier order not found"
            })
        }
    })
    .catch((findOneSupplierOrderError) => {
        return response.status(500).json({
            process: false,
            message: findOneSupplierOrderError.message,
            level: 1
        })
    })
})

router.get("/getAllSupplierOrderDetails", (request,response,next) => {
    SupplierOrderDetail.findAll()
    .then((findAllSupplierOrderDetailsResult) => {
        return response.status(200).json({
            process: true,
            message: `Found ${findAllSupplierOrderDetailsResult.length} supplier order details`,
            data: findAllSupplierOrderDetailsResult
        })
    })
    .catch((findAllSupplierOrderDetailsError) => {
        return response.status(500).json({
            process: false,
            message: findAllSupplierOrderDetailsError.message,
            level: 1
        })
    })
})

router.get("/getSupplierOrderDetailById", (request,response,next) => {
    const id = request.body.id;
    SupplierOrderDetail.findOne({where: {id:id}})
    .then((findOneSupplierOrderDetailResult) => {
        if(findOneSupplierOrderDetailResult){
            return response.status(200).json({
                process: true,
                message: "Supplier order detail found",
                data: findOneSupplierOrderDetailResult
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Supplier order detail not found"
            })
        }
    })
    .catch((findOneSupplierOrderDetailError) => {
        return response.status(500).json({
            process: false,
            message: findOneSupplierOrderDetailError.message,
            level: 1
        })
    })
})

router.post("/editSupplierOrderDetail", (request,response,next) => {
    const id = request.body.id;
    const newSupplierOrderId = request.body.newSupplierOrderId;
    const newInventoryItemId = request.body.newInventoryItemId;
    const newQuantity = request.body.newQuantity;
    const newReceived = request.body.newReceived;
    SupplierOrderDetail.findOne({where: {id:id}})
    .then((findOneSupplierOrderDetailResult) => {
        if(findOneSupplierOrderDetailResult){
            SupplierOrder.findOne({where: {id:newSupplierOrderId}})
            .then((findOneSupplierOrderResult) => {
                if(findOneSupplierOrderResult){
                    Inventory.findOne({where: {id:newInventoryItemId}})
                    .then((findOneInventoryItemResult) => {
                        if(findOneInventoryItemResult){
                            findOneSupplierOrderDetailResult.set({
                                supplierOrderId: newSupplierOrderId,
                                inventoryItemId: newInventoryItemId,
                                quantity: newQuantity,
                                received: newReceived
                            })
                            findOneSupplierOrderDetailResult.save()
                            .then((saveResult) => {
                                return response.status(200).json({
                                    process: true,
                                    message: "Supplier order detail updated",
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
                        message: "Supplier order not found"
                    })
                }
            })
            .catch((findOneSupplierOrderError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneSupplierOrderError.message,
                    level: 2
                })
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Supplier order detail not found"
            })
        }
    })
    .catch((findOneSupplierOrderDetailError) => {
        return response.status(500).json({
            process: false,
            message: findOneSupplierOrderDetailError.message,
            level: 1
        })
    })
})

router.post("/deleteSupplierOrderDetail", (request,response,next) => {
    const id = request.body.id;
    SupplierOrderDetail.findOne({where: {id:id}})
    .then((findOneSupplierOrderDetailResult) => {
        if(findOneSupplierOrderDetailResult){
            findOneSupplierOrderDetailResult.destroy()
            .then(() => {
                return response.status(200).json({
                    process: true,
                    message: "Supplier order detail deleted"
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
                message: "Supplier order detail not found"
            })
        }
    })
    .catch((findOneSupplierOrderDetailError) => {
        return response.status(500).json({
            process: false,
            message: findOneSupplierOrderDetailError.message,
            level: 1
        })
    })
})

module.exports = router;