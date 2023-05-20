const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
const InventoryItemType = require("../models/inventoryItemType");
const { response, request } = require("express");

router.post("/createInventoryItemType", (request, response, next) => {
    const name = request.body.name;
    InventoryItemType.findOne({where: {name:name}})
    .then((findOneInventoryItemTypeResult) => {
        if(findOneInventoryItemTypeResult){
            return response.status(200).json({
            process: true,
            message: "Inventory item type already exists",
            });
        }
        else{
            InventoryItemType.create({
                name: name,
            })
            .then((createResult) => {
                return response.status(200).json({
                    process: true,
                    message: "Inventory item type created",
                    data: createResult,
                });
            })
            .catch((createError) => {
                return response.status(500).json({
                    process: false,
                    message: createError.message,
                    level: 2
                });
            });
        }
    })
    .catch((findOneInventoryItemTypeError) => {
        return response.status(500).json({
            process: false,
            message: findOneInventoryItemTypeError.message,
            level: 1
        });
    });
});

router.post("/editInventoryItemType", (request, response, next) => {
    const id = request.body.id;
    const newName = request.body.newName;
    InventoryItemType.findOne({where: {id:id} })
    .then((findOneInventoryItemTypeResult) => {
        if(findOneInventoryItemTypeResult) {
            InventoryItemType.findOne({where: {name:newName}})
            .then((findOneExistingInventoryItemTypeResult) => {
                if (findOneExistingInventoryItemTypeResult != null && id != findOneExistingInventoryItemTypeResult.id) {
                    return response.status(200).json({
                        process: true,
                        message: "Inventory item type already exist",
                    });
                }
                else{
                    findOneInventoryItemTypeResult.name = newName;
                    findOneInventoryItemTypeResult.save()
                    .then((saveResult) => {
                        return response.status(200).json({
                            process: true,
                            message: "Inventory item type updated",
                            data: saveResult,
                        });
                    })
                    .catch((saveError) => {
                        return response.status(500).json({
                            process: false,
                            message: saveError.message,
                            level: 3
                        });
                    });
                }
            })
            .catch((findOneExistingInventoryItemTypeResult) => {
                return response.status(500).json({
                    process: false,
                    message: findOneExistingInventoryItemTypeResult.message,
                    level: 2
                });
            });
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Inventory item type not found",
            });
        }
    })
    .catch((findOneInventoryItemTypeError) => {
        return response.status(500).json({
            process: false,
            message: findOneInventoryItemTypeError.message,
            level: 1
        });
    });
});

router.get("/getAllInventoryItemTypes", (request, response, next) => {
    InventoryItemType.findAll()
    .then((findAllInventoryItemTypesResult) => {
        return response.status(200).json({
            process: true,
            message: `Found ${findAllInventoryItemTypesResult.length} inventory item type/s`,
            data: findAllInventoryItemTypesResult,
        });
    })
    .catch((findAllInventoryItemTypesError) => {
        return response.status(500).json({
            process: false,
            message: findAllInventoryItemTypesError.message,
            level: 1
        });
    });
});

router.get("/getInventoryItemTypeById", (request, response, next) => {
    const id = request.body.id;
    InventoryItemType.findOne({where: {id:id} })
    .then((findOneInventoryItemTypeResult) => {
        if(findOneInventoryItemTypeResult){
            return response.status(200).json({
                process: true,
                message: "Inventory item type found",
                data: findOneInventoryItemTypeResult,
            });
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Inventory item type not found",
            });
        }
    })
    .catch((findOneInventoryItemTypeError) => {
        return response.status(500).json({
            process: false,
            message: findOneInventoryItemTypeError.message,
            level: 1
        });
    });
});

router.post("/deleteInventoryItemType", (request, response, next) => {
    const id = request.body.id;
    InventoryItemType.findOne({where: {id:id}})
    .then((findOneInventoryItemTypeResult) => {
        if(findOneInventoryItemTypeResult){
            findOneInventoryItemTypeResult.destroy()
            .then(() => {
                return response.status(200).json({
                    process: true,
                    message: "Invetory item type deleted",
                });
            })
            .catch((destroyError) => {
                return response.status(500).json({
                    process: false,
                    message: destroyError.message,
                    level: 2
                });
            });
        }
        else{
            return response.status(200).json({
            process: true,
            message: "Inventory item type not found",
            });
        }
    })
    .catch((findOneInventoryItemTypeError) => {
        return response.status(500).json({
            process: false,
            message: findOneInventoryItemTypeError.message,
            level: 1
        });
    });
});

module.exports = router;