const mongoose = require("mongoose");
const roles = require("../constants/roles");
const validator = require("validator");

const UserSchema = mongoose.Schema(
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
    },
    emailIsVerified: {
      type: Boolean,
      default: false,
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
      type: [String],
      enum: [roles.GUEST, roles.HOST, roles.ADMIN],
      default: [roles.GUEST],
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
    preferredCurrency: {
      type: String,
      default: "RUB",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
