"use strict";

const mongoose = require("mongoose"),
    subscriberSchema = mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        zipCode: {
            type: Number,
            min: [10000, "ZipCode too short"],
            max: 99999
        },
        courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
    },{
        timestamps: true
    });

subscriberSchema.methods.getInfo = function() {
    return `Name: ${this.name} Email: ${this.email} ZipCode: ${this.zipCode}`;
}

module.exports = mongoose.model("subscriber", subscriberSchema);