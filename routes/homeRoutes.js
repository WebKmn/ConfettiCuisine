"use strict";

const router = require("express").Router(),
    homeController = require("../controllers/homeController");

router.use(homeController.logRequestPaths);
router.get("/", homeController.index);

module.exports = router;