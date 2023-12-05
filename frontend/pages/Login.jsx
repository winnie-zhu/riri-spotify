function Login() {
  const handleLogin = async () => {
    window.location = "http://localhost:8888/login";
  };

  return (
    <>
      <h1>Login with Spotify</h1>
      <button onClick={handleLogin}>Login with Spotify</button>
    </>
  );
}

export default Login;
