"use strict";

const { ReplSet } = require("mongodb");
const User = require("../models/user");

module.exports = {
    index: (req, res, next) => {
        User.find({})
            .then(userList => {
                res.locals.users = userList;
                next();
            })
            .catch(error => {
                console.log(`[INDEX] Error fetching all users: ${error.message}`);
                next(error);
            });
    },
    indexView: (req, res) => {
        res.render("users/index");
    },
    new: (req, res, next) => {
        res.render("users/new");
    },
    show: (req, res, next) => {
        let userID = req.params.id;
        User.findById(userID)
            .then(user => {
                res.locals.user = user;
                next();
            })
            .catch(error => {
                console.log(`[SHOW] Error fetching user by ID: ${error.message}`);
                next(error);
            });
    },
    showView: (req, res) => {
        res.render("users/show");
    },
    edit: (req, res) => {
        let userID = req.params.id;
        User.findById(userID)
            .then(user => {
                res.render("users/edit", {user: user});
            })
            .catch(error => {
                console.log(`[EDIT] Error fetching user by ID: ${error.message}`);
                next(error);
            });
    },
    create: (req, res, next) => {
        let newUser = new User({
            name: {
                first: req.body.first,
                last: req.body.last
            }, 
            email: req.body.email,
            password: req.body.password,
            zipCode: req.body.zipCode
        });
        User.create(newUser)
            .then(user => {
                res.locals.user = user;
                res.locals.redirect = "/users";
                next();
            })
            .catch(error => {
                console.log(`[CREATE] Error creating new User: ${error.message}`);
                next(error);
            });
    },
    update: (req, res, next) => {
        let userID = req.params.id;
        let userParams = {
            name: {
                first: req.body.first,
                last: req.body.last
            },
            email: req.body.email,
            password: req.body.password,
            zipCode: req.body.zipCode
        };
        User.findByIdAndUpdate(userID, {
            $set: userParams
        })
            .then(user => {
                res.locals.user = user;
                res.locals.redirect = `/users/${userID}`;
                next();
            })
            .catch(error => {
                console.log(`[UPDATE] Error finding User by ID: ${error.message}`);
                next(error);
            });
    },
    delete: (req, res, next) => {
        let userID = req.params.id;
        User.findByIdAndRemove(userID)
            .then(() => {
                res.locals.redirect = "/users";
                next();
            })
            .catch(error => {
                console.log(`[DELETE] Error finding user by ID: ${error.message}`);
                next(error);
            });
    },
    redirectView: (req, res) => {
        let redirectPath = res.locals.redirect;
        if(redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    }
}