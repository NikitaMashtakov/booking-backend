const Booking = require('../models/Booking');
const mongoose = require('mongoose');
//add
async function createBooking({
  propertyId,
  guestId,
  checkIn,
  checkOut,
  guestsCount,
  totalPrice,
  createdBy,
}) {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  checkInDate.setHours(14, 0, 0, 0);
  checkOutDate.setHours(12, 0, 0, 0);

  const newBooking = await Booking.create({
    propertyId,
    guestId,
    checkIn,
    checkOut,
    guestsCount,
    totalPrice,
    createdBy,
  });

  return newBooking;
}

async function getGuestsBookings(guestId) {
  const bookings = await Booking.find({ guestId });
  return bookings;
}

async function getHostsBookings(hostId) {
  const bookings = await Booking.find({ hostId });
  return bookings;
}

async function getPropertyBookings(propertyId) {
  const bookings = await Booking.find({ propertyId });
  return bookings;
}

async function getBooking(bookingId) {
  const booking = await Booking.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(bookingId) } },
    {
      $lookup: {
        from: 'users',
        let: { gId: '$guestId' },
        pipeline: [
          { $match: { $expr: { $eq: ['$$gId', '$_id'] } } },
          { $project: { _id: 1, name: 1, profilePhoto: 1 } },
        ],
        as: 'guest',
      },
    },
    { $unwind: { path: '$guest', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'properties',
        let: { pId: '$propertyId' },
        pipeline: [
          { $match: { $expr: { $eq: ['$$pId', '$_id'] } } },
          {
            $project: {
              _id: 1,
              title: 1,
              geo: 1,
              host: 1,
              price: 1,
            },
          },
        ],
        as: 'property',
      },
    },
    { $unwind: { path: '$property', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'users',
        let: { hId: '$property.host' },
        pipeline: [
          { $match: { $expr: { $eq: ['$$hId', '$_id'] } } },
          { $project: { _id: 1, name: 1, profilePhoto: 1 } },
        ],
        as: 'host',
      },
    },
    { $unwind: { path: '$host', preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: 'payments',
        let: { pId: '$paymentId' },
        pipeline: [
          { $match: { $expr: { $eq: ['$$pId', '$_id'] } } },
          { $project: { _id: 1, paymentStatus: 1 } },
        ],
        as: 'payment',
      },
    },
    { $unwind: { path: '$payment', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        guest: '$guest',
        property: '$property',
        host: '$host',
        status: 1,
        checkIn: 1,
        checkOut: 1,
        totalPrice: 1,
        payment: '$payment',
      },
    },
  ]);
  return booking;
}

async function editBooking(bookingId, booking) {
  const newBooking = await Booking.findByIdAndUpdate(bookingId, booking, {
    returnDocument: 'after',
  });
  return newBooking;
}

async function confirmBooking(bookingId) {
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    {
      status: 'confirmed',
    },
    {
      returnDocument: 'after',
    },
  );
  return booking;
}

async function cancelBooking(bookingId) {
  const booking = await Booking.findByIdAndUpdate(bookingId, {
    status: 'cancelled',
  });
  return booking;
}

//edit
// async function editPost(id, post) {
//   const newPost = await Post.findByIdAndUpdate(id, post, {
//     returnDocument: "after",
//   });

//   await newPost.populate({
//     path: "comments",
//     populate: "author",
//   });

//   return newPost;
// }

// //delete
// function deletePost(id) {
//   return Post.deleteOne({ _id: id });
// }

// //get list with pagination and search
// async function getPosts(search = "", limit = 10, page = 1) {
//   const [posts, count] = await Promise.all([
//     Post.find({ title: { $regex: search, $options: "i" } })
//       .limit(limit)
//       .skip((page - 1) * limit)
//       .sort({ createdAt: -1 }),
//     Post.countDocuments({ title: { $regex: search, $options: "i" } }),
//   ]);

//   return {
//     posts,
//     lastPage: Math.ceil(count / limit),
//   };
// }

// //get item
// function getPost(id) {
//   return Post.findById(id).populate({
//     path: "comments",
//     populate: "author",
//   });
// }

module.exports = {
  createBooking,
  getGuestsBookings,
  getHostsBookings,
  getPropertyBookings,
  getBooking,
  editBooking,
  cancelBooking,
  confirmBooking,
};
