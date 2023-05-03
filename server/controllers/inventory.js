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
    Manufacturer.findOne({
        where: {
            [Op.iLike]: [{name: manufacturerName}]
        }
    })
    .then((findOneManufacturerResult) => {
        if(findOneManufacturerResult) {
            return response.status(200).json({
                process: true,
                message: "Manufacturer name exist"
            })
        }
        else{
            Manufacturer.create({
                name: manufacturerName
            })
            .then((createManufacturerEntryResult) => {
                return response.status(200).json({
                    process: true,
                    message: "New manufacturer added",
                    data: createManufacturerEntryResult
                })
            })
            .catch((createManufacturerEntryError) => {
                return response.status(500).json({
                    process: false,
                    message: createManufacturerEntryError.message
                })
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

router.get("/getAllManufacturers", (request,response,next) => {
    Manufacturer.findAll()
    .then((findAllManufacturerResult) => {
        if(findAllManufacturerResult){
            return response.status(200).json({
                process: true,
                message: `${findAllManufacturerResult.length} records were retrieved`,
                data: findAllManufacturerResult
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "0 records were retrieved"
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

router.post("/editManufacturer", (request,response,next) => {
    const manufacturerName = request.body.manufacturerName;
    const newManufacturerName = request.body.newManufacturerName;
    Manufacturer.findOne({where: {name: manufacturerName}})
    .then((findOneManufacturerResult) => {
        if(findOneManufacturerResult){
            Manufacturer.findOne({
                where: {
                    [Op.iLike]: [{name: manufacturerName}]
                }
            })
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
                            message: saveToDbError.message
                        })
                    })
                }
            })
            .catch((findOneNewManufacturerError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneNewManufacturerError.message
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

router.get("/getAllModelsByManufacturer", (request,response,next) => {
    const manufacturerName = request.body.manufacturerName;
    Manufacturer.findOne({where: {name: manufacturerName}})
    .then((findOneManufacturerResult) => {
        if(findOneManufacturerResult){
            Model.findAll({where: {manufacturerId: findOneManufacturerResult.id}})
            .then((findAllModelsResult) => {
                if(findAllModelsResult){
                    return response.status(200).json({
                        process: true,
                        message: `${findAllModelsResult.length} models were found`,
                        data: findAllModelsResult
                    })
                }
                else{
                    return response.status(200).json({
                        process: true,
                        message: "0 models were found"
                    })
                }
            })
            .catch((findAllModelsError) => {
                return response.status(500).json({
                    process: false,
                    message: findAllModelsError.message
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

router.post("/addInventoryItem", (request,response,next) => {
    const modelId = request.body.modelId;
    const description = request.body.description;
    const serialNumber = request.body.serialNumber;
    const quantity = request.body.quantity;
    const price = request.body.price;
    const quantityThreshold = request.body.quantityThreshold;
    const image = request.body.image;
    Model.findOne({where: {id: modelId}})
    .then((findOneModelResult) => {
        if(findOneModelResult){
            Inventory.findOne({where: {modelId: modelId}})
            .then((findOneInventoryItemResult) => {
                if(findOneInventoryItemResult){
                    return response.status(200).json({
                        process: true,
                        message: "Inventory item already exist"
                    })
                }
                else{
                    Inventory.create({
                        modelId: modelId,
                        description: description,
                        serialNumber: serialNumber,
                        quantity: quantity,
                        price: price,
                        quantityThreshold: quantityThreshold,
                        image: image
                    })
                    .then((createInventoryItemEntryResult) => {
                        return response.status(200).json({
                            process: true,
                            message: "New inventory item was created",
                            data: createInventoryItemEntryResult
                        })
                    })
                    .catch((createInventoryItemEntryError) => {
                        return response.status(500).json({
                            process: false,
                            message: createInventoryItemEntryError.message
                        })
                    })
                }
            })
            .catch((findOneInventoryItemError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneInventoryItemError.message
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
})

router.get("/getAllInventoryItems", (request,response,next) => {
    const modelId = request.body.modelId;
    const description = request.body.description;
    const serialNumber = request.body.serialNumber;
    const quantity = request.body.quantity;
    const price = request.body.price;
    const quantityThreshold = request.body.quantityThreshold;
    Inventory.findAll({
        where: {
            [Op.iLike]: [
                {modelId: modelId},
                {description: description},
                {serialNumber: serialNumber},
                {quantity: quantity},
                {price: price},
                {quantityThreshold: quantityThreshold}
            ]
        }
    })
    .then((findAllInventoryItemsResult) => {
        if(findAllInventoryItemsResult){
            return response.status(200).json({
                process: true,
                message: `${findAllInventoryItemsResult.length} Inventory items matched search criteria`,
                data: findAllInventoryItemsResult
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "0 Inventory items matched search criteria"
            })
        }
    })
    .catch((findAllInventoryItemsError) => {
        return response.status(500).json({
            process: false,
            message: findAllInventoryItemsError.message
        })
    })
})

module.exports = router;