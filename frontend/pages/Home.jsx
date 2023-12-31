import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; //
import "./design.css";
import moods from "./mood-faces-home.png";
import logo from "./logo.png";

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

  const handleLogin = async () => {
    window.location = "http://localhost:8888/login";
  };

  //change 2
  const [targetValence, setTargetValence] = useState(0);
  const navigate = useNavigate();
  //

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
  };
  //change 3 and 4
  const handleInputChange = (event) => {
    //valid number between 0 and 1
    const inputValue = parseFloat(event.target.value);
    if (!isNaN(inputValue) && inputValue >= 0 && inputValue <= 1) {
      setTargetValence(inputValue);
    }
  };

  const handleLinkClick = () => {
    if (!targetValence.isNaN) {
      localStorage.setItem("targetValence", targetValence);
      navigate("/results");
    } else {
      console.error("Invalid input for targetValence");
    }
  };

  //end change 3 and 4

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
  };
  return (
    <>
      <img height={"20px"} src={logo} className="logo"></img>

      {loggedIn ? (
        <>
          <div id="mood-buttons">
            <div class="mood-button">
              <img
                class="mood"
                src="../src/assets/img/0.1.png"
                alt="Button 1"
              />
              <p class="mood-name">crying</p>
            </div>

            <div class="mood-button">
              <img
                class="mood"
                src="../src/assets/img/0.3.png"
                alt="Button 2"
              />
              <p class="mood-name">sad</p>
            </div>

            <div class="mood-button">
              <img
                class="mood"
                src="../src/assets/img/0.5.png"
                alt="Button 3"
              />
              <p class="mood-name">chill</p>
            </div>

            <div class="mood-button">
              <img
                class="mood"
                src="../src/assets/img/0.7.png"
                alt="Button 4"
              />
              <p class="mood-name">happy</p>
            </div>

            <div class="mood-button">
              <img
                class="mood"
                src="../src/assets/img/0.9.png"
                alt="Button 5"
              />
              <p class="mood-name">ecstatic</p>
            </div>
          </div>
          Enter your mood (0 to 1):
          <input
            type="number"
            step="0.1"
            value={targetValence}
            onChange={handleInputChange}
          />
          <div class="button-container">
            <button class="generate-button" onClick={handleLinkClick}>
              Generate playlist
            </button>
          </div>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        // <>

        // </>
        <div className="logged-in">
          <img width={"500px"} src={moods} className="moods-home"></img>
          <button onClick={handleLogin}>Login with Spotify</button>
        </div>
      )}
    </>
  );
}

export default Home;
