import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.REACT_APP_BASE_URL;
// const supabaseKey = process.env.REACT_APP_BASE_KEY;

// export const supabase = createClient(supabaseUrl, supabaseKey);

// NEW - fetching secret keys via Netlify serverless functions:
let supabase = null;

export const initializeSupabase = async () => {
  try {
    const response = await fetch("/.netlify/functions/useKeys");
    const data = await response.json();

    const supabaseUrl = data.supabaseBaseUrl;
    const supabaseKey = data.supabaseBaseKey;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase keys not available.");
    }

    supabase = createClient(supabaseUrl, supabaseKey);
    return true;
  } catch (err) {
    console.error("Error while initializing Supabase client:", err.message);
    return false;
  }
};

// upload data:
export const uploadFile = async (file) => {
  if (!supabase) {
    const initialized = await initializeSupabase();
    if (!initialized) return null;
  }

  try {
    const { data, error } = await supabase.storage
      .from("mystorage") // bucket name
      .upload(`public/${Date.now()}_${file.name}`, file); // bucket path

    if (error) {
      console.error("Error uploading file:", error.message);
      return null;
    }

    console.log("File uploaded:", data); // THIS IS SUCCESFUL - FILE PICKED + ENTER, MESSAGE IS SHOWN IN THE CONSOLE.
    return data;
  } catch (err) {
    console.error("Upload greška:", err.message);
    return null;
  }
};

// download data:
export const downloadFile = async (filePath) => {
  if (!supabase) {
    const initialized = await initializeSupabase();
    if (!initialized) return null;
  }

  try {
    const { data, error } = await supabase.storage
      .from("mystorage")
      .download(filePath);

    if (error) {
      console.error("Error downloading file:", error.message);
      return null;
    }

    const url = URL.createObjectURL(data);
    console.log("Download URL:", url);
    return url;
  } catch (err) {
    console.error("Download greška:", err.message);
    return null;
  }
};
