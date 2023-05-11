const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
const FixType = require("../models/fixType");
const { response, request } = require("express");

router.post("/createFixType", (request,response,next) => {
    const fixTypeDescription = request.body.fixTypeDescription;
    FixType.findOne({where: {description:fixTypeDescription}})
    .then((findOneFixTypeResult) => {
        if(findOneFixTypeResult){
            return response.status(200).json({
                process: true,
                message: "Fix type already exists"
            })
        }
        else{
            FixType.create({
                description: fixTypeDescription
            })
            .then((createFixTypeResult) => {
                return response.status(200).json({
                    process: true,
                    message: "New fix type created",
                    data: createFixTypeResult
                })
            })
            .catch((createFixTypeError) => {
                return response.status(500).json({
                    process: false,
                    message: createFixTypeError.message
                })
            })
        }
    })
    .catch((findOneFixTypeError) => {
        return response.status(500).json({
            process: false,
            message: findOneFixTypeError.message
        })
    })
})

router.post("/editFixType", (request,response,next) => {
    const id = request.body.id;
    const newFixTypeDescription = request.body.newFixTypeDescription;
    FixType.findOne({where: {id:id}})
    .then((findOneFixTypeResult) => {
        if(findOneFixTypeResult){
            FixType.findOne({where: {description:newFixTypeDescription}})
            .then((findOneFixTypeByDescriptionResult) => {
                if(findOneFixTypeByDescriptionResult){
                    return response.status(200).json({
                        process: true,
                        message: "Fix type already exist"
                    })
                }
                else{
                    findOneFixTypeResult.set({
                        description: newFixTypeDescription
                    })
                    findOneFixTypeResult.save()
                    .then((saveFixTypeResult) => {
                        return response.status(200).json({
                            process: true,
                            message: "Fix type changes saved",
                            data: saveFixTypeResult
                        })
                    })
                    .catch((saveFixTypeError) => {
                        return response.status(500).json({
                            process: false,
                            message: saveFixTypeError.message
                        })
                    })
                }
            })
            .catch((findOneFixTypeByDescriptionError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneFixTypeByDescriptionError.message
                })
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
            message: findOneFixTypeError.message
        })
    })
})

router.get("/getAllFixType", (request,response,next) => {
    FixType.findAll()
    .then((findAllFixTypeResult) => {
        return response.status(200).json({
            process: true,
            message: `Found ${findAllFixTypeResult.length} fix type/s`,
            data: findAllFixTypeResult
        })
    })
    .catch((findAllFixTypeError) => {
        return response.status(500).json({
            process: false,
            message: findAllFixTypeError.message
        })
    })
})

router.get("/getFixTypeById", (request,response,next) => {
    const id = request.body.id;
    FixType.findOne({where: {id:id}})
    .then((findOneFixTypeResult) => {
        if(findOneFixTypeResult){
            return response.status(200).json({
                process: true,
                message: "Fix type found",
                data: findOneFixTypeResult
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
            message: findOneFixTypeError.message
        })
    })
})

router.post("/deleteFixType", (request,response,next) => {
    const id = request.body.id;
    FixType.findOne({where: {id:id}})
    .then((findOneFixTypeResult) => {
        if(findOneFixTypeResult){
            findOneFixTypeResult.destroy()
            .then(() => {
                return response.status(200).json({
                    process: true,
                    message: "Fix type deleted"
                })
            })
            .catch((destroyFixTypeError) => {
                return response.status(500).json({
                    process: false,
                    message: destroyFixTypeError.message
                })
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
            message: findOneFixTypeError.message
        })
    })
})

module.exports = router;