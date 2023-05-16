const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
const Supplier = require("../models/supplier");
const User = require("../models/user");
const SupplierOrder = require("../models/supplierOrder");
const { response, request } = require("express");

router.post("/createSupplierOrder", (request,response,next) => {
    const supplierId = request.body.supplierId;
    const userId = request.body.userId;
    Supplier.findOne({where: {id:supplierId}})
    .then((findOneSupplierResult) => {
        if(findOneSupplierResult){
            User.findOne({where: {id:userId}})
            .then((findOneUserResult) => {
                if(findOneUserResult){
                    SupplierOrder.create({
                        supplierId: supplierId,
                        userId: userId,
                        isOpen: true
                    })
                    .then((createResult) => {
                        return response.status(200).json({
                            process: true,
                            message: "Supplier order created",
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
                        message: "User not found"
                    })
                }
            })
            .catch((findOneUserError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneUserError.message,
                    level: 2
                })
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Supplier not found"
            })
        }
    })
    .catch((findOneSupplierError) => {
        return response.status(500).json({
            process: false,
            message: findOneSupplierError.message,
            level: 1
        })
    })
})

router.get("/getAllSupplierOrders", (request,response,next) => {
    SupplierOrder.findAll()
    .then((findAllSupplierOrdersResult) => {
        return response.status(200).json({
            process: true,
            message: `Found ${findAllSupplierOrdersResult.length} Supplier orders`,
            data: findAllSupplierOrdersResult
        })
    })
    .catch((findAllSupplierOrdersError) => {
        return response.status(500).json({
            process: false,
            message: findAllSupplierOrdersError.message,
            level: 1
        })
    })
})

router.get("/getSupplierOrderById", (request,response,next) => {
    const id = request.body.id;
    SupplierOrder.findOne({where: {id:id}})
    .then((findOneSupplierOrderResult) => {
        if(findOneSupplierOrderResult){
            return response.status(200).json({
                process: true,
                message: "Supplier order found",
                data: findOneSupplierOrderResult
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

router.post("/editSupplierOrder", (request,response,next) => {
    const id = request.body.id;
    const newSupplierId = request.body.newSupplierId;
    const newUserId = request.body.newUserId;
    const newIsOpen = request.body.newIsOpen;
    SupplierOrder.findOne({where: {id:id}})
    .then((findOneSupplierOrderResult) => {
        if(findOneSupplierOrderResult){
            Supplier.findOne({where: {id:newSupplierId}})
            .then((findOneSupplierResult) => {
                if(findOneSupplierResult){
                    User.findOne({where: {id:newUserId}})
                    .then((findOneUserResult) => {
                        if(findOneUserResult){
                            findOneSupplierOrderResult.set({
                                supplierId: newSupplierId,
                                userId: newUserId,
                                isOpen: newIsOpen
                            })
                            findOneSupplierOrderResult.save()
                            .then((saveResult) => {
                                return response.status(200).json({
                                    process: true,
                                    message: "Supplier order updated",
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
                                message: "User not found"
                            })
                        }
                    })
                    .catch((findOneUserError) => {
                        return response.status(500).json({
                            process: false,
                            message: findOneUserError.message,
                            level: 3
                        })
                    })
                }
                else{
                    return response.status(200).json({
                        process: true,
                        message: "Supplier not found"
                    })
                }
            })
            .catch((findOneSupplierError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneSupplierError.message,
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

router.post("/deleteSupplierOrder", (request,response,next) => {
    const id = request.body.id;
    SupplierOrder.findOne({where: {id:id}})
    .then((findOneSupplierOrderResult) => {
        if(findOneSupplierOrderResult){
            findOneSupplierOrderResult.destroy()
            .then(() => {
                return response.status(200).json({
                    process: true,
                    message: "Supplier order deleted"
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

module.exports = router;