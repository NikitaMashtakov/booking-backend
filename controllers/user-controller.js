const bcrypt = require("bcrypt");
const User = require("../models/User");
const roles = require("../constants/roles");
const { generate } = require("../helpers/token");

//register

async function register(login, email, name, profilePhoto, password,  role, currency) {
  if (role === roles.ADMIN) {
    throw new Error("Incorrect role");
  }

  if (!password) {
    throw new Error("Password is empty");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
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
  const user = await User.findOne({ login });

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

function deleteUser(id) {
  return User.deleteOne({ _id: id });
}
// edit role

function updateUser(id, userData) {
  if (userData.role){
    return User.findByIdAndUpdate(id, {$push: {role: userData.role}});
  }
  return User.findByIdAndUpdate(id, userData, { returnDocument: "after" });
}

module.exports = {
  register,
  login,
  deleteUser,
  updateUser,
};
