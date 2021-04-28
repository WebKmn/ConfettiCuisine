"use strict";

const router = require("express").Router(),
    apiRoutes = require("./apiRoutes"),
    homeRoutes = require("./homeRoutes"),
    userRoutes = require("./usersRoutes"),
    errorRoutes = require("./errorRoutes"),
    courseRoutes = require("./coursesRoutes"),
    subscriberRoutes = require("./subscribersRoutes");

router.use("/api", apiRoutes);
router.use("/users", userRoutes);
router.use("/courses", courseRoutes);
router.use("/subscribers", subscriberRoutes);
router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;