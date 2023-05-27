const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
const Call = require("../models/call")
const CallType = require("../models/callType");
const NewDevice = require("../models/newDevice")
const FixDevice = require("../models/fixDevice");
const FaultType = require("../models/faultType");
const FixType = require("../models/fixType")
const FixCallDetail = require("../models/fixCallDetail");
const { response, request } = require("express");
const nodemon = require("nodemon");

router.post("/createFixCallDetail", (request,response,next) => {
    const callId = request.body.callId;
    const fixDeviceId = request.body.fixDeviceId;
    const faultTypeId = request.body.faultTypeId;
    const note = request.body.note;
    Call.findOne({where: {id:callId}})
    .then((findOneCallResult) => {
        if(findOneCallResult){
            CallType.findOne({where: {id:findOneCallResult.callTypeId}})
            .then((findOneCallTypeResult) => {
                if(findOneCallTypeResult){
                    if(findOneCallTypeResult.name.toLowerCase() != "fix"){
                        return response.status(200).json({
                            process: true,
                            message: "Call type must be `Fix`"
                        })
                    }
                    if(!findOneCallResult.active){
                        return response.status(200).json({
                            process: true,
                            message: "Call not active"
                        })
                    }
                    FixDevice.findOne({where: {id:fixDeviceId}})
                    .then((findOneFixDeviceResult) => {
                        if(findOneFixDeviceResult){
                            if(findOneFixDeviceResult.inStock){
                                return response.status(200).json({
                                    process: true,
                                    message: "Fix device already in stock"
                                })
                            }
                            FaultType.findOne({where: {id:faultTypeId}})
                            .then((findOneFaultTypeResult) => {
                                if(findOneFaultTypeResult){
                                    FixCallDetail.create({
                                        callId: callId,
                                        fixDeviceId: fixDeviceId,
                                        faultTypeId: faultTypeId,
                                        fixed: false,
                                        fixTypeId: null,
                                        note: note
                                    })
                                    .then((createResult) => {
                                        return response.status(200).json({
                                            process: true,
                                            message: "Fix call detail created",
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
                                        message: "Fault type not found"
                                    })
                                }
                            })
                            .catch((findOneFaultTypeError) => {
                                return response.status(500).json({
                                    process: false,
                                    message: findOneFaultTypeError.message,
                                    level: 4
                                })
                            })
                        }
                        else{
                            return response.status(200).json({
                                process: true,
                                message: "Fix device not found"
                            })
                        }
                    })
                    .catch((findOneFixDeviceError) => {
                        return response.status(500).json({
                            process: false,
                            message: findOneFixDeviceError.message,
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

router.post("/editFixCallDetail", (request,response,next) => {
    const id = request.body.id;
    const newCallId = request.body.newCallId;
    const newFixDeviceId = request.body.newFixDeviceId;
    const newFaultTypeId = request.body.newFaultTypeId;
    const newFixed = request.body.newFixed;
    const newFixTypeId = request.body.newFixTypeId;
    const newNote = request.body.newNote;
    if(typeof(newFixed) != "boolean"){
        return response.status(200).json({
            process: true,
            message: "Invalid `newFixed` value, expected `true`/`false`"
        })
    }
    FixCallDetail.findOne({where: {id:id}})
    .then((findOneFixCallDetailResult) => {
        if(findOneFixCallDetailResult){
            Call.findOne({where: {id:newCallId}})
            .then((findOneCallResult) => {
                if(findOneCallResult){
                    CallType.findOne({where: {id:findOneCallResult.callTypeId}})
                    .then((findOneCallTypeResult) => {
                        if(findOneCallTypeResult){
                            if(findOneCallTypeResult.name.toLowerCase() != "fix"){
                                return response.status(200).json({
                                    process: true,
                                    message: "Call type must be `fix"
                                })
                            }
                            if(!findOneCallResult.active){
                                return response.status(200).json({
                                    process: true,
                                    message: "Call not active"
                                })
                            }
                            FixDevice.findOne({where: {id:newFixDeviceId}})
                            .then((findOneFixDeviceResult) => {
                                if(findOneFixDeviceResult){
                                    if(findOneFixCallDetailResult.fixDeviceId != newFixDeviceId && findOneFixDeviceResult.inStock){
                                        return response.status(200).json({
                                            process: true,
                                            message: "Fix device already in stock"
                                        }) 
                                    }
                                    FaultType.findOne({where: {id:newFaultTypeId}})
                                    .then((findOneFaultTypeResult) => {
                                        if(findOneFaultTypeResult){
                                            FixType.findOne({where: {id:newFixTypeId}})
                                            .then((findOneFixTypeResult) => {
                                                if(newFixTypeId == null  && !newFixed || findOneFixTypeResult && newFixed){
                                                    findOneFixCallDetailResult.set({
                                                        callId: newCallId,
                                                        fixDeviceId: newFixDeviceId,
                                                        faultTypeId: newFaultTypeId,
                                                        fixed: newFixed,
                                                        fixTypeId: newFixTypeId,
                                                        note: newNote
                                                    })
                                                    findOneFixCallDetailResult.save()
                                                    .then((saveResult) => {
                                                        return response.status(200).json({
                                                            process: true,
                                                            message: "Fix call detail updated",
                                                            data: saveResult
                                                        })
                                                    })
                                                    .catch((saveError) => {
                                                        return response.status(500).json({
                                                            process: false,
                                                            message: saveError.message,
                                                            level: 7
                                                        })
                                                    })
                                                }
                                                else if(newFixTypeId == null && newFixed){
                                                    return response.status(200).json({
                                                        process: true,
                                                        message: "Fixed can't be true while fixTypeId is null"
                                                    })
                                                }
                                                else if(findOneFixTypeResult && !newFixed){
                                                    return response.status(200).json({
                                                        process: true,
                                                        message: "Can't update a fix type while fiexd is false"
                                                    })
                                                }
                                                else{
                                                    return response.status(200).json({
                                                        process: true,
                                                        message: "Fix type not found"
                                                    })
                                                }
                                            })
                                            .catch((findOneFixTypeError) => {
                                                return response.status(500).json({
                                                    process: false,
                                                    message: findOneFixTypeError.message,
                                                    level: 6
                                                })
                                            })
                                        }
                                        else{
                                            return response.status(200).json({
                                                process: true,
                                                message: "Fault type not found"
                                            })
                                        }
                                    })
                                    .catch((findOneFaultTypeError) => {
                                        return response.status(500).json({
                                            process: false,
                                            message: findOneFaultTypeError.message,
                                            level: 5
                                        })
                                    })
                                }
                                else{
                                    return response.status(200).json({
                                        process: true,
                                        message: "Fix device not found"
                                    })
                                }
                            })
                            .catch((findOneFixDeviceError) => {
                                return response.status(500).json({
                                    process: false,
                                    message: findOneFixDeviceError.message,
                                    level: 4
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

router.get("/getAllFixCallDetails", (request,response,next) => {
    FixCallDetail.findAll()
    .then((findAllFixCallDetailsResult) => {
        return response.status(200).json({
            process: true,
            message: `Found ${findAllFixCallDetailsResult} fix call detail/s`,
            data: findAllFixCallDetailsResult
        })
    })
    .catch((findAllFixCallDetailsError) => {
        return response.status(500).json({
            process: false,
            message: findAllFixCallDetailsError.message,
            level: 1
        })
    })
});

router.get("/getFixCallDetailById", (request,response,next) => {
    const id = request.body.id;
    FixCallDetail.findOne({where: {id:id}})
    .then((findOneFixCallDetailResult) => {
        if(findOneFixCallDetailResult){
            return response.status(200).json({
                process: true,
                message: "Fix call detail found",
                data: findOneFixCallDetailResult
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

router.post("/deleteFixCallDetail", (request,response,next) => {
    const id = request.body.id;
    FixCallDetail.findOne({where: {id:id}})
    .then((findOneFixCallDetailResult) => {
        if(findOneFixCallDetailResult){
            findOneFixCallDetailResult.destroy()
            .then(() => {
                return response.status(200).json({
                    process: true,
                    message: "Fix call detail deleted"
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

module.exports = router;