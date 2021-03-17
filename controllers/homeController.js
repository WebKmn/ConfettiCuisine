"use strict";

var courses = [
    {
        title: "Raspberry cake",
        cost: 50
    },
    {
        title: "Artichoke",
        cost: 15
    },
    {
        title: "Burger",
        cost: 70
    },
]

exports.showCourses = (req, res) => {
    res.render("courses", {offeredCourses: courses});
};

exports.showSignUp = (req, res) => {
    res.render("contact");
};

exports.showIndex = (req, res) => {
    res.render("index");
};

exports.postedSignUpForm = (req, res) => {
    res.render("thanks");
};