const express = require('express');
const { register, login } = require('../controllers/user-controller');
const mapUser = require('../helpers/mapUser');

const router = express.Router({ mergeParams: true });

router.post('/register', async (req, res) => {
  try {
    const { user, token } = await register({ ...req.body });
    res
      .cookie('token', token, { httpOnly: true })
      .send({ error: null, user: mapUser(user) });
  } catch (e) {
    res.send({ error: e.message || 'Unknown error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { user, token } = await login(req.body.login, req.body.password);
    res
      .cookie('token', token, { httpOnly: true })
      .send({ error: null, user: mapUser(user) });
  } catch (e) {
    res.send({ error: e.message || 'Unknown error' });
  }
});

router.post('/logout', (_, res) => {
  res.cookie('token', '', { httpOnly: true }).send({});
});

module.exports = router;
