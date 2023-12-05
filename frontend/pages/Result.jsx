import axios from "axios";
import { useEffect, useState } from "react";

function Result() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getResults = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios.get("http://localhost:8888/results", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        setResults(response.data);
        setLoading(false);
      } catch (err) {
        setError(true);
      }
    };
    getResults();
  }, []);


  return (
    <>
      <h1>Results</h1>
    </>
  );
}

export default Result;
