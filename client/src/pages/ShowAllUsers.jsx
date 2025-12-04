import { useState } from "react";

// GET http://localhost:3000/api/users
const ShowAllUsers = () => {
  const [message, setMessage] = useState("No message");
  const [users, setUsers] = useState([]);

  // Todo: 从localStorage中读取token
  const token = localStorage.getItem("token");

  const handleFetchAllUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(`Response error: ${data.message}`);
      }

      // If response is ok
      setUsers(data.users);
    } catch (err) {
      setMessage("Get response failed:", err);
      console.log(`Get response failed: ${err}`);
    }
  };
  return (
    <div className="box">
      <button onClick={handleFetchAllUsers}>ShowAllUsers</button>
      <div className="user-list-palceholder">
        (All users will be shown here)
      </div>
      <ol>
        {users.map((user) => (
          <li key={user.id}>
            {user.id} - {user.email}
          </li>
        ))}
      </ol>
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default ShowAllUsers;
