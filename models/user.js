"use strict";

const Subscriber = require("./subscriber"),
    passportLocalMongoose = require("passport-local-mongoose");

const mongoose = require("mongoose"),
    {Schema} = mongoose,
    userSchema = new Schema(
        {
            name: {
                first: {
                    type: String,
                    required: true
                },
                last: {
                    type: String,
                    required: true
                }
            },
            email: {
                type: String, 
                required: true
            },
            zipCode: {
                type: Number,
                min: [10000, "ZipCode too short"],
                max: 99999
            },
            courses: [{type: mongoose.Schema.Types.ObjectId, ref: "Course"}],
            subscribedAccount: {type: mongoose.Schema.Types.ObjectId, ref: "Subscriber"}
        },
        {
            timestamps: true
        }
    );

userSchema.virtual("fullName").get(function() {
    return `${this.name.first} ${this.name.last}`;
});

userSchema.pre("save", function(next) {
    let user = this;
    if (user.subscribedAccount == undefined){
        Subscriber.findOne({
            email: user.email
        })
        .then(sub => {
            user.subscribedAccount = sub;
            next();
        })
        .catch(error => {
            console.log(`Error in connecting subscriber account: ${error.message}`);
            next(error);
        });
    } else {
        next();
    }
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: "email"
});

module.exports = mongoose.model("User", userSchema);