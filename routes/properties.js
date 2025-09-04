const express = require("express");
const { createProperty } = require("../controllers/property-controller");
const authenticated = require("../middlewares/authenticated");

const router = express.Router({ mergeParams: true });

router.post("/", authenticated, async (req, res) => {
  const newProperty = await createProperty({...req.body, user: req.user._id});
  res.send({ data: newProperty });
});

module.exports = router;