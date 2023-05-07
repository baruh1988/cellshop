const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const Sequelize = require("sequelize");
// const { request } = require('express');
const User = require("../models/user");
const { Router, response, request } = require("express");
const jwt = require("jsonwebtoken");
const { HostNotReachableError } = require("sequelize");

router.post("/addUser", async (request, response) => {
  const idNumber = request.body.idNumber;
  const userType = request.body.userType;
  const firstName = request.body.firstName;
  const lastName = request.body.lastName;
  const password = request.body.password;
  const address = request.body.address;
  const email = request.body.email;
  const phoneNumber = request.body.phoneNumber;

  User.findOne({ where: { idNumber: idNumber } })
    .then((account) => {
      if (account) {
        return response.status(200).json({
          process: true,
          message: "Account already exist",
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
              .then((newAccount) => {
                return response.status(200).json({
                  process: true,
                  message: "Account was created",
                  data: newAccount,
                });
              })
              .catch((saveToDbError) => {
                return response.status(500).json({
                  process: false,
                  message: saveToDbError.message,
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
    .catch((findOneError) => {
      return response.status(500).json({
        process: false,
        message: findOneError.message,
      });
    });
});

router.post("/login", (request, response, next) => {
  const idNumber = request.body.idNumber;
  const password = request.body.password;

  User.findOne({ where: { idNumber: idNumber } })
    .then((account) => {
      if (account) {
        bcryptjs
          .compare(password, account.password)
          .then((passwordVerified) => {
            if (passwordVerified) {
              const dataForToken = {
                id: account.id,
                idNumber: account.idNumber,
                userType: account.userType,
                firstName: account.firstName,
                lastName: account.lastName,
                address: account.address,
                email: account.email,
                phoneNumber: account.phoneNumber,
              };
              jwt.sign(
                { dataForToken },
                "VyUcmnRvoF0R3Z2mjF3gRbXjQrrEW5as",
                (err, token) => {
                  if (err) {
                    return response.status(500).json({
                      process: false,
                      message: "JWT out of service",
                    });
                  } else {
                    return response.status(200).json({
                      process: true,
                      token: token,
                    });
                  }
                }
              );
            } else {
              return response.status(200).json({
                process: false,
                message: "Incorrect password",
              });
            }
          })
          .catch((bcryptjsCompareError) => {
            return response.status(500).json({
              process: false,
              message: bcryptjsCompareError.message,
            });
          });
      } else {
        return response.status(200).json({
          process: false,
          message: "User not found",
        });
      }
    })
    .catch((findOneError) => {
      return response.status(500).json({
        process: false,
        message: findOneError.message,
      });
    });
});

router.post("/findUser", (request, response, next) => {
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
        { idNumber: idNumber },
        { userType: userType },
        { firstName: firstName },
        { lastName: lastName },
        { address: address },
        { email: email },
        { phoneNumber: phoneNumber },
      ],
    },
  })
    .then((users) => {
      if (users) {
        return response.status(200).json({
          process: true,
          searchResult: users,
        });
      } else {
        return response.status(200).json({
          process: true,
          message: "No user matched the requested criteria",
        });
      }
    })
    .catch((findAllError) => {
      return response.status(500).json({
        process: false,
        message: findAllError.message,
      });
    });
});

router.get("/getAllUsers", (request, response, next) => {
  User.findAll()
    .then((findAllUsersResult) => {
      return response.status(200).json({
        process: true,
        data: findAllUsersResult,
        message: `Found ${findAllUsersResult.length} users`,
      });
    })
    .catch((findAllUsersError) => {
      return response.status(500).json({
        process: false,
        message: findAllUsersError.message,
      });
    });
});

router.post("/editUser", (request, response, next) => {
  const idNumber = request.body.idNumber;
  const userType = request.body.userType;
  const firstName = request.body.firstName;
  const lastName = request.body.lastName;
  const address = request.body.address;
  const email = request.body.email;
  const phoneNumber = request.body.phoneNumber;
  User.findOne({ where: { idNumber: idNumber } })
    .then((account) => {
      if (account) {
        account.set({
          idNumber: idNumber,
          userType: userType,
          firstName: firstName,
          lastName: lastName,
          address: address,
          email: email,
          phoneNumber: phoneNumber,
        });
        account
          .save()
          .then((updatedAccount) => {
            return response.status(200).json({
              process: true,
              message: "Account was updated",
              data: updatedAccount,
            });
          })
          .catch((saveError) => {
            return response.status(500).json({
              process: false,
              message: saveError.message,
            });
          });
      } else {
        return response.status(200).json({
          process: true,
          message: "Account not found",
        });
      }
    })
    .catch((findOneError) => {
      return response.status(500).json({
        process: false,
        message: findOneError.message,
      });
    });
});

router.post("/changePassword", (request, response, next) => {
  const idNumber = request.body.idNumber;
  const currentPasword = request.body.currentPassword;
  const newPassword = request.body.newPassword;
  User.findOne({ where: { idNumber: idNumber } })
    .then((account) => {
      if (account) {
        bcryptjs
          .compare(currentPasword, account.password)
          .then((passwordVerified) => {
            if (passwordVerified) {
              bcryptjs
                .hash(newPassword, 10)
                .then((hashedPassword) => {
                  account.password = hashedPassword;
                  account
                    .save()
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
                      });
                    });
                })
                .catch((hashError) => {
                  return response.status(500).json({
                    process: false,
                    message: hashError.message,
                  });
                });
            } else {
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
            });
          });
      } else {
        return response.status(200).json({
          process: true,
          message: "Account not found",
        });
      }
    })
    .catch((findOneError) => {
      return response.status(500).json({
        process: false,
        message: findOneError.message,
      });
    });
});

router.post("/deleteUser", (request, response, next) => {
  const idNumber = request.body.idNumber;
  User.findOne({ where: { idNumber: idNumber } })
    .then((account) => {
      if (account) {
        account
          .destroy()
          .then(() => {
            return response.status(200).json({
              process: true,
              message: "Account was deleted",
            });
          })
          .catch((destroyError) => {
            return response.status(500).json({
              process: false,
              message: destroyError.message,
            });
          });
      } else {
        return response.status(200).json({
          process: true,
          message: "Account not found",
        });
      }
    })
    .catch((findOneError) => {
      return response.status(500).json({
        process: false,
        message: findOneError.message,
      });
    });
});

module.exports = router;
