import axios from "axios";
import { useEffect, useState, useRef } from "react";

function Result() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isMounted = useRef(false);
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      const getResults = async () => {
        try {
          const accessToken = localStorage.getItem("accessToken");

          const existingPlaylist = JSON.parse(
            localStorage.getItem("existingPlaylist")
          );

          const valence = localStorage.getItem("targetValence");
          console.log("valence:", valence)
          console.log("Existing Playlist results page:", existingPlaylist);
          if (existingPlaylist) {
            setResults(existingPlaylist);
            setLoading(false); //
            return;
          }

          console.log(`http://localhost:8888/recommendations?accessToken=${accessToken}&targetValence=${valence}`);
          const response = await axios.get(
            `http://localhost:8888/recommendations?accessToken=${accessToken}&targetValence=${valence}`
          );

          localStorage.setItem(
            "existingPlaylist",
            JSON.stringify(response.data)
          );
          setResults(response.data);

          setLoading(false);
        } catch (err) {
          setError(true);
        }
      };

      getResults();
    }

    //console.log('Results page- before calling getResults()');
  }, []);

  /*{results && (
      <div>
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </div> 
    )}*/

  return (
    <>
      <h1>Results</h1>
      <div>
        <h2>Playlist name: {results.name}</h2>
        {results.owner && (
          <div>
            <h2>Owner: {results.owner.display_name}</h2>
          </div>
        )}
        {results.external_urls && (
          <h2>
            Spotify Playlist Link:{" "}
            <a
              href={results.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              {results.external_urls.spotify}
            </a>
          </h2>
        )}
      </div>

      {loading && <p>Loading...</p>}

      {results && !loading && !error && (
        <div>
          <iframe
            style={{ borderRadius: "12px" }}
            src={`https://open.spotify.com/embed/playlist/${results.id}?utm_source=generator`}
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="eager"
          ></iframe>
        </div>
      )}
    </>
  );
}

export default Result;
