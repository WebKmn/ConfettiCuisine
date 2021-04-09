"use strict";

const httpStatus = require("http-status-codes");

module.exports = {
    pageNotFoundError: (error, req, res) => {
        let errorCode = httpStatus.NOT_FOUND;
        console.error(error.stack);
    }, 
    internalServerError: (error, req, res, next) => {
        let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
        console.error(error.stack);
    } 
}