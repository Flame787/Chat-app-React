import { Grid } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";

const gf = new GiphyFetch(process.env.REACT_APP_GIPHY_KEY);

export default function Giphy({ onGifSelect }) {
  // configure your fetch: fetch 10 gifs at a time as the user scrolls (offset is handled by the grid):
  const fetchGifs = (offset) => gf.trending({ offset, limit: 10 });

  return (
    <div className="search-gifs">
      <Grid
        width={400}
        columns={3}
        fetchGifs={fetchGifs}
        onGifClick={(gif, e) => {
          e.preventDefault();
          onGifSelect(gif.images.fixed_height.url);
        }}
      />
    </div>
  );
}
