const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
const Shift = require("../models/shift");
const { response, request } = require("express");

router.post("/createShift", (request, response, next) => {
    const name = request.body.name;
    Shift.findOne({where: {name:name}})
    .then((findOneShiftResult) => {
        if(findOneShiftResult){
            return response.status(200).json({
            process: true,
            message: "Shift already exists",
            });
        }
        else{
            Shift.create({
                name: name,
            })
            .then((createResult) => {
                return response.status(200).json({
                    process: true,
                    message: "Shift created",
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
    .catch((findOneShiftError) => {
        return response.status(500).json({
            process: false,
            message: findOneShiftError.message,
            level: 1
        });
    });
});

router.post("/editShift", (request, response, next) => {
    const id = request.body.id;
    const newName = request.body.newName;
    Shift.findOne({where: {id:id} })
    .then((findOneShiftResult) => {
        if(findOneShiftResult) {
            Shift.findOne({where: {name:newName}})
            .then((findOneExistingShiftResult) => {
                if (findOneExistingShiftResult != null && id != findOneExistingShiftResult.id) {
                    return response.status(200).json({
                        process: true,
                        message: "Shift already exist",
                    });
                }
                else{
                    findOneShiftResult.name = newName;
                    findOneShiftResult.save()
                    .then((saveResult) => {
                        return response.status(200).json({
                            process: true,
                            message: "Shift updated",
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
            .catch((findOneExistingShiftResult) => {
                return response.status(500).json({
                    process: false,
                    message: findOneExistingShiftResult.message,
                    level: 2
                });
            });
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Shift not found",
            });
        }
    })
    .catch((findOneShiftError) => {
        return response.status(500).json({
            process: false,
            message: findOneShiftError.message,
            level: 1
        });
    });
});

router.get("/getAllShifts", (request, response, next) => {
    Shift.findAll()
    .then((findAllShiftsResult) => {
        return response.status(200).json({
            process: true,
            message: `Found ${findAllShiftsResult.length} shift/s`,
            data: findAllShiftsResult,
        });
    })
    .catch((findAllShiftsError) => {
        return response.status(500).json({
            process: false,
            message: findAllShiftsError.message,
            level: 1
        });
    });
});

router.get("/getShiftById", (request, response, next) => {
    const id = request.body.id;
    Shift.findOne({where: {id:id} })
    .then((findOneShiftResult) => {
        if(findOneShiftResult){
            return response.status(200).json({
                process: true,
                message: "Shift found",
                data: findOneShiftResult,
            });
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Shift not found",
            });
        }
    })
    .catch((findOneShiftError) => {
        return response.status(500).json({
            process: false,
            message: findOneShiftError.message,
            level: 1
        });
    });
});

router.post("/deleteShift", (request, response, next) => {
    const id = request.body.id;
    Shift.findOne({where: {id:id}})
    .then((findOneShiftResult) => {
        if(findOneShiftResult){
            findOneShiftResult.destroy()
            .then(() => {
                return response.status(200).json({
                    process: true,
                    message: "Shift deleted",
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
            message: "Shift not found",
            });
        }
    })
    .catch((findOneShiftError) => {
        return response.status(500).json({
            process: false,
            message: findOneShiftError.message,
            level: 1
        });
    });
});

module.exports = router;