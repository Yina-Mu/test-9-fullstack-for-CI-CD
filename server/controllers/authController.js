// controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { addUser, getAllUsers } = require("../dao/users");

// // 临时”数据库“：存用户的数据 => 移动到 dao/users.js 中了
// let users = []; // user: { id, email, hashedPassword }
// let nextUserId = 1;

// register: POST /api/auth/register
const register = async (req, res) => {
  // 从req 中取到 email and password
  // 1.1 Deconstructure email and password from req.body
  const { email, password } = req.body;

  // 1.2 Validate the email and password: 不可以为空
  if (!email || !password) {
    return res.status(400).json({
      message: "Email or password are required.",
    });
  }
  // 1.3 (optional) 使用 getAllUser() 来查重，避免重复register
  const existingUser = getAllUsers().find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      message: "Email already registered!",
    });
  }

  try {
    // 2. Hash the password:
    // 2.1 Using bcypt.genSalt to generate the Salt, cost factor = 10
    const salt = await bcrypt.genSalt(10); //salt: 一段随机string, 代表计算轮数

    // 2.2 Using bcrypt.hash with async hashing the password or bcypt.hashSync as sync hashing password
    const hashedPassword = await bcrypt.hash(password, salt); //todo

    // 3. Stores the user in an in-memory array
    // 3.1 Consist of a new user object
    // 3.2 Stores the newUser in users[]
    const newUser = addUser(email, hashedPassword);

    // 4. Make response to front-end
    return res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.log("Error during registration:", err);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

// TODO: 实际开发中全是异步函数吗？
const login = async (req, res) => {
  // 1.1 获取email, password from req.body
  const { email, password } = req.body;

  // 1.2 检查email and password 格式是否正确 => todo: 这里实际生产中应该使用Zod吗?
  if (!email || !password) {
    return res.status(401).json({ error: "Email and password are required!" });
  }
  try {
    // 2.1 从 user[] 中查找是否存在这个user based on email
    const currUser = getAllUsers().find((u) => u.email === email);
    // 如果找不到currUser
    if (!currUser) {
      return res
        .status(404)
        .json({ message: "User not found! Please register first!" });
    }
    // 如果找到了currUser, 就要进行password 比较了
    // 2.2 bcrypt.compare()来比较user input password + salt + hashed with database 中 stored hashedPassword
    const isMatch = await bcrypt.compare(password, currUser.hashedPassword); // Todo: 不需要输入指定的规则吗？=> 不需要, bcrypt.compare()自己会使用和bcrypt.hash()一样的规则
    // 3.1 匹配不成功，password isMatch = false，返回 401
    if (!isMatch) {
      return res.status(401).json({ error: "Password is not correct!" });
    }
    // 3.2.1 匹配成功，password isMatch = true，则返回200
    // todo: 使用jwt.sign() to create a token => 那么使用???来验证token是否valid呢？
    // 3.2.2 定义payload (写入token里的东西)
    const payload = {
      id: currUser.id,
      email: currUser.email,
    };
    // 3.2.3 create a token using jwt.sign()
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h", // 设置token 有效期为 1h
    });

    return res.status(200).json({
      message: "Login successful!",
      user: { id: currUser.id, email: currUser.email },
      token,
    });
  } catch (err) {
    console.log("", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
module.exports = { register, login };
