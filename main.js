"use strict";

const express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    User = require("./models/user"),
    router = require("./routes/index"),
    cookieParser = require("cookie-parser"),
    connectFlash = require("connect-flash"),
    layouts = require("express-ejs-layouts"),
    methodOverride = require("method-override"),
    expressSession = require("express-session"),
    expressValidator = require("express-validator");

mongoose.set("useCreateIndex", true);
mongoose.connect("mongodb://localhost:27017/confetti_cuisine", {useNewUrlParser: true});

const db = mongoose.connection;
db.once("open", () => {
    console.log("Success connecting to MongoDB using Mongoose!");
});

app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);

app.use(layouts);
app.use(express.json());
app.use(express.static("public"));
app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(methodOverride("_method", {
    methods: ["POST", "GET"]
}));

app.use(expressValidator());
app.use(cookieParser("secret_passcode"));
app.use(expressSession({
    secret: "secret_passcode",
    cookie: {
        maxAge: 400000
    },
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(connectFlash());
app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    res.locals.flashMessages = req.flash();
    next();
})

app.use("/", router);

app.listen(app.get("port"), () => {
    console.log(`Server is listening on port: ${app.get("port")}`);
});