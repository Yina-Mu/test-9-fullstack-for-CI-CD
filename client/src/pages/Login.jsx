import { useState, useEffect } from "react";

// POST http://localhost:3000/api/auth/login
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("No message");

  // (Extra points) Add a debounce for this component
  // Todo: Follow up Q1: Why use debounce?
  // 1. reduce the number of backend requests, protecting the server and improving user experience
  // 2. Avoid doing expensive work on very tiny change, to the app feels smoother.
  // typical use cases: 自动搜索，自动保存草稿，自动向后端发送requests，复杂计算，动画更新 => 少做重计算，少发requests给后端，少更新大UI

  const [debounceEmail, setDebounceEmail] = useState("");
  const [debouncePassword, setDebouncePassword] = useState("");

  // 1. add debounce for email
  useEffect(() => {
    // 每一次当emaiL change, 启动一个新的timer
    const timer = setTimeout(() => {
      // 如果500ms内没有再输入，才会执行setDebounceEmail()
      setDebounceEmail(email);
      console.log("Send email value with:", email);
    }, 500);

    // clearnup: 下次email再change时，清除上一次的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [email]); // emial change => 重新debounce

  // 2. add debounce for password
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncePassword(password);
      console.log("Send password value with:", password);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [password]);

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // 依然使用即时值 => handleLogin() 是user手动触发，而不是自动发送POST req to backend
      });
      const data = await res.json();

      // if the status code from the backend is not 200-299.
      if (!res.ok) {
        console.log(`Login failed: ${data.message}`);
        setMessage(`Login failed: ${data.message}`);
        return;
      }

      // if the status code from the backend is 200-299, parse data by .json()
      setMessage(`Login success!: ${data.message}`);

      // Todo: Add token to localStorage
      localStorage.setItem("token", data.token);
      console.log("Valid fetched user token", data.token);

      // clean up the input fields
      setEmail("");
      setPassword("");
    } catch (err) {
      console.log("Get response failed:", err);
      setMessage(`Get response failed: ${err}`);
    }
  };

  return (
    <div className="box">
      <div className="form-row">
        <label htmlFor="login-email">Email:</label>
        <input
          id="login-email"
          type="email"
          placeholder="Email"
          value={email} // ！必须用即时值，否则input field卡顿
          onChange={(e) => setEmail(e.target.value)}
        ></input>
      </div>
      {debounceEmail && <p>Check debounceEmail: {debounceEmail}</p>}

      <div className="form-row">
        <label htmlFor="login-password">Password:</label>
        <input
          id="login-password"
          type="password"
          placeholder="Password"
          value={password} // ！必须用即时值，否则input field卡顿
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </div>
      {debouncePassword && <p>Check debouncePassword: {debouncePassword}</p>}
      <button onClick={handleLogin}>Login</button>
      {/* 显示message */}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default Login;
