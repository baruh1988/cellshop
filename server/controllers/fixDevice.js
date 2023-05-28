const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
const Inventory = require("../models/inventory")
const FixDevice = require("../models/fixDevice");
const { response, request } = require("express");
const InventoryItemType = require("../models/inventoryItemType");

router.post("/createFixDevice", (request, response, next) => {
    const imei = request.body.imei;
    const inventoryId = request.body.inventoryId;
    FixDevice.findOne({where: {imei:imei}})
    .then((findOneFixDeviceResult) => {
        if(findOneFixDeviceResult){
            return response.status(200).json({
            process: true,
            message: "Fix Device already exists",
            });
        }
        else{
            Inventory.findOne({where: {id:inventoryId}})
            .then((findOneInventoryItemResult) => {
                if(findOneInventoryItemResult){
                    InventoryItemType.findOne({where: {id:findOneInventoryItemResult.inventoryItemTypeId}})
                    .then((findOneInventoryItemTypeResult) => {
                        if(findOneInventoryItemTypeResult.name.toLowerCase() != "device"){
                            return response.status(200).json({
                                process: true,
                                message: "Invetory item is not a device"
                            });
                        }
                        FixDevice.create({
                            imei: imei,
                            inventoryId: inventoryId,
                            inStock: true
                        })
                        .then((createResult) => {
                            return response.status(200).json({
                                process: true,
                                message: "Fix device created",
                                data: createResult,
                            });
                        })
                        .catch((createError) => {
                            return response.status(500).json({
                                process: false,
                                message: createError.message,
                                level: 4
                            });
                        });
                    })
                    .catch((findOneInventoryItemTypeError) => {
                        return response.status(500).json({
                            process: false,
                            message: findOneInventoryItemTypeError.message,
                            level: 3
                        })
                    })
                }
                else{
                    return response.status(200).json({
                        process: true,
                        message: "Inventory item not found",
                    });
                }
            })
            .catch((findOneInventoryItemError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneInventoryItemError.message,
                    level: 2
                })
            });
        }
    })
    .catch((findOneFixDeviceError) => {
        return response.status(500).json({
            process: false,
            message: findOneFixDeviceError.message,
            level: 1
        });
    });
});

router.post("/editFixDevice", (request, response, next) => {
    const id = request.body.id;
    const newImei = request.body.newImei;
    const newInventoryId = request.body.newInventoryId;
    const newInStock = request.body.newInStock;
    FixDevice.findOne({where: {id:id} })
    .then((findOneFixDeviceResult) => {
        if(findOneFixDeviceResult) {
            FixDevice.findOne({where: {imei:newImei}})
            .then((findOneExistingFixDeviceResult) => {
                if (findOneExistingFixDeviceResult != null && id != findOneExistingFixDeviceResult.id){
                    return response.status(200).json({
                        process: true,
                        message: "Fix device already exist",
                    });
                }
                else{
                    Inventory.findOne({where: {id:newInventoryId}})
                    .then((findOneInventoryItemResult) => {
                        if(findOneInventoryItemResult){
                            InventoryItemType.findOne({where: {id:findOneInventoryItemResult.inventoryItemTypeId}})
                            .then((findOneInventoryItemTypeResult) => {
                                if(findOneInventoryItemTypeResult.name.toLowerCase() != "device"){
                                    return response.status(200).json({
                                        process: true,
                                        message: "Invetory item is not a device"
                                    });
                                }
                                findOneFixDeviceResult.set({
                                    imei: newImei,
                                    inventoryId: newInventoryId,
                                    inStock: newInStock
                                })
                                findOneFixDeviceResult.save()
                                .then((saveResult) => {
                                    return response.status(200).json({
                                        process: true,
                                        message: "Fix device updated",
                                        data: saveResult,
                                    });
                                })
                                .catch((saveError) => {
                                    return response.status(500).json({
                                        process: false,
                                        message: saveError.message,
                                        level: 5
                                    });
                                });
                            })
                            .catch((findOneInventoryItemTypeError) => {
                                return response.status(500).json({
                                    process: false,
                                    message: findOneInventoryItemTypeError.message,
                                    level: 4
                                });
                            })
                        }
                        else{
                            return response.status(200).json({
                                process: true,
                                message: "Inventory item not found",
                            });
                        }
                    })
                    .catch((findOneInventoryItemError) => {
                        return response.status(500).json({
                            process: false,
                            message: findOneInventoryItemError.message,
                            level: 3
                        });
                    })
                }
            })
            .catch((findOneExistingFixDeviceError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneExistingFixDeviceError.message,
                    level: 2
                });
            });
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Fix device not found",
            });
        }
    })
    .catch((findOneFixDeviceError) => {
        return response.status(500).json({
            process: false,
            message: findOneFixDeviceError.message,
            level: 1
        });
    });
});

router.get("/getAllFixDevices", (request, response, next) => {
    FixDevice.findAll()
    .then((findAllFixDevicesResult) => {
        return response.status(200).json({
            process: true,
            message: `Found ${findAllFixDevicesResult.length} fix device/s`,
            data: findAllFixDevicesResult,
        });
    })
    .catch((findAllFixDevicesError) => {
        return response.status(500).json({
            process: false,
            message: findAllFixDevicesError.message,
            level: 1
        });
    });
});

router.get("/getFixDeviceById", (request, response, next) => {
    const id = request.body.id;
    FixDevice.findOne({where: {id:id}})
    .then((findOneFixDeviceResult) => {
        if(findOneFixDeviceResult){
            return response.status(200).json({
                process: true,
                message: "Fix device found",
                data: findOneFixDeviceResult,
            });
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Fix device not found",
            });
        }
    })
    .catch((findOneFixDeviceError) => {
        return response.status(500).json({
            process: false,
            message: findOneFixDeviceError.message,
            level: 1
        });
    });
});

router.post("/deleteFixDevice", (request, response, next) => {
    const id = request.body.id;
    FixDevice.findOne({where: {id:id}})
    .then((findOneFixDeviceResult) => {
        if(findOneFixDeviceResult){
            findOneFixDeviceResult.destroy()
            .then(() => {
                return response.status(200).json({
                    process: true,
                    message: "Fix device deleted",
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
            message: "Fix device not found",
            });
        }
    })
    .catch((findOneFixDeviceError) => {
        return response.status(500).json({
            process: false,
            message: findOneFixDeviceError.message,
            level: 1
        });
    });
});

module.exports = router;