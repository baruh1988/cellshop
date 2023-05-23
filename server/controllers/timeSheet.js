const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
const User = require("../models/user");
const TimeSheet = require("../models/timeSheet");
const { response, request } = require("express");

router.post("/createTimeSheet", (request,response,next) => {
    const userId = request.body.userId;
    const start = request.body.start;
    User.findOne({where: {id:userId}})
    .then((findOneUserResult) => {
        if(findOneUserResult){
            TimeSheet.findOne({where: {
                userId: userId,
                isOpen: true
            }})
            .then((findOneExistingTimeSheetResult) => {
                if(findOneExistingTimeSheetResult){
                    return response.status(200).json({
                        process: true,
                        message: "There is an open time sheet for this user"
                    })
                }
                else{
                    if(isNaN(Date.parse(start))){
                        return response.status(200).json({
                            process: true,
                            message: "Invalid start value. Expected: YYYY-MM-DD hh:mm:ss"
                        })
                    }
                    TimeSheet.create({
                        userId: userId,
                        start: start,
                        end: null,
                        isOpen: true
                    })
                    .then((createResult) => {
                        return response.status(200).json({
                            process: true,
                            message: "Time sheet created",
                            data: createResult
                        })
                    })
                    .catch((createError) => {
                        return response.status(500).json({
                            process: false,
                            message: createError.message,
                            level: 3
                        })
                    })
                }
            })
            .catch((findOneExistingTimeSheetError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneExistingTimeSheetError.message,
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

router.post("/editTimeSheet", (request,response,next) => {
    const id = request.body.id;
    const newUserId = request.body.newUserId;
    const newStart = request.body.newStart;
    const newEnd = request.body.newEnd;
    let newIsOpen = request.body.newIsOpen;
    TimeSheet.findOne({where: {id:id}})
    .then((findOneTimeSheetResult) => {
        if(findOneTimeSheetResult){
            User.findOne({where: {id:newUserId}})
            .then((findOneUserResult) => {
                if(findOneUserResult){
                    if(isNaN(Date.parse(newStart))){
                        return response.status(200).json({
                            process: true,
                            message: "Invalid start value. Expected: YYYY-MM-DD hh:mm:ss"
                        })
                    }
                    if(newEnd != null && isNaN(Date.parse(newEnd))){
                        return response.status(200).json({
                            process: true,
                            message: "Invalid end value. Expected: YYYY-MM-DD hh:mm:ss"
                        })
                    }
                    if(typeof newIsOpen == "boolean"){
                        if(!newIsOpen && newEnd == null){
                            return response.status(200).json({
                                process: true,
                                message: "isOpen can't be false when end is null"
                            })
                        }
                        if(newEnd != null){
                            const res = Date.parse(newEnd)-Date.parse(newStart)
                            console.log(`End-Start = ${res}`);
                            if(res <= 0){
                                return response.status(200).json({
                                    process: true,
                                    message: "End must be later than start"
                                })
                            }
                            else if(newIsOpen){
                                newIsOpen = false;
                            }
                        }
                    }
                    else{
                        return response.status(200).json({
                            process: true,
                            message: "Invalid isOpen value. Expected: true or false"
                        })
                    }
                    findOneTimeSheetResult.set({
                        userId: newUserId,
                        start: newStart,
                        end: newEnd,
                        isOpen: newIsOpen
                    })
                    findOneTimeSheetResult.save()
                    .then((saveResult) => {
                        return response.status(200).json({
                            process: true,
                            message: "Time sheet updated",
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
                message: "Time sheet not found"
            })
        }
    })
    .catch((findOneTimeSheetError) => {
        return response.status(500).json({
            process: false,
            message: findOneTimeSheetError.message,
            level: 1
        })
    })
});

router.get("/getAllTimeSheets", (request,response,next) => {
    TimeSheet.findAll()
    .then((findAllTimeSheetsResult) => {
        return response.status(200).json({
            process: true,
            message: `Found ${findAllTimeSheetsResult.length} time sheet/s`,
            data: findAllTimeSheetsResult
        })
    })
    .catch((findAllTimeSheetsError) => {
        return response.status(500).json({
            process: false,
            message: findAllTimeSheetsError.message,
            level: 1
        })
    })
});

router.get("/getTimeSheetById", (request,response,next) => {
    const id = request.body.id;
    TimeSheet.findOne({where: {id:id}})
    .then((findOneTimeSheetResult) => {
        if(findOneTimeSheetResult){
            return response.status(200).json({
                process: true,
                message: "Time sheet found",
                data: findOneTimeSheetResult
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Time sheet not found"
            }) 
        }
    })
    .catch((findOneTimeSheetError) => {
        return response.status(500).json({
            process: false,
            message: findOneTimeSheetError.message,
            level: 1
        })
    })
});

router.post("/deleteTimeSheet", (request,response,next) => {
    const id = request.body.id;
    TimeSheet.findOne({where: {id:id}})
    .then((findOneTimeSheetResult) => {
        if(findOneTimeSheetResult){
            findOneTimeSheetResult.destroy()
            .then(() => {
                return response.status(200).json({
                    process: true,
                    message: "Time sheet deleted"
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
                message: "Time sheet not found"
            }) 
        }
    })
    .catch((findOneTimeSheetError) => {
        return response.status(500).json({
            process: false,
            message: findOneTimeSheetError.message,
            level: 1
        })
    })
});

module.exports = router;