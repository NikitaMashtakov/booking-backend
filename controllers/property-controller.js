const Property = require("../models/Property");

async function createProperty({title, description, geo, price, images, amenities, host, guestsCount, reviews}) {
  const newProperty = await Property.create({
    title,
    description,
    geo,
    price,
    amenities,
    guestsCount,
  });
  await newProperty.populate("host");
  return newProperty;
}

module.exports = {
  createProperty,
};