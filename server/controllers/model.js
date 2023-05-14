const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
const Manufacturer = require("../models/manufacturer");
const Model = require("../models/model");
const Inventory = require("../models/inventory");
const { response, request } = require("express");

router.post("/createModel", (request,response,next) => {
    const manufacturerId = request.body.manufacturerId;
    const modelName = request.body.modelName;
    Manufacturer.findOne({where: {id:manufacturerId}})
    .then((findOneManufacturerResult) => {
        if(findOneManufacturerResult){
            Model.findOne({
                where: {
                    manufacturerId: manufacturerId,
                    name: modelName
                }
            })
            .then((findOneModelResult) => {
                if (findOneModelResult){
                    return response.status(200).json({
                        process: true,
                        message: "Model name already exist"
                    })
                }
                else{
                    Model.create({
                        manufacturerId: manufacturerId,
                        name: modelName
                    })
                    .then((newModelEntry) => {
                        return response.status(200).json({
                            process: true,
                            message: "New model entry was created",
                            data: newModelEntry
                        })
                    })
                    .catch((saveToDbError) => {
                        return response.status(500).json({
                            process: false,
                            message: saveToDbError.message,
                            level: 3
                        })
                    })
                }
            })
            .catch((findOneModelError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneModelError.message,
                    level: 2
                })
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
            message: findOneManufacturerError.message,
            level: 1
        })
    })
})

router.get("/getAllModels", (request,response,next) => {
    Model.findAll()
    .then((findAllModelsResult) => {
        if(findAllModelsResult){
            return response.status(200).json({
                process: true,
                message: `Found ${findAllModelsResult.length} model/s`,
                data: findAllModelsResult
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Found 0 models"
            })
        }
    })
    .catch((findAllModelsError) => {
        return response.status(500).json({
            process: false,
            message: findAllModelsError.message
        })
    })
})

router.get("/getModelById", (request,response,next) => {
    const id = request.body.id;
    Model.findOne({where: {id:id}})
    .then((findOneModelResult) => {
        if(findOneModelResult){
            return response.status(200).json({
                process: true,
                message: "Model found",
                data: findOneModelResult
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Model not found"
            })
        }
    })
    .catch((findOneModelError) => {
        return response.status(500).json({
            process: false,
            message: findOneModelError.message
        })
    })
})

router.post("/editModel", (request,response,next) => {
    const id = request.body.id;
    const newManufacturerId = request.body.newManufacturerId;
    const newModelName = request.body.newModelName;
    Model.findOne({where: {id:id}})
    .then((findOneModelResult) => {
        if(findOneModelResult){
            console.log(`${newManufacturerId}->${findOneModelResult.manufacturerId}`)
            console.log(`${newModelName}->${findOneModelResult.name}`)
            if(newManufacturerId == findOneModelResult.manufacturerId && newModelName.toLowerCase() == findOneModelResult.name.toLowerCase()){
                return response.status(200).json({
                    process: true,
                    message: "New model details are the same as current details"
                })
            }
            else{
                Manufacturer.findOne({where: {id:newManufacturerId}})
                .then((findOneManufacturerResult) => {
                    if(findOneManufacturerResult){
                        console.log(findOneModelResult)
                        console.log(newManufacturerId)
                        console.log(newModelName)
                        findOneModelResult.set({
                            manufacturerId: newManufacturerId,
                            name: newModelName
                        });
                        console.log(findOneModelResult)
                        findOneModelResult.save()
                        .then((saveResult) => {
                            return response.status(200).json({
                                process: true,
                                message: "Model updated",
                                data: saveResult
                            })
                        })
                        .catch((saveError) => {
                            return response.status(500).json({
                                process: false,
                                message: saveError.message,
                                level: 3
                            })
                        })
                    }
                    else{
                        return response.status(200).json({
                            process: true,
                            message: "New manufaturer not found"
                        })
                    }
                })
                .catch((findOneManufacturerError) => {
                    return response.status(500).json({
                        process: false,
                        message: findOneManufacturerError.message,
                        level: 2
                    })
                })
            }
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Model not found"
            })
        }
    })
    .catch((findOneModelError) => {
        return response.status(500).json({
            process: false,
            message: findOneModelError.message,
            level: 1
        })
    })
})

router.post("/deleteModel", (request,response,next) => {
    const id = request.body.id;
    Model.findOne({where: {id:id}})
    .then((findOneModelResult) => {
        if(findOneModelResult){
            findOneModelResult.destroy()
            .then(() => {
                return response.status(200).json({
                    process: true,
                    message: "Model deleted"
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
                message: "Model not found"
            })
        }
    })
    .catch((findOneModelError) => {
        return response.status(500).json({
            process: false,
            message: findOneModelError.message
        })
    })
})

module.exports = router;