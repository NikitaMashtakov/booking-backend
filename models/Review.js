const mongoose = require('mongoose');
const validator = require('validator');

const ReviewSchema = mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    text: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    images: {
      type: String,
      validate: {
        validator: validator.isURL,
        message: 'Image should be a valid URL',
      },
    },
    reply: {
      type: String,
    },
  },
  { timestamps: true },
);

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
