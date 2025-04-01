import { useState } from "react";
import { uploadFile } from "../supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-regular-svg-icons";

export default function FileUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const uploadedData = await uploadFile(file);
      if (uploadedData) {
        console.log("File uploaded successfully:", uploadedData);
      }
    } else {
      console.log("No file selected");
    }
  };

  return (
    <>
      <input
        type="file"
        id="file"
        className="add-files"
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
      />
      <button
        className="input-button file-button"
        type="button"
        onClick={() => handleUpload()}
      >
        <FontAwesomeIcon icon={faFolderOpen} /> file/img
      </button>
      
    </>
  );
}
