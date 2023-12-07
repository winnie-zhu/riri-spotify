import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; //

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

  //change 2
  const [targetVariance, setTargetVariance] = useState("");
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
  }
  //change 3 and 4
  const handleInputChange = (event) => {
    //valid number between 0 and 1
    const inputValue = parseFloat(event.target.value);
    if (!isNaN(inputValue) && inputValue >= 0 && inputValue <= 1) {
      setTargetVariance(inputValue);
    }
  };

  const handleLinkClick = () => {

    if (targetVariance !== "") {
      console.log('before navigate');
      navigate("/results", { state: { targetVariance: targetVariance } });
    } else {
  
      console.error("Invalid input for targetVariance");
    }
  };
  
  //end change 3 and 4

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
  };
  //<Link to="/results">Results</Link>
  return (
    <>
      <h1>Home</h1>
      {loggedIn ? (
        <>
          Enter your mood (0 to 1):
          <input type="number" step="0.1" value={targetVariance} onChange={handleInputChange} />
          
          <button onClick={handleLinkClick}>Go to Results</button>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </>
  );
}

export default Home;
