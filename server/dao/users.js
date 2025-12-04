// dao/users.js
let users = []; // user: { id, email, hashedPassword }
let nextUserId = 1;

function addUser(email, hashedPassword) {
  const newUser = {
    id: nextUserId++,
    email,
    hashedPassword,
  };
  users.push(newUser);
  return newUser;
}

function getAllUsers() {
  return users;
}

module.exports = {
  addUser,
  getAllUsers,
};
