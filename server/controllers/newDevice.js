const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
const Inventory = require("../models/inventory")
const NewDevice = require("../models/newDevice");
const { response, request } = require("express");
const InventoryItemType = require("../models/inventoryItemType");

router.post("/createNewDevice", (request, response, next) => {
    const imei = request.body.imei;
    const inventoryId = request.body.inventoryId;
    NewDevice.findOne({where: {imei:imei}})
    .then((findOneNewDeviceResult) => {
        if(findOneNewDeviceResult){
            return response.status(200).json({
            process: true,
            message: "New Device already exists",
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
                        NewDevice.create({
                            imei: imei,
                            inventoryId: inventoryId,
                            inStock: true
                        })
                        .then((createResult) => {
                            return response.status(200).json({
                                process: true,
                                message: "New device created",
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
    .catch((findOneNewDeviceError) => {
        return response.status(500).json({
            process: false,
            message: findOneNewDeviceError.message,
            level: 1
        });
    });
});

router.post("/editNewDevice", (request, response, next) => {
    const id = request.body.id;
    const newImei = request.body.newImei;
    const newInventoryId = request.body.newInventoryId;
    const newInStock = request.body.newInStock;
    NewDevice.findOne({where: {id:id} })
    .then((findOneNewDeviceResult) => {
        if(findOneNewDeviceResult) {
            NewDevice.findOne({where: {imei:newImei}})
            .then((findOneExistingNewDeviceResult) => {
                if (findOneExistingNewDeviceResult != null && id != findOneExistingNewDeviceResult.id){
                    return response.status(200).json({
                        process: true,
                        message: "New device already exist",
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
                                findOneNewDeviceResult.set({
                                    imei: newImei,
                                    inventoryId: newInventoryId,
                                    inStock: newInStock
                                })
                                findOneNewDeviceResult.save()
                                .then((saveResult) => {
                                    return response.status(200).json({
                                        process: true,
                                        message: "New device updated",
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
            .catch((findOneExistingNewDeviceError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneExistingNewDeviceError.message,
                    level: 2
                });
            });
        }
        else{
            return response.status(200).json({
                process: true,
                message: "New device not found",
            });
        }
    })
    .catch((findOneNewDeviceError) => {
        return response.status(500).json({
            process: false,
            message: findOneNewDeviceError.message,
            level: 1
        });
    });
});

router.get("/getAllNewDevices", (request, response, next) => {
    NewDevice.findAll()
    .then((findAllNewDevicesResult) => {
        return response.status(200).json({
            process: true,
            message: `Found ${findAllNewDevicesResult.length} new device/s`,
            data: findAllNewDevicesResult,
        });
    })
    .catch((findAllNewDevicesError) => {
        return response.status(500).json({
            process: false,
            message: findAllNewDevicesError.message,
            level: 1
        });
    });
});

router.get("/getNewDeviceById", (request, response, next) => {
    const id = request.body.id;
    NewDevice.findOne({where: {id:id}})
    .then((findOneNewDeviceResult) => {
        if(findOneNewDeviceResult){
            return response.status(200).json({
                process: true,
                message: "New device found",
                data: findOneNewDeviceResult,
            });
        }
        else{
            return response.status(200).json({
                process: true,
                message: "New device not found",
            });
        }
    })
    .catch((findOneNewDeviceError) => {
        return response.status(500).json({
            process: false,
            message: findOneNewDeviceError.message,
            level: 1
        });
    });
});

router.post("/deleteNewDevice", (request, response, next) => {
    const id = request.body.id;
    NewDevice.findOne({where: {id:id}})
    .then((findOneNewDeviceResult) => {
        if(findOneNewDeviceResult){
            findOneNewDeviceResult.destroy()
            .then(() => {
                return response.status(200).json({
                    process: true,
                    message: "New device deleted",
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
            message: "New device not found",
            });
        }
    })
    .catch((findOneNewDeviceError) => {
        return response.status(500).json({
            process: false,
            message: findOneNewDeviceError.message,
            level: 1
        });
    });
});

module.exports = router;