"use strict";

const express = require("express"),
    app = express(),
    router = express.Router(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    User = require("./models/user"),
    cookieParser = require("cookie-parser"),
    connectFlash = require("connect-flash"),
    layouts = require("express-ejs-layouts"),
    methodOverride = require("method-override"),
    expressSession = require("express-session"),
    expressValidator = require("express-validator"),
    homeController = require("./controllers/homeController"),
    errorController = require("./controllers/errorController"),
    usersController = require("./controllers/usersController"),
    coursesController = require("./controllers/coursesController"),
    subscribersController = require("./controllers/subscribersController");

mongoose.set("useCreateIndex", true);
mongoose.connect("mongodb://localhost:27017/confetti_cuisine", {useNewUrlParser: true});

const db = mongoose.connection;
db.once("open", () => {
    console.log("Success connecting to MongoDB using Mongoose!");
});

app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);
app.use("/", router);

router.use(layouts);
router.use(express.json());
router.use(express.static("public"));
router.use(
    express.urlencoded({
        extended: false
    })
);
router.use(methodOverride("_method", {
    methods: ["POST", "GET"]
}));

router.use(expressValidator());
router.use(cookieParser("secret_passcode"));
router.use(expressSession({
    secret: "secret_passcode",
    cookie: {
        maxAge: 400000
    },
    resave: false,
    saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.use(connectFlash());
router.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    res.locals.flashMessages = req.flash();
    next();
})

router.use(homeController.logRequestPaths);

router.get("/", homeController.index);

router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post("/users/create", usersController.validate, usersController.create, usersController.redirectView);
router.get("/users/login", usersController.login);
router.post("/users/login", usersController.authenticate);
router.get("/users/logout", usersController.logout, usersController.redirectView);

router.get("/users/:id/edit", usersController.edit);
router.get("/users/:id", usersController.show, usersController.showView);
router.put("/users/:id/update", usersController.validate, usersController.update, usersController.redirectView);
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView);

router.get("/courses", coursesController.index, coursesController.indexView);
router.get("/courses/new", coursesController.new);
router.post("/courses/create", coursesController.create, coursesController.redirectView);

router.get("/courses/:id", coursesController.show, coursesController.showView);
router.get("/courses/:id/edit", coursesController.edit, coursesController.editView);
router.put("/courses/:id/update", coursesController.update, coursesController.redirectView);
router.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView);

router.get("/subscribers", subscribersController.index, subscribersController.indexView);
router.get("/subscribers/new", subscribersController.new);
router.post("/subscribers/create", subscribersController.create, subscribersController.redirectView);

router.get("/subscribers/:id/edit", subscribersController.edit);
router.get("/subscribers/:id", subscribersController.show, subscribersController.showView);
router.put("/subscribers/:id/update", subscribersController.update, subscribersController.redirectView);
router.delete("/subscribers/:id/delete", subscribersController.delete, subscribersController.redirectView);

router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
    console.log(`Server is listening on port: ${app.get("port")}`);
});