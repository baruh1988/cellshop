const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
const CallType = require("../models/callType");
const { response, request } = require("express");

router.post("/createCallType", (request,response,next) => {
    const callTypeName = request.body.callTypeName;
    const callTypeDescription = request.body.callTypeDescription;
    CallType.findOne({
        where: {
            [Op.iLike]: [{name:callTypeName}]
        }
    })
    .then((findOneCallTypeResult) => {
        if(findOneCallTypeResult){
            return response.status(200).json({
                process: true,
                message: "Call type already exists"
            })
        }
        else{
            CallType.create({
                name: callTypeName,
                description: callTypeDescription
            })
            .then((createCallTypeResult) => {
                return response.status(200).json({
                    process: true,
                    message: "New call type created",
                    data: createCallTypeResult
                })
            })
            .catch((createCallTypeError) => {
                return response.status(500).json({
                    process: false,
                    message: createCallTypeError.message
                })
            })
        }
    })
    .catch((findOneCallTypeError) => {
        return response.status(500).json({
            process: false,
            message: findOneCallTypeError.message
        })
    })
})

router.post("/editCallType", (request,response,next) => {
    const id = request.body.id;
    const newCallTypeName = request.body.newCallTypeName;
    const newCallTypeDescription = request.body.newCallTypeDescription;
    CallType.findOne({where: {id:id}})
    .then((findOneCallTypeResult) => {
        if(findOneCallTypeResult){
            CallType.findOne({where: {name:newCallTypeName}})
            .then((findOneCallTypeByNameResult) => {
                if(findOneCallTypeByNameResult){
                    return response.status(200).json({
                        process: true,
                        message: "Call type already exist"
                    })
                }
                else{
                    findOneCallTypeResult.set({
                        name: newCallTypeName,
                        description: newCallTypeDescription
                    })
                    findOneCallTypeResult.save()
                    .then((saveCallTypeResult) => {
                        return response.status(200).json({
                            process: true,
                            message: "Call type changes saved",
                            data: saveCallTypeResult
                        })
                    })
                    .catch((saveCallTypeError) => {
                        return response.status(500).json({
                            process: false,
                            message: saveCallTypeError.message
                        })
                    })
                }
            })
            .catch((findOneCallTypeByNameError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneCallTypeByNameError.message
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
            message: findOneCallTypeError.message
        })
    })
})

router.get("/getAllCallType", (request,response,next) => {
    CallType.findAll()
    .then((findAllCallTypeResult) => {
        return response.status(200).json({
            process: true,
            message: `Found ${findAllCallTypeResult.length} call type/s`,
            data: findAllCallTypeResult
        })
    })
    .catch((findAllCallTypeError) => {
        return response.status(500).json({
            process: false,
            message: findAllCallTypeError.message
        })
    })
})

router.get("/getCallTypeById", (request,response,next) => {
    const id = request.body.id;
    CallType.findOne({where: {id:id}})
    .then((findOneCallTypeResult) => {
        if(findOneCallTypeResult){
            return response.status(200).json({
                process: true,
                message: "Call type found",
                data: findOneCallTypeResult
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
            message: findOneCallTypeError.message
        })
    })
})

router.post("/deleteCallType", (request,response,next) => {
    const id = request.body.id;
    CallType.findOne({where: {id:id}})
    .then((findOneCallTypeResult) => {
        if(findOneCallTypeResult){
            findOneCallTypeResult.destroy()
            .then(() => {
                return response.status(200).json({
                    process: true,
                    message: "Call type deleted"
                })
            })
            .catch((destroyCallTypeError) => {
                return response.status(500).json({
                    process: false,
                    message: destroyCallTypeError.message
                })
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "call type not found"
            })
        }
    })
    .catch((findOneCallTypeError) => {
        return response.status(500).json({
            process: false,
            message: findOneCallTypeError.message
        })
    })
})