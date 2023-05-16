const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
const Customer = require("../models/customer");
const { response, request } = require("express");

router.post("/createCustomer", (request,response,next) => {
    const idNumber = request.body.idNumber;
    const firstName = request.body.firstName;
    const lastName = request.body.lastName;
    const email = request.body.email;
    Customer.findOne({where: {idNumber:idNumber}})
    .then((findOneCustomerResult) => {
        if(findOneCustomerResult){
            return response.status(200).json({
                process: true,
                message: "Customer already exist"
            })
        }
        else{
            Customer.create({
                idNumber: idNumber,
                firstName: firstName,
                lastName: lastName,
                email: email
            })
            .then((createResult) => {
                return response.status(200).json({
                    process: true,
                    message: "Customer created",
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
    .catch((findOneCustomerError) => {
        return response.status(500).json({
            process: false,
            message: findOneCustomerError.message,
            level: 1
        })
    })
})

router.get("/getAllCustomers", (request,response,next) => {
    Customer.findAll()
    .then((findAllCustomersResult) => {
        return response.status(200).json({
            process: true,
            message: `Found ${findAllCustomersResult.length} customers`,
            data: findAllCustomersResult
        })
    })
    .catch((findAllCustomersError) => {
        return response.status(500).json({
            process: false,
            message: findAllCustomersError.message,
            level: 1
        })
    })
})

router.get("/getCustomerById", (request,response,next) => {
    const id = request.body.id;
    Customer.findOne({where: {id:id}})
    .then((findOneCustomerResult) => {
        if(findOneCustomerResult){
            return response.status(200).json({
                process: true,
                message: "Customer found",
                data: findOneCustomerResult
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Customer not found"
            })
        }
    })
    .catch((findOneCustomerError) => {
        return response.status(500).json({
            process: false,
            message: findOneCustomerError.message,
            level: 1
        })
    })
})

router.post("/editCustomer", (request,response,next) => {
    const id = request.body.id;
    const newIdNumber = request.body.newIdNumber;
    const newFirstName = request.body.newFirstName;
    const newLastName = request.body.newLastName;
    const newEmail = request.body.newEmail;
    Customer.findOne({where: {id:id}})
    .then((findOneCustomerResult) => {
        if(findOneCustomerResult){
            Customer.findOne({where: {idNumber:newIdNumber}})
            .then((findOneExistingCustomerResult) => {
                if(findOneExistingCustomerResult != null && findOneCustomerResult.id != findOneExistingCustomerResult.id){
                    return response.status(200).json({
                        process: true,
                        message: "Customer already exist"
                    })
                }
                else{
                    findOneCustomerResult.set({
                        idNumber: newIdNumber,
                        firstName: newFirstName,
                        lastName: newLastName,
                        email: newEmail
                    })
                    findOneCustomerResult.save()
                    .then((saveResult) => {
                        return response.status(200).json({
                            process: true,
                            message: "Customer updated",
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
            .catch((findOneExistingCustomerError) => {
                return response.status(500).json({
                    process: false,
                    message: findOneExistingCustomerError.message,
                    level: 2
                })
            })
        }
        else{
            return response.status(200).json({
                process: true,
                message: "Customer not found"
            })
        }
    })
    .catch((findOneCustomerError) => {
        return response.status(500).json({
            process: false,
            message: findOneCustomerError.message,
            level: 1
        })
    })
})

router.post("/deleteCustomer", (request,response,next) => {
    const id = request.body.id;
    Customer.findOne({where: {id:id}})
    .then((findOneCustomerResult) => {
        if(findOneCustomerResult){
            findOneCustomerResult.destroy()
            .then(() => {
                return response.status(200).json({
                    process: true,
                    message: "Customer deleted"
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
                message: "Customer not found"
            }) 
        }
    })
    .catch((findOneCustomerError) => {
        return response.status(500).json({
            process: false,
            message: findOneCustomerError.message,
            level: 1
        })
    })
})

module.exports = router;