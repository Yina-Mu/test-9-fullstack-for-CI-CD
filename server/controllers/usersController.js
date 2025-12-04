const { getAllUsers } = require("../dao/users");

const getAllSafeUsers = (req, res) => {
  const users = getAllUsers();

  const safeUsers = users.map((u) => ({ id: u.id, email: u.email }));
  return res.status(200).json({ users: safeUsers });
};

module.exports = { getAllSafeUsers };
