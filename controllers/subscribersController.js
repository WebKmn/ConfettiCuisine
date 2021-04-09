"use strict";

const Subscriber = require("../models/subscriber");

module.exports = {
    index: (req, res, next) => {
        Subscriber.find({})
            .then(subList => {
                res.locals.subscribers = subList;
                next();
            })
            .catch(error => {
                console.log(`[INDEX] Error fetching subscriber data: ${error.message}`);
                next(error);
            });
    },
    indexView: (req, res) => {
        res.render("subscribers/index");
    },
    new: (req, res) => {
        res.render("subscribers/new");
    },
    create: (req, res, next) => {
        let newSub = new Subscriber({
            name: req.body.name,
            email: req.body.email,
            zipCode: req.body.zipCode
        });
        Subscriber.create(newSub)
            .then(sub => {
                res.locals.Subscriber = sub;
                res.locals.redirect = "/subscribers";
                next();
            })
            .catch(error => {
                console.log(`[CREATE] Error creating user: ${error.message}`);
                next(error);
            });
    },
    redirectView: (req, res) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },
    show: (req, res, next) => {
        let subID = req.params.id;
        Subscriber.findById(subID)
            .then(sub => {
                res.locals.subscriber = sub;
                next();
            })
            .catch(error => {
                console.log(`[SHOW] Error fetching subscriber by ID: ${error.message}`);
                next(error);
            });
    },
    showView: (req, res) => {
        res.render("subscribers/show");
    },
    edit: (req, res, next) => {
        let subID = req.params.id;
        Subscriber.findById(subID)
            .then(sub => {
                res.render("subscribers/edit", { subscriber: sub });
            })
            .catch(error => {
                console.log(`[EDIT] Error fetching subscriber by ID: ${error.message}`)
                next(error);
            });
    },
    update: (req, res, next) => {
        let subID = req.params.id;
        let subParams = {
            name: req.body.name,
            email: req.body.email,
            zipCode: req.body.zipCode
        };
        Subscriber.findByIdAndUpdate(subID, {
            $set: subParams
        })
            .then(sub => {
                res.locals.subscriber = sub;
                res.locals.redirect = `/subscribers/${sub._id}`;
                next();
            })
            .catch(error => {
                console.log(`[UPDATE] Error updating User by ID: ${error.message}`);
                next(error);
            });
    },
    delete: (req, res, next) => {
        let subID = req.params.id;
        Subscriber.findByIdAndRemove(subID)
            .then(() => {
                res.locals.redirect = "/subscribers";
                next();
            })
            .catch(error => {
                console.log(`[DELETE] Error deleting User by ID: ${error.message}`);
                next(error);
            });
    }
}