import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  async function login(ev) {
    ev.preventDefault();
    await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    }).then((response) => {
      if (response.status === 200) {
        setRedirect(true); // Update the state to trigger a re-render
      } else {
        alert("Login failed");
      }
    });
  }

  // If redirect is true, navigate to the home page
  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <form className="login" onSubmit={login}>
        <h1>Login</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}