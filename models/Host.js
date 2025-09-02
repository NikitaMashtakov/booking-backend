const mongoose = require("mongoose");
const roles = require("../constants/roles");
const validator = require("validator");

const HostSchema = mongoose.Schema(
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
      default: roles.HOST,
    },
    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
    currency: {
      type: String,
      required: true,
      default: "RUB",
    },
  },
  { timestamps: true }
);

const Host = mongoose.model("Host", HostSchema);

module.exports = Host;
