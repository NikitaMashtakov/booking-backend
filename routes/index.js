const express = require("express");

const router = express.Router({ mergeParams: true });

router.use("/", require("./auth"));
// router.use("/posts", require("./post"));
// router.use("/users", require("./user"));
router.use("/bookings", require("./booking"));
router.use("/properties", require("./properties"));
module.exports = router;
