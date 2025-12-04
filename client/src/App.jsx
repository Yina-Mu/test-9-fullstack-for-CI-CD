import "./App.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ShowAllUsers from "./pages/ShowAllUsers";

function App() {
  return (
    <div className="container">
      {/* 上方左右布局 */}
      <div className="row">
        {/* 左侧 Register */}
        <div className="panel">
          <h2>Register</h2>
          <Register />
        </div>

        {/* 右侧 Login */}

        <div className="panel">
          <h2>Login</h2>
          <Login />
        </div>
      </div>

      {/* 下方 ShowAllUsers */}
      <div className="panel bottom-panel">
        <h2>Show All Users</h2>
        <ShowAllUsers />
      </div>
    </div>
  );
}

export default App;
