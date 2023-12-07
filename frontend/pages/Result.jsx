import axios from "axios";
import { useEffect, useState, useRef } from "react";

function Result() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  

  const isMounted = useRef(false);
  useEffect(() => {
    if (!isMounted.current){
      isMounted.current = true;
      const getResults = async () => {
        try {
          const accessToken = localStorage.getItem('accessToken');
          
          
          const existingPlaylist = JSON.parse(localStorage.getItem("existingPlaylist"));
          console.log("Existing Playlist results page:", existingPlaylist);
          if (existingPlaylist) {
            setResults(existingPlaylist);
            setLoading(false);
            return;
  
          } 
            
          let targetVariance = location.state ? location.state.targetVariance : 0.5;
  
          targetVariance = Math.min(1, Math.max(0, parseFloat(targetVariance)));
  
          const response = await axios.get(
            `http://localhost:8888/recommendations?accessToken=${accessToken}&target_valence=${targetVariance}`
          );
            
         
            
            localStorage.setItem("existingPlaylist", JSON.stringify(response.data));
  
            setResults(response.data);
            setLoading(false);
           
    
        }catch (err) {
          setError(true);
        }  
      }

          getResults();
    }   
    
    //console.log('Results page- before calling getResults()');
    
  }, []);

  /*<h1>Results</h1>
  {results && (
    <div>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  )}*/

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
            <h2>Spotify Playlist Link: <a href={results.external_urls.spotify} target="_blank" rel="noopener noreferrer">{results.external_urls.spotify}</a></h2>
          )}
    
          
      </div>
      
      
      
    </>
  );
}

export default Result;
