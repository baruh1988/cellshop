const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
const CallType = require("../models/callType");
const Customer = require("../models/customer");
const User = require("../models/user");
const Call = require("../models/call");
const { response, request } = require("express");

router.post("/createCall", (request,response,next) => {
    const callTypeId = request.body.callTypeId;
    const customerId = request.body.customerId;
    const userId = request.body.userId;
    const note = request.body.note;
    CallType.findOne({where: {id:callTypeId}})
    .then((findOneCallTypeResult) => {
        if(findOneCallTypeResult){
            Customer.findOne({where: {id:customerId}})
            .then((findOneCustomerResult) => {
                if(findOneCustomerResult){
                    User.findOne({where: {id:userId}})
                    .then((findOneUserResult) => {
                        if(findOneUserResult){
                            Call.create({
                                callTypeId: callTypeId,
                                customerId: customerId,
                                userId: userId,
                                active: true,
                                note: note
                            })
                            .then((createResult) => {
                                return response.status(200).json({
                                    process: true,
                                    message: "Call created",
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
                        message: "Customer not found"
                    })
                }
            })
            .catch((findOneCustomerError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneCustomerError.message,
                    level: 2
                })
            })
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
            level: 1
        })
    })
});

router.post("/editCall", (request,response,next) => {
    const id = request.body.id;
    const newCallTypeId = request.body.newCallTypeId;
    const newCustomerId = request.body.newCustomerId;
    const newUserId = request.body.newUserId;
    const newActive = request.body.newActive;
    const newNote = request.body.newNote;
    if(typeof(newActive) != "boolean"){
        return response.status(200).json({
            process: true,
            message: "Invalid active value, expected `true`/`false`"
        })
    }
    Call.findOne({where: {id:id}})
    .then((findOneCallResult) => {
        if(findOneCallResult){
            CallType.findOne({where: {id:newCallTypeId}})
            .then((findOneCallTypeResult) => {
                if(findOneCallTypeResult){
                    Customer.findOne({where: {id:newCustomerId}})
                    .then((findOneCustomerResult) => {
                        if(findOneCustomerResult){
                            User.findOne({where: {id:newUserId}})
                            .then((findOneUserResult) => {
                                if(findOneUserResult){
                                    findOneCallResult.set({
                                        callTypeId: newCallTypeId,
                                        customerId: newCustomerId,
                                        userId: newUserId,
                                        active: newActive,
                                        note: newNote
                                    })
                                    findOneCallResult.save()
                                    .then((saveResult) => {
                                        return response.status(200).json({
                                            process: true,
                                            message: "Call updated",
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
                                    level: 4
                                })
                            })
                        }
                        else{
                            return response.status(200).json({
                                process: true,
                                message: "Customer not found"
                            })
                        }
                    })
                    .catch((findOneCustomerError) => {
                        return response.status(500).json({
                            process: false,
                            message: findOneCustomerError.message,
                            level: 3
                        })
                    })
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

router.get("/getAllCalls", (request,response,next) => {
    Call.findAll()
    .then((findAllCallsResult) => {
        return response.status(200).json({
            process: true,
            message: `Found ${findAllCallsResult.length} call/s`,
            data: findAllCallsResult
        })
    })
    .catch((findAllCallsError) => {
        return response.status(500).json({
            process: false,
            message: findAllCallsError.message,
            level: 1
        })
    })
});

router.get("/getCallById", (request,response,next) => {
    const id = request.body.id;
    Call.findOne({where: {id:id}})
    .then((findOneCallResult) => {
        if(findOneCallResult){
            return response.status(200).json({
                process: true,
                message: "Call found",
                data: findOneCallResult
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

router.post("/deleteCall", (request,response,next) => {
    const id = request.body.id;
    Call.findOne({where: {id:id}})
    .then((findOneCallResult) => {
        if(findOneCallResult){
            findOneCallResult.destroy()
            .then(() => {
                return response.status(200).json({
                    process: true,
                    message: "Call deleted"
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

module.exports = router;