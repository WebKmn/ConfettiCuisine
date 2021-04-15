"use strict";

const User = require("../models/user"),
    passport = require("passport"),
    getUserParams = body => {
        return {
            name: {
                first: body.first,
                last: body.last
            },
            email: body.email,
            password: body.password,
            zipCode: body.zipCode
        };
    };

module.exports = {
    login: (req, res) => {
        res.render("users/login");
    },
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
        if (req.skip ) return next();
        let newUser = new User(getUserParams(req.body));
        User.register(newUser, req.body.password, (error, user) => {
            if (user) {
                console.log(`[CREATE] Success creating new User: ${user.fullName}`);
                req.flash("success", `${user.fullName}'s Account created!`);
                res.locals.user = user;
                res.locals.redirect = "/users";
                next();
            } else {
                console.log(`[CREATE] Error creating new User: ${error.message}`);
                req.flash("error", `Failed to create user account: ${error.message}!`);
                res.locals.redirect = "/users/new"
            }
        });
    },
    validate: (req, res, next) => {
        req.sanitizeBody("email").normalizeEmail({
            all_lowercase: true
        }).trim();
        req.check("email", "Email is invalid").isEmail();
        req.check("zipCode", "Zip Code is invalid").notEmpty().isInt().isLength({
            min: 5,
            max: 5
        });
        req.check("password", "Password cannot be empty").notEmpty();

        req.getValidationResult()
            .then((error) => {
                if (!error.isEmpty()) {
                    let messages = error.array().map(e => e.msg);
                    req.flash("error", messages.join(" and "));
                    req.skip = true;
                    res.locals.redirect = "/users/new";
                    next();
                } else {
                    next();
                }
            });
    },
    update: (req, res, next) => {
        if (req.skip ) return next();

        let userID = req.params.id;
        let userParams = getUserParams(req.body);
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
    authenticate: passport.authenticate("local", {
        failureRedirect: "users/login",
        failureFlash: "login Failed!",
        successRedirect: "/",
        successFlash: "Logged In!"
    }),
    logout: (req, res, next) => {
        req.logout();
        req.flash("success", "You have been logged out!");
        res.locals.redirect = "/";
        next();
    },
    redirectView: (req, res) => {
        let redirectPath = res.locals.redirect;
        if(redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    }
}