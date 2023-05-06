const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
const FaultType = require("../models/faultType");
const { response, request } = require("express");

router.post("/createFaultType", (request,response,next) => {
    const faultTypeDescription = request.body.faultTypeDescription;
    FaultType.findOne({
        where: {
            [Op.iLike]: [{description:faultTypeDescription}]
        }
    })
    .then((findOneFaultTypeResult) => {
        if(findOneFaultTypeResult){
            return response.status(200).json({
                process: true,
                message: "Fault type already exists"
            })
        }
        else{
            FaultType.create({
                description: faultTypeDescription
            })
            .then((createFaultTypeResult) => {
                return response.status(200).json({
                    process: true,
                    message: "New fault type created",
                    data: createFaultTypeResult
                })
            })
            .catch((createFaultTypeError) => {
                return response.status(500).json({
                    process: false,
                    message: createFaultTypeError.message
                })
            })
        }
    })
    .catch((findOneFaultTypeError) => {
        return response.status(500).json({
            process: false,
            message: findOneFaultTypeError.message
        })
    })
})

router.post("/editFaultType", (request,response,next) => {
    const id = request.body.id;
    const newFaultTypeDescription = request.body.newFaultTypeDescription;
    FaultType.findOne({where: {id:id}})
    .then((findOneFaultTypeResult) => {
        if(findOneFaultTypeResult){
            FaultType.findOne({where: {description:newFaultTypeDescription}})
            .then((findOneFaultTypeByDescriptionResult) => {
                if(findOneFaultTypeByDescriptionResult){
                    return response.status(200).json({
                        process: true,
                        message: "Fault type already exist"
                    })
                }
                else{
                    findOneFaultTypeResult.set({
                        description: newFaultTypeDescription
                    })
                    findOneFaultTypeResult.save()
                    .then((saveFaultTypeResult) => {
                        return response.status(200).json({
                            process: true,
                            message: "Fault type changes saved",
                            data: saveFaultTypeResult
                        })
                    })
                    .catch((saveFaultTypeError) => {
                        return response.status(500).json({
                            process: false,
                            message: saveFaultTypeError.message
                        })
                    })
                }
            })
            .catch((findOneFaultTypeByDescriptionError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneFaultTypeByDescriptionError.message
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
            message: findOneFaultTypeError.message
        })
    })
})

router.get("/getAllFaultType", (request,response,next) => {
    FaultType.findAll()
    .then((findAllFaultTypeResult) => {
        return response.status(200).json({
            process: true,
            message: `Found ${findAllFaultTypeResult.length} fault type/s`,
            data: findAllFaultTypeResult
        })
    })
    .catch((findAllFaultTypeError) => {
        return response.status(500).json({
            process: false,
            message: findAllFaultTypeError.message
        })
    })
})

router.get("/getFaultTypeById", (request,response,next) => {
    const id = request.body.id;
    FaultType.findOne({where: {id:id}})
    .then((findOneFaultTypeResult) => {
        if(findOneFaultTypeResult){
            return response.status(200).json({
                process: true,
                message: "Fault type found",
                data: findOneFaultTypeResult
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
            message: findOneFaultTypeError.message
        })
    })
})

router.post("/deleteFaultType", (request,response,next) => {
    const id = request.body.id;
    FaultType.findOne({where: {id:id}})
    .then((findOneFaultTypeResult) => {
        if(findOneFaultTypeResult){
            findOneFaultTypeResult.destroy()
            .then(() => {
                return response.status(200).json({
                    process: true,
                    message: "Fault type deleted"
                })
            })
            .catch((destroyFaultTypeError) => {
                return response.status(500).json({
                    process: false,
                    message: destroyFaultTypeError.message
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
            message: findOneFaultTypeError.message
        })
    })
})