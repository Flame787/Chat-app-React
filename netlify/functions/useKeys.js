exports.handler = async function (event, context) {
  const { CHANNEL_ID, GIPHY_KEY, STORAGE_URL, BASE_URL, BASE_KEY } =
    process.env;

  return {
    statusCode: 200,
    body: JSON.stringify({
      droneChannelId: CHANNEL_ID,
      giphyKey: GIPHY_KEY,
      supabaseStorageKey: STORAGE_URL,
      supabaseBaseUrl: BASE_URL,
      supabaseBaseKey: BASE_KEY,
    }),
  };
};
