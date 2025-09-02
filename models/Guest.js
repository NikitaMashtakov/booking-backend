const mongoose = require("mongoose");
const roles = require("../constants/roles");
const validator = require("validator");

const GuestSchema = mongoose.Schema(
  {
    login: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Email should be a valid email",
      },
      verified: {
        type: Boolean,
        default: false,
      },
    },
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
      },
    },
    profilePhoto: {
      type: String,
      validate: {
        validator: validator.isURL,
        message: "Profile photo should be a valid URL",
      },
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: roles.GUEST,
    },
    currency: {
      type: String,
      required: true,
      default: "RUB",
    },
  },
  { timestamps: true }
);

const Guest = mongoose.model("Guest", GuestSchema);

module.exports = Guest;
