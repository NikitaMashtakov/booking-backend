const bcrypt = require("bcrypt");
const Guest = require("../models/Guest");
const { generate } = require("../helpers/token");

//register

async function register(login, email, name, profilePhoto, password,  role, currency) {
  if (!password) {
    throw new Error("Password is empty");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await Guest.create({
    login,
    email,
    name,
    profilePhoto,
    password: passwordHash,
    role,
    currency
  });

  const token = generate({ id: user.id });

  return { user, token };
}
//login

async function login(login, password) {
  const user = await Guest.findOne({ login });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Wrong password");
  }

  const token = generate({ id: user.id });

  return { user, token };
}

//delete

function deleteGuest(id) {
  return Guest.deleteOne({ _id: id });
}
// edit role

function updateGuest(id, userData) {
  console.log("userdata", userData);
  return User.findByIdAndUpdate(id, userData, { returnDocument: "after" });
}

module.exports = {
  register,
  login,
  deleteGuest,
  updateGuest,
};
