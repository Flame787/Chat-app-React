import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.REACT_APP_BASE_URL;
// const supabaseKey = process.env.REACT_APP_BASE_KEY;

// export const supabase = createClient(supabaseUrl, supabaseKey);

export const supabase = null;

// upload data:
export const uploadFile = async (file) => {
  const { data, error } = await supabase.storage
    .from("mystorage") // bucket name
    .upload(`public/${Date.now()}_${file.name}`, file); // bucket path

  if (error) {
    console.error("Error uploading file:", error.message);
    return null;
  }

  console.log("File uploaded:", data);   // THIS IS SUCCESFUL - FILE PICKED + ENTER, MESSAGE IS SHOWN IN THE CONSOLE.
  return data;                         // THIS SHOWS EVEN BEFORE THE UPDATE-FILE-BUTTON WAS CLICKED.
};

// download data:
export const downloadFile = async (filePath) => {
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
};
