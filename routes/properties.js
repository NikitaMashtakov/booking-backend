const express = require('express');
const {
  createProperty,
  editProperty,
  deleteProperty,
  getPropertyWithReviews,
  getProperties,
  getPropertiesLocations,
} = require('../controllers/property-controller');
const authenticated = require('../middlewares/authenticated');

const router = express.Router({ mergeParams: true });

router.post('/', authenticated, async (req, res) => {
  const newProperty = await createProperty({ ...req.body, user: req.user._id });
  res.send({ data: newProperty });
});
router.get('/locations', async (req, res) => {
  const properties = await getPropertiesLocations();
  res.send({ data: properties });
});

router.patch('/:id', authenticated, async (req, res) => {
  const newProperty = await editProperty({ id: req.params.id, ...req.body });
  res.send({ data: newProperty });
});

router.delete('/:id', authenticated, async (req, res) => {
  await deleteProperty(req.params.id);
});

router.get('/:id', async (req, res) => {
  const property = await getPropertyWithReviews(req.params.id);
  res.send({ data: property });
});

router.get('/', async (req, res) => {
  const properties = await getProperties(
    req.query.city,
    req.query.country,
    req.query.startDate,
    req.query.endDate,
    req.query.guests,
    req.query.page,
    req.query.limit,
  );
  res.send({ data: properties });
});

module.exports = router;
