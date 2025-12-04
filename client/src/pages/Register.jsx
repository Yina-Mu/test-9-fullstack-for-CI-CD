import { useState } from "react";
// Follow up Q1: 为啥这个component不用useEffect hook?
// useEffect(): 当component 加载 / 某个state or prop change 时自动发生的 (happen automatically)
// handleRegister(): 是user click a button 时发生的 (user manually)

// Follow up Q3: 为啥全是 async function?
// 在 现代 JS/TS 项目里，只要涉及「对外通信 / I/O」的地方，几乎都会是 async function。

// POST http://localhost:3000/api/auth/register
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("No message");

  const handleRegister = async () => {
    try {
      // 1. 使用await fetch 向后端发送特定格式的req, 并将response存入res中
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // 所以这是将email and password 组成的一个object => string 放入body中
      });

      // 2. 使用.json() parse res 并且stores in data;
      const data = await res.json(); // 获取从后端返回来的res并parse成JSON object,
      console.log("Response data from backend:", data);

      // 3. 判断backend res is ok or not, if not ok, setMessage and stop execution of this function
      // 如果后端返回的不是200/201, 而是返回400/401/404/500
      if (!res.ok) {
        //res.ok: Response object 一个内置属性，根据 status code 自动算出来的，if status code in 200-299, ok===true; otherwise, ok===false.
        setMessage(`Register failed: ${data.message}`);
        return;
      }

      // 4. if res is ok, setMessage, clean up input fields
      // 如果后端返回的是 200/201 => 成功
      setMessage(`Register success: ${data.message}`);

      // clean up input fields
      setEmail("");
      setPassword("");
    } catch (err) {
      // 5. finally, catch errors if the front-end did not get response object successfully from backend
      // 如果后端没有返回response
      console.error("Register error:", err);
      // Follow up Q2: 这个err到底是什么？应该是捕获了从后端返回来的一个内容 => ❌ 不对。
      // ✅ 正确答案：
      // eg. 1) 服务器地址写错，域名不存在/端口没开；2) 服务器挂了，完全连不上；
      // 3) 请求被浏览器拦截(某些CORS情况)；4) 手动取消请求；5) 返回的内容不是合法的JSON导致的res.json()抛错。
      setMessage("Network error:", err);
    }
  };

  return (
    <div className="box">
      <div className="form-row">
        <label htmlFor="register-email">Email:</label>
        <input
          id="register-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
      </div>

      <div className="form-row">
        <label htmlFor="register-password">Password:</label>
        <input
          id="register-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </div>
      <button onClick={handleRegister}>Register</button>
      {/* result message */}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default Register;
