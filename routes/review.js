const express = require('express');
const {
  addReview,
  deleteReview,
  getReviews,
  getReview,
  createReply,
} = require('../controllers/review-controller');
const authenticated = require('../middlewares/authenticated');
const hasRole = require('../middlewares/hasRole');
const ROLES = require('../constants/roles');

const router = express.Router({ mergeParams: true });

router.post('/', authenticated, hasRole([ROLES.USER]), async (req, res) => {
  const newReview = await addReview(req.params.id, req.body);
  res.send({ data: newReview });
});

router.delete('/:id', authenticated, hasRole([ROLES.USER]), async (req, res) => {
  await deleteReview(req.params.id);
  res.send({ error: null });
});

router.get('/:id', authenticated, hasRole([ROLES.USER]), async (req, res) => {
  const review = await getReview(req.params.id);
  res.send({ data: review });
});
