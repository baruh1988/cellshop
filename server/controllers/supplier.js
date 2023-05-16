const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
const Supplier = require("../models/supplier");
const { response, request } = require("express");

router.post("/createSupplier", (request,response,next) => {
    const idNumber = request.body.idNumber;
    const name = request.body.name;
    const email = request.body.email;
    const phoneNumber = request.body.phoneNumber;
    Supplier.findOne({where: {idNumber:idNumber}})
    .then((findOneSupplierResult) => {
        if(findOneSupplierResult){
            return response.status(200).json({
                process: true,
                message: "Supplier already exist"
            })
        }
        else{
            Supplier.create({
                idNumber: idNumber,
                name: name,
                email: email,
                phoneNumber: phoneNumber
            })
            .then((createResult) => {
                return response.status(200).json({
                    process: true,
                    message: "Supplier created",
                    data: createResult
                })
            })
            .catch((createError) => {
                return response.status(500).json({
                    process: false,
                    message: createError.message,
                    level: 2
                })
            })
        }
    })
    .catch((findOneSupplierError) => {
        return response.status(500).json({
            process: false,
            message: findOneSupplierError.message,
            level: 1
        })
    })
})

router.get("/getAllSuppliers", (request,response,next) => {
    Supplier.findAll()
    .then((findAllSuppliersResult) => {
        return response.status(200).json({
            process: true,
            message: `Found ${findAllSuppliersResult.length} suppliers`,
            data: findAllSuppliersResult
        })
    })
    .catch((findAllSuppliersError) => {
        return response.status(500).json({
            process: false,
            message: findAllSuppliersError.message,
            level: 1
        })
    })
})

router.get("/getSupplierById", (request,response,next) => {
    const id = request.body.id;
    Supplier.findOne({where: {id:id}})
    .then((findOneSupplierResult) => {
        if(findOneSupplierResult){
            return response.status(200).json({
                process: true,
                message: "Supplier found",
                data: findOneSupplierResult
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Supplier not found"
            })
        }
    })
    .catch((findOneSupplierError) => {
        return response.status(500).json({
            process: false,
            message: findOneSupplierError.message,
            level: 1
        })
    })
})

router.post("/editSupplier", (request,response,next) => {
    const id = request.body.id;
    const newIdNumber = request.body.newIdNumber;
    const newName = request.body.newName;
    const newEmail = request.body.newEmail;
    const newPhoneNumber = request.body.newPhoneNumber;
    Supplier.findOne({where: {id:id}})
    .then((findOneSupplierResult) => {
        if(findOneSupplierResult){
            Supplier.findOne({where: {idNumber:newIdNumber}})
            .then((findOneExistingSupplierResult) => {
                if(findOneExistingSupplierResult != null && findOneSupplierResult.id != findOneExistingSupplierResult.id){
                    return response.status(200).json({
                        process: true,
                        message: "Supplier already exist"
                    })
                }
                else{
                    findOneSupplierResult.set({
                        idNumber: newIdNumber,
                        name: newName,
                        email: newEmail,
                        phoneNumber: newPhoneNumber
                    })
                    findOneSupplierResult.save()
                    .then((saveResult) => {
                        return response.status(200).json({
                            process: true,
                            message: "Supplier updated",
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
            })
            .catch((findOneExistingSupplierError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneExistingSupplierError.message,
                    level: 2
                })
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Supplier not found"
            })
        }
    })
    .catch((findOneSupplierError) => {
        return response.status(500).json({
            process: false,
            message: findOneSupplierError.message,
            level: 1
        })
    })
})

router.post("/deleteSupplier", (request,response,next) => {
    const id = request.body.id;
    Supplier.findOne({where: {id:id}})
    .then((findOneSupplierResult) => {
        if(findOneSupplierResult){
            findOneSupplierResult.destroy()
            .then(() => {
                return response.status(200).json({
                    process: true,
                    message: "Supplier deleted"
                })
            })
            .catch((destroyError) => {
                return response.status(500).json({
                    process: false,
                    message: destroyError.message,
                    level: 1
                })
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Supplier not found"
            }) 
        }
    })
    .catch((findOneSupplierError) => {
        return response.status(500).json({
            process: false,
            message: findOneSupplierError.message,
            level: 1
        })
    })
})

module.exports = router;