const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Review = require('../models/Review');

//add
async function addReview(postId, comment) {
  const newComment = await Comment.create(comment);

  await Post.findByIdAndUpdate(postId, { $push: { comments: newComment } });

  await newComment.populate('author');

  return newComment;
}
//delete

async function deleteReview(postId, commentId) {
  await Comment.deleteOne({ _id: commentId });
  await Post.findByIdAndUpdate(postId, { $pull: { comments: commentId } });
}

async function getReviews(propertyId) {
  const reviews = await Review.find({ propertyId });
  return reviews;
}

async function getReview(reviewId) {
  const review = await Review.findById(reviewId);
  return review;
}

async function createReply(reviewId, reply) {
  const newReply = await Review.create(reply);
  await Review.findByIdAndUpdate(reviewId, { $push: { reply: newReply } });
  return newReply;
}

module.exports = {
  addReview,
  deleteReview,
  getReviews,
  getReview,
  createReply,
};
