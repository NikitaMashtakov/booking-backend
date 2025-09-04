const Property = require("../models/Property");
const User = require("../models/User");

async function createProperty({title, description, geo, price, images, amenities, guestsCount, user}) {
  const host = await User.findById(user);
  if (host) {const newProperty = await Property.create({
      title,
      description,
      geo,
      price,
      images,
      amenities,
      host: user,
      guestsCount,
    });
    await newProperty.populate("host");
    return newProperty;
  } 
}

module.exports = {
  createProperty,
};