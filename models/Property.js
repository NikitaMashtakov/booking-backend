const mongoose = require("mongoose");
const validator = require("validator");

const PropertySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    geo: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    price: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
        validate: {
          validator: validator.isURL,
          message: "Image should be a valid URL",
        },
      },
    ],
    amenities: [
      {
        type: String,
        required: true,
      },
    ],
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Host",
      required: true,
    },
    guestsCount: {
      type: Number,
      required: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", PropertySchema);

module.exports = Property;
