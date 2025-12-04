// middlewares/auth.js
const jwt = require("jsonwebtoken");
// 用 jwt.verify() 验证 token，验证通过后调用 next()。

module.exports = (req, res, next) => {
  // 从req.headers中提取authorization
  const authHeader = req.headers.authorization;

  // 没有authHeader -> return 401
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // 有authHeader -> 判断 authHeader valid or not?
  // 如果authHeader不是由两部分组成 || 如果authHeader 不是start with "Bearer"
  const parts = authHeader.split(" ");
  // authHeader invlid
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status().json({ message: "Token is invalid!" });
  }
  // authHeader valid, 则提取token
  const token = parts[1];

  try {
    // 用login时候生成token的同一个 secret key 来验证token: 是否被篡改，过期，格式是否正确，secret key是否匹配
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // decoded 构成：id, email, iat(时间1), exp(时间2)

    // 把decoded token 挂到 req.user 上
    req.user = decoded;

    return next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/* 
req = {
  method: "GET",
  url: "/api/users",
  headers: {    
    authorization: "Bearer xxxxxx.yyyyyy.zzzzzz",      // 我们通常通过 parse req.headers.authorization 来得到 token
    ...
  },
  body: {       // 我们通常通过 parse req.body 来deconstructed 出来 email and password
    email, 
    password
    },             
  params: {},
  query: {},
  
  // ⭐ authenticate middleware 新增的字段：
  user: {
    id: 1,
    email: "abc@test.com",
    iat: 1733090000,
    exp: 1733093600
  },
  ...
}
*/
