const mongoose = require("mongoose");

const PaymentSchema = mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["card", "cash"],
    default: "card",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
});

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;
