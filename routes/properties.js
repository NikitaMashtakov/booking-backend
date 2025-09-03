const express = require("express");
const { createProperty } = require("../controllers/property-controller");

const router = express.Router({ mergeParams: true });

router.post("/", async (req, res) => {
  const newProperty = await createProperty(req.body);
  res.send({ data: newProperty });
});

module.exports = router;