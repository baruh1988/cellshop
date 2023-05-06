const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
const Manufacturer = require("../models/manufacturer");
const Model = require("../models/model");
const Inventory = require("../models/inventory");
const { response, request } = require("express");

router.post("/addModel", (request,response,next) => {
    const manufacturerName = request.body.manufacturerName;
    const modelName = request.body.modelName;
    Manufacturer.findOne({where: {name: manufacturerName}})
    .then((findOneManufacturerResult) => {
        if(findOneManufacturerResult){
            Model.findOne({
                where: {
                    manufacturerId: findOneManufacturerResult.id,
                    [Op.iLike]: [{name: modelName}]
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
                        manufacturerId: findOneManufacturerResult.id,
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
                            message: saveToDbError.message
                        })
                    })
                }
            })
            .catch((findOneModelError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneModelError.message
                })
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Manufacturer name does not exist"
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
    const manufacturerName = request.body.manufacturerName;
    const modelName = request.body.modelName;
    const modelNewName = request.body.modelNewName;
    Manufacturer.findOne({where: {name: manufacturerName}})
    .then((findOneManufacturerResult) => {
        if(findOneManufacturerResult){
            Model.findOne({where: {
                manufacturerId: findOneManufacturerResult.id,
                name: modelName
            }})
            .then((findOneModelResult) => {
                if(findOneModelResult){
                    Model.findOne({where: {
                        manufacturerId: findOneManufacturerResult.id,
                        [Op.iLike]: [{name: modelNewName}]
                    }})
                    .then((findOneNewModelResult) => {
                        if(findOneNewModelResult){
                            return response.status(200).json({
                                process: true,
                                message: "Model name already exist"
                            })
                        }
                        else{
                            findOneModelResult.name = modelNewName;
                            findOneModelResult.save()
                            .then((saveToDbResult) => {
                                return response.status(200).json({
                                    process: true,
                                    message: "Model name change was saved",
                                    data: saveToDbResult
                                })
                            })
                            .catch((saveToDbError) => {
                                return response.status(500).json({
                                    process: false,
                                    message: saveToDbError.message
                                })
                            })
                        }
                    })
                    .catch((findOneNewModelError) => {
                        return response.status(500).json({
                            process: false,
                            message: findOneNewModelError.message
                        })
                    })
                }
                else{
                    return response.status(200).json({
                        process: true,
                        message: "Model name was not found"
                    })
                }
            })
            .catch((findOneModelError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneModelError.message
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

router.post("/deleteModel", (request,response,next) => {
    const manufacturerName = request.body.manufacturerName;
    const modelName = request.body.modelName;
    Manufacturer.findO({where: {name: manufacturerName}})
    .then((findOneManufacturerResult) => {
        if(findOneManufacturerResult){
            Model.findOne({where: {
                manufacturerId: findOneManufacturerResult.id,
                name: modelName
            }})
            .then((findOneModelResult) => {
                if(findOneModelResult){
                    findOneModelResult.destroy()
                    .then(() => {
                        return response.status(200).json({
                            process: true,
                            message: "Model name was deleted"
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
                        message: "Model name was not found"
                    })
                }
            })
            .catch((findOneModelError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneModelError.message
                })
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Manufactrer name was not found"
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