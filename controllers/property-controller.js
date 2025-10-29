const Property = require('../models/Property');
const User = require('../models/User');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const mongoose = require('mongoose');

async function getPropertiesLocations() {
  console.log('getPropertiesLocations');
  const properties = await Property.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $project: { _id: 0, geo: 1 } },
    {
      $group: {
        _id: { city: '$geo.city', country: '$geo.country' },
      },
    },
    {
      $project: {
        _id: 0,
        city: '$_id.city',
        country: '$_id.country',
      },
    },
  ]);
  return properties;
}

async function createProperty({
  title,
  description,
  geo,
  price,
  images,
  amenities,
  guestsCount,
  user,
}) {
  const host = await User.findById(user);
  if (host) {
    const newProperty = await Property.create({
      title,
      description,
      geo,
      price,
      images,
      amenities,
      host: user,
      guestsCount,
    });
    await newProperty.populate('host');
    return newProperty;
  }
}

async function editProperty({
  id,
  title,
  description,
  geo,
  price,
  images,
  amenities,
  guestsCount,
}) {
  const editedProperty = await Property.findByIdAndUpdate(
    id,
    {
      title,
      description,
      geo,
      price,
      images,
      amenities,
      guestsCount,
    },
    {
      returnDocument: 'after',
    },
  );
  console.log(editedProperty);
  return editedProperty;
}

async function deleteProperty(id) {
  await Property.findByIdAndUpdate(id, {
    isDeleted: true,
    deletedAt: new Date(),
    status: 'archived',
  });
}

async function getPropertyWithReviews(id) {
  if (!mongoose.isValidObjectId(id)) {
    const err = new Error('Invalid property id');
    err.status = 400;
    throw err;
  }

  const property = await Property.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id), isDeleted: { $ne: true } } },

    {
      $lookup: {
        from: 'reviews',
        let: { reviewIds: '$reviews' },
        pipeline: [
          { $match: { $expr: { $in: ['$_id', '$$reviewIds'] } } },

          // Join booking
          {
            $lookup: {
              from: 'bookings',
              localField: 'bookingId',
              foreignField: '_id',
              as: 'booking',
            },
          },
          { $unwind: { path: '$booking', preserveNullAndEmptyArrays: true } },

          {
            $lookup: {
              from: 'users',
              let: { gid: '$booking.guestId' },
              pipeline: [
                { $match: { $expr: { $eq: ['$_id', '$$gid'] } } },
                { $project: { _id: 0, name: 1, profilePhoto: 1 } },
              ],
              as: 'guest',
            },
          },

          { $set: { guest: '$guest' } },

          {
            $addFields: {
              bookingMonth: {
                $dateToString: { date: '$booking.checkIn', format: '%B %Y' },
              },
            },
          },

          {
            $project: {
              _id: 1,
              bookingId: 1,
              text: 1,
              rating: 1,
              images: 1,
              reply: 1,
              createdAt: 1,
              updatedAt: 1,
              guest: 1,
              bookingMonth: 1,

              // booking: 0,
            },
          },
        ],
        as: 'reviewsDetailed',
      },
    },
    {
      $lookup: {
        from: 'users',
        let: { hostId: '$host' },
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$hostId'] } } },
          { $project: { _id: 0, name: 1, profilePhoto: 1 } },
        ],
        as: 'host',
      },
    },

    {
      $project: {
        title: 1,
        description: 1,
        geo: 1,
        price: 1,
        images: 1,
        amenities: 1,
        host: '$host',
        guestsCount: 1,
        createdAt: 1,
        updatedAt: 1,
        reviews: '$reviewsDetailed',
      },
    },
  ]);

  if (!property) {
    const err = new Error('Property not found');
    err.status = 404;
    throw err;
  }

  return property;
}

async function getProperties(
  city,
  country,
  startDate,
  endDate,
  guests,
  page = 1,
  limit = 10,
) {
  try {
    const query = {};
    console.log('page', page);
    console.log('limit', limit);

    if (city) query['geo.city'] = new RegExp(city, 'i');
    if (country) query['geo.country'] = new RegExp(country, 'i');

    if (guests) query.guestsCount = { $gte: Number(guests) };

    let bookedPropertyIds = [];
    if (startDate && endDate) {
      const overlappingBookings = await Booking.find({
        $or: [
          {
            checkIn: { $lte: new Date(endDate) },
            checkOut: { $gte: new Date(startDate) },
          },
        ],
      }).select('propertyId');

      bookedPropertyIds = overlappingBookings.map((b) => b.propertyId);
      // const bookedPropertyIds = await Booking.distinct("propertyId", condition);
      query._id = { $nin: bookedPropertyIds };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const total = await Property.countDocuments(query);

    const properties = await Property.aggregate([
      { $match: query },

      // Compute reviewsCount and reviewsAvgRating from ratings of the property's reviews
      {
        $lookup: {
          from: 'reviews',
          let: { reviewIds: '$reviews' }, // reviews is an array of ObjectId
          pipeline: [
            { $match: { $expr: { $in: ['$_id', '$$reviewIds'] } } },
            { $group: { _id: null, count: { $sum: 1 }, avg: { $avg: '$rating' } } },
          ],
          as: 'reviewsStats',
        },
      },
      {
        $addFields: {
          reviewsCount: { $ifNull: [{ $first: '$reviewsStats.count' }, 0] },
          reviewsAvgRating: { $ifNull: [{ $first: '$reviewsStats.avg' }, null] },
        },
      },

      // Remove helper array; and (optionally) remove the raw reviews ids if you don't want them in the response
      {
        $project: {
          reviewsStats: 0,
          // reviews: 0, // <- uncomment to completely hide the raw reviews id list
        },
      },

      // basic stable ordering; adjust if you want sorting
      { $sort: { _id: 1 } },
      { $skip: skip },
      { $limit: Number(limit) },
    ]);

    return {
      total,
      page: page,
      limit: limit,
      results: properties,
    };
  } catch (err) {
    console.error(err);
    throw new Error('Server error');
  }
}

module.exports = {
  createProperty,
  editProperty,
  deleteProperty,
  getPropertyWithReviews,
  getProperties,
  getPropertiesLocations,
};
