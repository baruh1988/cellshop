const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
// const { request } = require('express');
const User = require("../models/user");
const { Router, response, request } = require("express");
const jwt = require("jsonwebtoken");
const { HostNotReachableError } = require("sequelize");

router.post("/createUser", async (request, response) => {
  const idNumber = request.body.idNumber;
  const userType = request.body.userType;
  const firstName = request.body.firstName;
  const lastName = request.body.lastName;
  const password = request.body.password;
  const address = request.body.address;
  const email = request.body.email;
  const phoneNumber = request.body.phoneNumber;
  if(idNumber == ""){
    return response.status(200).json({
      process: true,
      message: "ID number can't be empty"
    })
  }
  User.findOne({where: {idNumber: idNumber}})
    .then((findOneUserResult) => {
      if (findOneUserResult) {
        return response.status(200).json({
          process: true,
          message: "User already exist",
        });
      } else {
        //encrypt password
        bcryptjs
          .hash(password, 10)
          .then((hashedPassword) => {
            //store new account in database
            User.create({
              idNumber: idNumber,
              userType: userType,
              firstName: firstName,
              lastName: lastName,
              password: hashedPassword,
              address: address,
              email: email,
              phoneNumber: phoneNumber,
            })
              .then((newUser) => {
                return response.status(200).json({
                  process: true,
                  message: "User was created",
                  data: newUser,
                });
              })
              .catch((createError) => {
                return response.status(500).json({
                  process: false,
                  message: createError.message,
                });
              });
          })
          .catch((hashError) => {
            return response.status(500).json({
              process: false,
              message: hashError.message,
            });
          });
      }
    })
    .catch((findOneUserError) => {
      return response.status(500).json({
        process: false,
        message: findOneUserError.message,
      });
    });
});

router.post("/login", (request, response, next) => {
  const idNumber = request.body.idNumber;
  const password = request.body.password;
  User.findOne({where: {idNumber:idNumber}})
  .then((findOneUserResult) => {
    if(findOneUserResult){
      bcryptjs.compare(password, findOneUserResult.password)
      .then((compareResult) => {
        if (compareResult) {
          const dataForToken = {
            id: findOneUserResult.id,
            idNumber: findOneUserResult.idNumber,
            userType: findOneUserResult.userType,
            firstName: findOneUserResult.firstName,
            lastName: findOneUserResult.lastName,
            address: findOneUserResult.address,
            email: findOneUserResult.email,
            phoneNumber: findOneUserResult.phoneNumber,
          };
          jwt.sign({ dataForToken }, "VyUcmnRvoF0R3Z2mjF3gRbXjQrrEW5as", (err, token) => {
            if (err) {
              return response.status(500).json({
                process: false,
                message: "JWT out of service",
              });
            }
            else {
              return response.status(200).json({
                process: true,
                message: "Token created",
                token: token,
              });
            }
          });
        }
        else {
          return response.status(200).json({
            process: false,
            message: "Incorrect password",
          });
        }
      })
      .catch((compareError) => {
        return response.status(500).json({
          process: false,
          message: compareError.message,
          level: 2
        });
      });
    }
    else{
      return response.status(200).json({
        process: true,
        message: "User not found",
      });
    }
  })
  .catch((findOneUserError) => {
    return response.status(500).json({
      process: false,
      message: findOneUserError.message,
      level: 1
    });
  });
});

router.get("/getUserById", (request, response, next) => {
  const id = request.body.id;
  User.findOne({where: {id:id}})
  .then((findOneUserResult) => {
    if (findOneUserResult) {
      return response.status(200).json({
        process: true,
        data: findOneUserResult,
      });
    } else {
      return response.status(200).json({
        process: true,
        message: "User not found",
      });
    }
  })
  .catch((findOneUserError) => {
    return response.status(500).json({
      process: false,
      message: findOneUserError.message,
    });
  });
});

router.get("/getAllUsers", (request, response, next) => {
  User.findAll()
  .then((findAllUsersResult) => {
    return response.status(200).json({
      process: true,
      message: `Found ${findAllUsersResult.length} users`,
      data: findAllUsersResult
    })
  })
  .catch((findAllUsersError) => {
    return response.status(500).json({
      process: false,
      message: findAllUsersError.message,
    });
  });
});

router.post("/editUser", (request, response, next) => {
  const id = request.body.id;
  const newIdNumber = request.body.newIdNumber;
  const newUserType = request.body.newUserType;
  const newFirstName = request.body.newFirstName;
  const newLastName = request.body.newLastName;
  const newAddress = request.body.newAddress;
  const newEmail = request.body.newEmail;
  const newPhoneNumber = request.body.newPhoneNumber;
  if(newIdNumber == ""){
    return response.status(200).json({
      process: true,
      message: "ID number can't be empty"
    })
  }
  User.findOne({where: {id:id}})
  .then((findOneUserResult) => {
    if(findOneUserResult){
      User.findOne({where: {idNumber:newIdNumber}})
      .then((findExistingUserResult) => {
        if(findExistingUserResult != null  && findExistingUserResult.id != findOneUserResult.id){
          return response.status(200).json({
            process: true,
            message: "User already exist"
          })
        }
        else{
          findOneUserResult.set({
            idNumber: newIdNumber,
            userType: newUserType,
            firstName: newFirstName,
            lastName: newLastName,
            address: newAddress,
            email: newEmail,
            phoneNumber: newPhoneNumber,
          });
          findOneUserResult.save()
          .then((saveResult) => {
            return response.status(200).json({
              process: true,
              message: "User updated",
              data: saveResult,
            });
          })
          .catch((saveError) => {
            return response.status(500).json({
              process: false,
              message: saveError.message,
            });
          });
        }
      })
      .catch((findExistingUserError) => {
        return response.status(500).json({
          process: false,
          message: findExistingUserError.message
        })
      })
    }
    else{
      return response.status(200).json({
        process: true,
        message: "User not found",
      });
    }
  })
  .catch((findOneUserError) => {
    return response.status(500).json({
      process: false,
      message: findOneUserError.message,
    });
  });
});

router.post("/changePassword", (request, response, next) => {
  const id = request.body.id;
  const currentPasword = request.body.currentPassword;
  const newPassword = request.body.newPassword;
  User.findOne({where: {id:id}})
  .then((findOneUserResult) => {
    if(findOneUserResult){
      bcryptjs.compare(currentPasword, findOneUserResult.password)
      .then((compareResult) => {
        if(compareResult){
          if(currentPasword == newPassword){
            return response.status(200).json({
              process: true,
              message: "New password must be different from current password"
            })
          }
          else{
            bcryptjs.hash(newPassword, 10)
            .then((hashedPassword) => {
              findOneUserResult.password = hashedPassword;
              findOneUserResult.save()
              .then(() => {
                return response.status(200).json({
                  process: true,
                  message: "Password changed successfuly",
                });
              })
              .catch((saveError) => {
                return response.status(500).json({
                  process: false,
                  message: saveError.message,
                  level: 4
                });
              });
            })
            .catch((hashError) => {
              return response.status(500).json({
                process: false,
                message: hashError.message,
                level: 3
              });
            });
          }
        }
        else{
          return response.status(200).json({
            process: true,
            message: "Incorrect password",
          });
        }
      })
      .catch((compareError) => {
        return response.status(500).json({
          process: false,
          message: compareError.message,
          level: 2
        });
      });
    } else {
      return response.status(200).json({
        process: true,
        message: "User not found",
      });
    }
  })
  .catch((findOneUserError) => {
    return response.status(500).json({
      process: false,
      message: findOneUserError.message,
      level: 1
    });
  });
});

router.post('/deleteUser',(request,response,next) => {
  const id = request.body.id;
  User.findOne({where:{id:id}})
  .then((findOneUserResult) => {
    if(findOneUserResult){
      findOneUserResult.destroy()
      .then(() => {
          return response.status(200).json({
              process: true,
              message: 'User deleted'
          })
      })
      .catch(destroyError => {
          return response.status(500).json({
              process: false,
              message: destroyError.message
          })
      })
    }
    else{
      return response.status(200).json({
          process: true,
          message: 'User not found'
      })
    }
  })
  .catch(findOneUserError => {
      return response.status(500).json({
          process: false,
          message: findOneUserError.message
      })
  })
})

router.post("/changePasswordByAdmin", (request,response,next) => {
  const id = request.body.id;
  const newPassword = request.body.newPassword;
  User.findOne({where: {id:id}})
  .then((findOneUserResult) => {
    if(findOneUserResult){
      bcryptjs.compare(newPassword, findOneUserResult.password)
      .then((compareResult) => {
        if(compareResult){
          return response.status(200).json({
            process: true,
            message: "New password must be different from current password"
          })
        }
        else{
          bcryptjs.hash(newPassword, 10)
          .then((hashedPassword) => {
            findOneUserResult.password = hashedPassword
            findOneUserResult.save()
            .then(() => {
              return response.status(200).json({
                process: true,
                message: "Password changed succefully"
              })
            })
            .catch((saveError) => {
              return response.status(500).json({
                process: false,
                message: saveError.message
              })
            })
          })
          .catch((hashError) => {
            return response.status(500).json({
              process: false,
              message: hashError.message
            })
          })
        }
      })
      .catch((compareError) => {
        return response.status(500).json({
          process: false,
          message: compareError.message
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
      message: findOneUserError.message
    })
  })
})

module.exports = router;
