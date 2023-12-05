import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const extractURLParams = (url) => {
  const params = new URLSearchParams(url.split("#")[1]);
  const paramsDict = {};
  for (const [key, value] of params.entries()) {
    paramsDict[key] = value;
  }
  return paramsDict;
};

function Home() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (window.location.hash) {
      const { access_token, token_type, expires_in } = extractURLParams(
        window.location.href
      );
      localStorage.clear();
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("tokenType", token_type);
      localStorage.setItem("expiresIn", expires_in);

      setLoggedIn(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const checkLogin = () => {
    if (localStorage.getItem("accessToken")) {
      setLoggedIn(true);
    }
  }

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
  };

  return (
    <>
      <h1>Home</h1>
      {loggedIn ? (
        <>
          Enter your mood
          <input type="text" />
          <Link to="/results">Results</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </>
  );
}

export default Home;
