const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
const User = require("../models/user");
const Shift = require("../models/shift");
const WorkSchedule = require("../models/workSchedule");
const { response, request } = require("express");

router.post("/createWorkSchedule", (request,response,next) => {
    const userId = request.body.userId;
    const day = request.body.day;
    const shiftId = request.body.shiftId;
    if(isNaN(Date.parse(day))){
        return response.status(200).json({
            process: true,
            message: "Invalid day value. Expected: YYYY-MM-DD"
        })
    }
    User.findOne({where: {id:userId}})
    .then((findOneUserResult) => {
        if(findOneUserResult){
            WorkSchedule.findOne({where: {
                userId: userId,
                day:day
            }})
            .then((findOneExistingWorkScheduleResult) => {
                if(findOneExistingWorkScheduleResult){
                    return response.status(200).json({
                        process: true,
                        message: "Work schedule already exist"
                    })
                }
                else{
                    Shift.findOne({where: {id:shiftId}})
                    .then((findOneShiftResult) => {
                        if(findOneShiftResult){
                            WorkSchedule.create({
                                userId: userId,
                                day: day,
                                shiftId: shiftId
                            })
                            .then((createResult) => {
                                return response.status(200).json({
                                    process: true,
                                    message: "Work schedule created",
                                    data: createResult
                                })
                            })
                            .catch((createError) => {
                                return response.status(500).json({
                                    process: false,
                                    message: createError.message,
                                    level: 4
                                })
                            })
                        }
                        else{
                            return response.status(200).json({
                                process: true,
                                message: "Shift not found"
                            }) 
                        }
                    })
                    .catch((findOneShiftError) => {
                        return response.status(500).json({
                            process: false,
                            message: findOneShiftError.message,
                            level: 3
                        })
                    })
                }
            })
            .catch((findOneExistingWorkScheduleError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneExistingWorkScheduleError.message,
                    level: 2
                })
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "User not found"
            })
        }
    })
    .catch((findOneUserError) => {
        return response.status(500).json({
            process: false,
            message: findOneUserError.message,
            level: 1
        })
    })
});

router.post("/editWorkSchedule", (request,response,next) => {
    const id = request.body.id;
    const newUserId = request.body.newUserId;
    const newDay = request.body.newDay;
    const newShiftId = request.body.newShiftId;
    if(isNaN(Date.parse(newDay))){
        return response.status(200).json({
            process: true,
            message: "Invalid day value. Expected: YYYY-MM-DD"
        })
    }
    WorkSchedule.findOne({where: {id:id}})
    .then((findOneWorkScheduleResult) => {
        if(findOneWorkScheduleResult){
            User.findOne({where: {id:newUserId}})
            .then((findOneUserResult) => {
                if(findOneUserResult){
                    WorkSchedule.findOne({where: {
                        userId: newUserId,
                        day: newDay
                    }})
                    .then((findOneExistingWorkScheduleResult) => {
                        if(findOneExistingWorkScheduleResult != null && id != findOneExistingWorkScheduleResult.id){
                            return response.status(200).json({
                                process: true,
                                message: "Work schedule already exist"
                            })
                        }
                        else{
                            Shift.findOne({where: {id:newShiftId}})
                            .then((findOneShiftResult) => {
                                if(findOneShiftResult){
                                    findOneWorkScheduleResult.set({
                                        userId: newUserId,
                                        day: newDay,
                                        shiftId: newShiftId
                                    })
                                    findOneWorkScheduleResult.save()
                                    .then((saveResult) => {
                                        return response.status(200).json({
                                            process: true,
                                            message: "Work schedule updated"
                                        })
                                    })
                                    .catch((saveError) => {
                                        return response.status(500).json({
                                            process: false,
                                            message: saveError.message,
                                            level: 5
                                        })
                                    })
                                }
                                else{
                                    return response.status(200).json({
                                        process: true,
                                        message: "Shift not found"
                                    })
                                }
                            })
                            .catch((findOneShiftError) => {
                                return response.status(500).json({
                                    process: false,
                                    message: findOneShiftError.message,
                                    level: 4
                                })
                            })
                        }
                    })
                    .catch((findOneExistingWorkScheduleError) => {
                        return response.status(500).json({
                            process: false,
                            message: findOneExistingWorkScheduleError.message,
                            level: 3
                        })
                    })
                }
                else{
                    return response.status(200).json({
                        process: true,
                        message: "User not found"
                    })
                }
            })
            .catch((findOneUserError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneUserError.message,
                    level: 2
                })
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Work schedule not found"
            })
        }
    })
    .catch((findOneWorkScheduleError) => {
        return response.status(500).json({
            process: false,
            message: findOneWorkScheduleError.message,
            level: 1
        })
    })
});

router.get("/getAllWorkSchedules", (request,response,next) => {
    WorkSchedule.findAll()
    .then((findAllWorkSchedulesResult) => {
        return response.status(200).json({
            process: true,
            message: `Found ${findAllWorkSchedulesResult.length} work schedule/s`,
            data: findAllWorkSchedulesResult
        })
    })
    .catch((findAllWorkSchedulesError) => {
        return response.status(500).json({
            process: false,
            message: findAllWorkSchedulesError.message,
            level: 1
        })
    })
});

router.get("/getWorkScheduleById", (request,response,next) => {
    const id = request.body.id;
    WorkSchedule.findOne({where: {id:id}})
    .then((findOneWorkScheduleResult) => {
        if(findOneWorkScheduleResult){
            return response.status(200).json({
                process: true,
                message: "Work schedule found",
                data: findOneWorkScheduleResult
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Work schedule not found"
            })
        }
    })
    .catch((findOneWorkScheduleError) => {
        return response.status(500).json({
            process: false,
            message: findOneWorkScheduleError.message,
            level: 1
        })
    })
});

router.post("/deleteWorkSchedule", (request,response,next) => {
    const id = request.body.id;
    WorkSchedule.findOne({where: {id:id}})
    .then((findOneWorkScheduleResult) => {
        if(findOneWorkScheduleResult){
            findOneWorkScheduleResult.destroy()
            .then(() => {
                return response.status(200).json({
                    process: true,
                    message: "Work schedule deleted"
                })
            })
            .catch((destroyError) => {
                return response.status(500).json({
                    process: false,
                    message: destroyError.message,
                    level: 2
                })
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Work schedule not found"
            })
        }
    })
    .catch((findOneWorkScheduleError) => {
        return response.status(500).json({
            process: false,
            message: findOneWorkScheduleError.message,
            level: 1
        })
    })
});

module.exports = router;