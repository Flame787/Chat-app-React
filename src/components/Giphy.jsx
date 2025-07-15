import { useState, useEffect, useCallback } from "react";

import { Grid } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";

// GiphyFetch-library for fetching data from api (api-interaction made easier, uses 'fetch' internally):
const gf = new GiphyFetch(process.env.REACT_APP_GIPHY_KEY);

export default function Giphy({ onGifSelect }) {
  // state for a search-word, fetched gifs, loading & error:
  const [searchWord, setSearchWord] = useState("");
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // configure your fetch: fetch 10 gifs at a time as the user scrolls (offset is handled by the grid):
  const fetchGifs = useCallback(async (offset) => {
    setLoading(true);
    setError(""); // reset prev. errors

    // console.log("Fetching GIFs for:", searchWord);

    try {
     
      let response;
      if (searchWord.trim() === "") {
        // console.log("Fetching trending GIFs...");
        response = await gf.trending({ offset, limit: 10 });
        // console.log("Trending GIFs response:", response);

      } else {
        // console.log(`Fetching GIFs for search: ${searchWord}`);
        response = await gf.search(searchWord, {
          offset,
          limit: 10,
        });
        // console.log("Search response:", response);

      }

      if (response && response.data) {
        // console.log("Fetched GIFs:", response.data);
        setGifs(response.data);
      } else {
        console.log("No GIFs found");
        setGifs([]); 
      }

    } catch (error) {
      console.log("Error fetching GIFs: ", error);
      setError("Error loading GIFs, please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchWord]);

  // handler-function:
  const handleSearchWord = (e) => {
    setSearchWord(e.target.value);
  };

  // fetch some trending gifs each time when component was mounted, before any search-word has been entered:

  useEffect(() => {
    fetchGifs(0);
  }, [fetchGifs]);

  // fetch GIFs on each searchWord-change:

  useEffect(() => {
    if (searchWord !== "") {
      const delayDebounce = setTimeout(() => {
        fetchGifs(0); // search starts with offset: 0, until 10
      }, 500); // delay 0.5 sec - debounce effect to prevent too many API-calls
      return () => clearTimeout(delayDebounce); // cancel timeout if user continues typing
    }
  }, [searchWord, fetchGifs]);

  // console.log("Current gifs state:", gifs); //

  return (
    <div className="search-gifs">
      <input
        type="text"
        placeholder="Search GIFs..."
        value={searchWord}
        className="gif-search-input"
        onChange={handleSearchWord} 
        // onChange={(e) => setSearchWord(e.target.value)}
      />

      {error && <p>{error}</p>}
      {loading && <p className="gif-loading">Loading...</p>}
      {gifs.length === 0 && !loading && <p className="no-gifs-found">No GIFs found.</p>}

      <Grid
        key={searchWord}
        width={400}
        columns={3}
        // fetchGifs={(offset) => gf.trending({ offset, limit: 10 })}
        fetchGifs={(offset) =>
          gf.search(searchWord || "trending", { offset, limit: 10 })
        }
        // gifs={gifs}
        onGifClick={(gif, e) => {
          e.preventDefault();
          onGifSelect(gif.images.fixed_height.url);
        }}
      />
    </div>
  );
}
