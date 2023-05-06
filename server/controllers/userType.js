const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
const UserType = require("../models/userType");
const { response, request } = require("express");

router.post("/createUserType", (request,response,next) => {
    const userTypeDescription = request.body.userTypeDescription;
    UserType.findOne({
        where: {
            [Op.iLike]: [{description:userTypeDescription}]
        }
    })
    .then((findOneUserTypeResult) => {
        if(findOneUserTypeResult){
            return response.status(200).json({
                process: true,
                message: "User type already exists"
            })
        }
        else{
            UserType.create({
                description: userTypeDescription
            })
            .then((createUserTypeResult) => {
                return response.status(200).json({
                    process: true,
                    message: "New user type created",
                    data: createUserTypeResult
                })
            })
            .catch((createUserTypeError) => {
                return response.status(500).json({
                    process: false,
                    message: createUserTypeError.message
                })
            })
        }
    })
    .catch((findOneUserTypeError) => {
        return response.status(500).json({
            process: false,
            message: findOneUserTypeError.message
        })
    })
})

router.post("/editUserType", (request,response,next) => {
    const id = request.body.id;
    const newUserTypeDescription = request.body.newUserTypeDescription;
    UserType.findOne({where: {id:id}})
    .then((findOneUserTypeResult) => {
        if(findOneUserTypeResult){
            UserType.findOne({where: {description:newUserTypeDescription}})
            .then((findOneUserTypeByDescriptionResult) => {
                if(findOneUserTypeByDescriptionResult){
                    return response.status(200).json({
                        process: true,
                        message: "User type already exist"
                    })
                }
                else{
                    findOneUserTypeResult.set({
                        description: newUserTypeDescription
                    })
                    findOneUserTypeResult.save()
                    .then((saveUserTypeResult) => {
                        return response.status(200).json({
                            process: true,
                            message: "User type changes saved",
                            data: saveUserTypeResult
                        })
                    })
                    .catch((saveUserTypeError) => {
                        return response.status(500).json({
                            process: false,
                            message: saveUserTypeError.message
                        })
                    })
                }
            })
            .catch((findOneUserTypeByDescriptionError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneUserTypeByDescriptionError.message
                })
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "User type not found"
            })
        }
    })
    .catch((findOneUserTypeError) => {
        return response.status(500).json({
            process: false,
            message: findOneUserTypeError.message
        })
    })
})

router.get("/getAllUserType", (request,response,next) => {
    UserType.findAll()
    .then((findAllUserTypeResult) => {
        return response.status(200).json({
            process: true,
            message: `Found ${findAllUserTypeResult.length} user type/s`,
            data: findAllUserTypeResult
        })
    })
    .catch((findAllUserTypeError) => {
        return response.status(500).json({
            process: false,
            message: findAllUserTypeError.message
        })
    })
})

router.get("/getUserTypeById", (request,response,next) => {
    const id = request.body.id;
    UserType.findOne({where: {id:id}})
    .then((findOneUserTypeResult) => {
        if(findOneUserTypeResult){
            return response.status(200).json({
                process: true,
                message: "User type found",
                data: findOneUserTypeResult
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "User type not found"
            })
        }
    })
    .catch((findOneUserTypeError) => {
        return response.status(500).json({
            process: false,
            message: findOneUserTypeError.message
        })
    })
})

router.post("/deleteUserType", (request,response,next) => {
    const id = request.body.id;
    UserType.findOne({where: {id:id}})
    .then((findOneUserTypeResult) => {
        if(findOneUserTypeResult){
            findOneUserTypeResult.destroy()
            .then(() => {
                return response.status(200).json({
                    process: true,
                    message: "User type deleted"
                })
            })
            .catch((destroyUserTypeError) => {
                return response.status(500).json({
                    process: false,
                    message: destroyUserTypeError.message
                })
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "User type not found"
            })
        }
    })
    .catch((findOneUserTypeError) => {
        return response.status(500).json({
            process: false,
            message: findOneUserTypeError.message
        })
    })
})