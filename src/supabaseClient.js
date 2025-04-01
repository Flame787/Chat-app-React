import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_BASE_URL;
const supabaseKey = process.env.REACT_APP_BASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// upload data:
export const uploadFile = async (file) => {
  const { data, error } = await supabase.storage
    .from("mystorage") // bucket name
    .upload(`public/${file.name}`, file); // bucket path

  if (error) {
    console.error("Error uploading file:", error.message);
    return null;
  }

  console.log("File uploaded:", data);
  return data;
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
