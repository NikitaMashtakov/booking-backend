const express = require("express");
// const {
//   getUsers,
//   getRoles,
//   updateUser,
//   deleteUser,
// } = require("../controllers/user");
// const hasRole = require("../middlewares/hasRole");
const {updateUser} = require("../controllers/user-controller");
const authenticated = require("../middlewares/authenticated");
const isCurrentUser = require("../middlewares/isCurrentUser");
const mapUser = require("../helpers/mapUser");
const ROLES = require("../constants/roles");

const router = express.Router({ mergeParams: true });

// router.get("/", authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
//   const users = await getUsers();

//   res.send({ data: users.map(mapUser) });
// });

// router.get("/roles", authenticated, hasRole([ROLES.ADMIN]), (req, res) => {
//   const roles = getRoles();

//   res.send({ data: roles });
// });

router.patch(
  "/:id",
  authenticated,
  isCurrentUser || hasRole([ROLES.ADMIN]),
  async (req, res) => {
    const newUser = await updateUser(req.user.id, {
      role: req.body.role,
    });

    res.send({ data: newUser });
  }
);

// router.delete(
//   "/:id",
//   authenticated,
//   hasRole([ROLES.ADMIN]),
//   async (req, res) => {
//     await deleteUser(req.params.id);

//     res.send({ error: null });
//   }
// );

module.exports = router;
