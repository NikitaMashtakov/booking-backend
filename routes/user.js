const express = require('express');
const { updateUser, getUser } = require('../controllers/user-controller');
const authenticated = require('../middlewares/authenticated');
const isCurrentUser = require('../middlewares/isCurrentUser');
const mapUser = require('../helpers/mapUser');
const ROLES = require('../constants/roles');

const router = express.Router({ mergeParams: true });

router.get('/me', authenticated, isCurrentUser, async (req, res) => {
  const user = await getUser(req.user.id);

  res.send({ data: mapUser(user) });
});

router.patch(
  '/:id',
  authenticated,
  isCurrentUser || hasRole([ROLES.ADMIN]),
  async (req, res) => {
    const newUser = await updateUser(req.user.id, {
      role: req.body.role,
    });

    res.send({ data: newUser });
  },
);

module.exports = router;
