"use strict";

const Course = require("../models/course"),
    User = require("../models/user"),
    httpStatus = require("http-status-codes");

module.exports = {
    index: (req, res, next) => {
        Course.find({})
            .then(courseList => {
                res.locals.courses = courseList;
                next();
            })
            .catch(error => {
                console.log(`[INDEX] Error fetching course data: ${error.message}`);
                next(error);
            });
    },
    indexView: (req, res) => {
        res.render("courses/index");
    },
    new: (req, res) => {
        res.render("courses/new");
    }, 
    show: (req, res, next) => {
        let courseID = req.params.id;
        Course.findById(courseID)
            .then(course => {
                res.locals.course = course;
                next();
            })
            .catch(error => {
                console.log(`[SHOW] Error fetching course by ID: ${error.message}`);
                next(error);
            });
    },
    showView: (req, res) => {
        res.render("courses/show");
    },
    edit: (req, res, next) => {
        let courseID = req.params.id;
        Course.findById(courseID)
            .then(course => {
                res.locals.course = course;
                next();
            })
            .catch(error => {
                console.log(`[EDIT] Error fetching course by ID: ${error.message}`);
                next(error);
            });
    },
    editView: (req, res) => {
        res.render("courses/edit");
    },
    create: (req, res, next) => {
        let newCourse = new Course({
            title: req.body.title,
            description: req.body.description,
            maxStudents: req.body.maxStudents,
            cost: req.body.cost
        });
        Course.create(newCourse)
            .then(course => {
                res.locals.course = course;
                res.locals.redirect = "/courses";
                next();
            })
            .catch(error => {
                console.log(`[CREATE] Error creating a new course: ${error.message}`);
                next(error);
            });
    },
    update: (req, res, next) => {
        let courseID = req.params.id;
        let courseParams = {
            title: req.body.title,
            description: req.body.description,
            maxStudents: req.body.maxStudents,
            cost: req.body.cost
        };
        Course.findByIdAndUpdate(courseID, {
            $set: courseParams
        })
            .then(course => {
                res.locals.course = course;
                res.locals.redirect = `/courses/${courseID}`;
                next();
            })
            .catch(error => {
                console.log(`[UPDATE] Error finding course by ID: ${error.message}`);
                next(error);
            });
    },
    delete: (req, res, next) => {
        let courseID = req.params.id;
        Course.findByIdAndRemove(courseID)
            .then(() => {
                res.locals.redirect = "/courses";
                next();
            })
            .catch(error => {
                console.log(`[DELETE] Error deleting course: ${error.message}`);
                next(error);
            });
    },
    redirectView: (req, res) => {
        let redirectPath = res.locals.redirect;
        if(redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },
    respondJSON: (req, res) => {
        res.json({
            status: httpStatus.OK,
            data: res.locals
        });
    },
    errorJSON: (error, req, res, next) => {
        let errorObj; 
        if (error) {
            errorObj = {
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            };
        } else {
            errorObj = {
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: "Unkown Error."
            }
        }
        res.json(errorObj);
    },
    join: (req, res, next) => {
        let courseId = req.params.id,
            currUser = req.user;
        
        if (currUser) {
            User.findByIdAndUpdate(currUser, {
                $addToSet: {
                    courses: courseId
                }
            })
            .then(() => {
                res.locals.success = true;
                next();
            })
            .catch(error => {
                next(error);
            });
        } else {
            res.locals.success = false;
            next(new Error("User Must be Logged in."));
        }
    },
    filterUserCourses: (req, res, next) => {
        let currUser = res.locals.currentUser;

        if (currUser) {
            let mappedCourses = res.locals.courses.map((course) => {
                let userJoined = currUser.courses.some((userCourse) => {
                    return userCourse.equals(course._id);
                });
                return Object.assign(course.toObject(), {joined: userJoined});
            });
            res.locals.courses = mappedCourses;
            next();
        } else {
            next();
        }
    }
}