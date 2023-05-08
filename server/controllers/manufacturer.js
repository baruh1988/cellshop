const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
const Manufacturer = require("../models/manufacturer");
const Model = require("../models/model");
const Inventory = require("../models/inventory");
const { response, request } = require("express");

router.post("/addManufacturer", (request,response,next) => {
    const manufacturerName = request.body.manufacturerName;
    Manufacturer.findOne({where: {name:manufacturerName}})
    .then((findOneManufacturerResult) => {
        if(findOneManufacturerResult) {
            return response.status(200).json({
                process: true,
                message: "Manufacturer already exist"
            })
        }
        else{
            Manufacturer.create({
                name: manufacturerName
            })
            .then((createManufacturResult) => {
                return response.status(200).json({
                    process: true,
                    message: "New manufacturer created",
                    data: createManufacturResult
                })
            })
            .catch((createManufacturerError) => {
                return response.status(500).json({
                    process: false,
                    message: createManufacturerError.message
                })
            })
        }
    })
    .catch((findOneManufacturerError) => {
        return response.status(500).json({
            process: false,
            message: `findOneManufacturerError ${findOneManufacturerError.message}`
        })
    })
})

router.get("/getAllManufacturers", (request,response,next) => {
    Manufacturer.findAll()
    .then((findAllManufacturerResult) => {
        if(findAllManufacturerResult){
            return response.status(200).json({
                process: true,
                message: `Found ${findAllManufacturerResult.length} manufacturer/s`,
                data: findAllManufacturerResult
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Found 0 manufacturers"
            })
        }
    })
    .catch((findAllManufacturerError) => {
        return response.status(500).json({
            process: false,
            message: findAllManufacturerError.message
        })
    })
})

router.get('/getManufacturerById', (request,response,next) => {
    const id = request.body.id;
    Manufacturer.findOne({where: {id:id}})
    .then((findOneManufacturerResult) => {
        if(findOneManufacturerResult){
            return response.status(200).json({
                process: true,
                message: "Manufacturer found",
                data: findOneManufacturerResult
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Manufacturer not found"
            })
        }
    })
    .catch((findOneManufacturerError) => {
        return response.status(500).json({
            process: false,
            message: findOneManufacturerError.message
        })
    })
})

router.post("/editManufacturer", (request,response,next) => {
    const id = request.body.id;
    const newManufacturerName = request.body.newManufacturerName;
    Manufacturer.findOne({where: {id: id}})
    .then((findOneManufacturerResult) => {
        if(findOneManufacturerResult){
            if(findOneManufacturerResult.name == newManufacturerName){
                return response.status(200).json({
                    process: true,
                    message: "New name matches old name"
                })
            }
            else{
                Manufacturer.findOne({where: {name:newManufacturerName}})
                .then((findOneNewManufacturerResult) => {
                    if(findOneNewManufacturerResult){
                        return response.status(200).json({
                            process: true,
                            message: "Manfuacturer name already exist"
                        })
                    }
                    else{
                        findOneManufacturerResult.name = newManufacturerName;
                        findOneManufacturerResult.save()
                        .then((saveToDbResult) => {
                            return response.status(200).json({
                                process: true,
                                message: "Manufacturer name change was saved",
                                data: saveToDbResult
                            })
                        })
                        .catch((saveToDbError) => {
                            return response.status(500).json({
                                process: false,
                                message: `saveToDbError: ${saveToDbError.message}`
                            })
                        })
                    }
                })
                .catch((findOneNewManufacturerError) => {
                    return response.status(500).json({
                        process: false,
                        message: `findOneNewManufacturerError: ${findOneNewManufacturerError.message}`
                    })
                })
            }
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Manufacturer not found"
            })
        }
    })
    .catch((findOneManufacturerError) => {
        return response.status(500).json({
            process: false,
            message: `findOneManufacturerError: ${findOneManufacturerError.message}`
        })
    })
})

router.post("/deleteManufacturer", (request,response,next) => {
    const manufacturerName = request.body.manufacturerName;
    Manufacturer.findOne({where: {name: manufacturerName}})
    .then((findOneManufacturerResult) => {
        if(findOneManufacturerResult){
            findOneManufacturerResult.destroy()
            .then(() => {
                return response.status(200).json({
                    process: true,
                    message: "Manufacturer name was deleted"
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
                message: "Manufacturer name was not found"
            })
        }
    })
    .catch((findOneManufacturerError) => {
        return response.status(500).json({
            process: false,
            message: findOneManufacturerError.message
        })
    })
})

module.exports = router;