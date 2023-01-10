const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');

const Sequelize = require('sequelize');
// const { request } = require('express');
const User = require('../models/user');
const { Router, response } = require('express');
const jwt = require('jsonwebtoken');

router.post('/addUser', async(request, response) => {
    const idNumber = request.body.idNumber;
    const userType = request.body.userType;
    const firstName = request.body.firstName;
    const lastName = request.body.lastName;
    const password = request.body.password;
    const address = request.body.address;
    const email = request.body.email;
    const phoneNumber = request.body.phoneNumber;

    User.findOne({where: {email: email}})
    .then(account => {
        if(account){
            return response.status(200).json({
                process: true,
                message: 'Account already exist'
            })
        }
        else{
            //encrypt password
            bcryptjs.hash(password,10)
            .then(hashedPassword => {
                //store new account in database
                User.create({
                    idNumber: idNumber,
                    userType: userType,
                    firstName: firstName,
                    lastName: lastName,
                    password: hashedPassword,
                    address: address,
                    email: email,
                    phoneNumber: phoneNumber
                })
                .then(newAccount => {
                    return response.status(200).json({
                        process: true,
                        message: 'Account was created',
                        data: newAccount
                    })
                })
                .catch(saveToDbError => {
                    return response.status(500).json({
                        process: false,
                        message: saveToDbError.message
                    })
                })
            })
            .catch(hashError => {
                return response.status(200).json({
                    process: false,
                    message: hashError.message
                })
            })
        }   
    })
    .catch(findOneError => {
        return response.status(500).json({
            process: false,
            message: findOneError.message
        })
    })
})

router.post('/login',(request,response,next) => {
    const idNumber = request.body.idNumber
    const password = request.body.password

    User.findOne({where:{idNumber:idNumber}})
    .then(account => {
        if(account){
            bcryptjs.compare(password,account.password)
            .then(passwordVerified => {
                if(passwordVerified){
                    const dataForToken = {
                        id: account.id,
                        idNumber: account.idNumber,
                        userType: account.userType,
                        firstName: account.firstName,
                        lastName: account.lastName,
                        address: account.address,
                        email: account.email,
                        phoneNumber: account.phoneNumber
                    }
                    jwt.sign({dataForToken},'VyUcmnRvoF0R3Z2mjF3gRbXjQrrEW5as',(err,token) => {
                        if(err){
                            return response.status(200).json({
                                process: false,
                                message: 'JWT out of service'
                            })
                        }
                        else{
                            return response.status(200).json({
                                process: true,
                                token: token
                            })
                        }
                    })
                }
                else{
                    return response.status(200).json({
                        process: false,
                        message: 'Incorrect password'
                    })
                }
            })
        }
        else{
            return response.status(200).json({
                process: false,
                message: 'User not found'
            })
        }
    })
    .catch(findOneError => {
        return response.status(500).json({
            process: false,
            message: findOneError.message
        })
    })
})

router.post('/findUser',(request,response,next) => {
    const idNumber = request.body.idNumber;
    const userType = request.body.userType;
    const firstName = request.body.firstName;
    const lastName = request.body.lastName;
    const address = request.body.address;
    const email = request.body.email;
    const phoneNumber = request.body.phoneNumber;
    User.findAll({
        where: {
            [Op.iLike]: [
                {idNumber: idNumber},
                {userType: userType},
                {firstName: firstName},
                {lastName: lastName},
                {address: address},
                {email: email},
                {phoneNumber: phoneNumber}
            ]
        }
    })
    .then(users => {
        if(users){
            return response.status(200).json({
                process: true,
                searchResult: users
            })
        }
        else{
            return response.status(200).json({
                process: false,
                message: 'No users matched the requested criteria'
            })
        }
    })
    .catch(findAllError => {
        return response.status(500).json({
            process: false,
            message: findAllError.message
        })
    })
})

module.exports = router;