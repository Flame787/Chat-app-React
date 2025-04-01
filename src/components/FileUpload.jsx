import { useState, useRef } from "react";
import { uploadFile } from "../supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-regular-svg-icons";

export default function FileUpload({ onFileSelect }) {

  const [file, setFile] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (onFileSelect) {
      onFileSelect(selectedFile); // calling the prop-function
    }
  };

  const handleUpload = async () => {
    console.log("Upload button clicked");
    if (file) {
      const uploadedData = await uploadFile(file);
      if (uploadedData) {
        console.log("File uploaded successfully:", uploadedData);
      }
    } else {
      console.log("No file selected");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        id="file"
        className="add-files"
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept=".pdf,.doc,.docx,.txt,.rtf,.odt,.xls,.xlsx,.csv,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.bmp,.tiff,.svg,.mp3,.wav,.ogg,.flac,.mp4,.mkv,.avi,.mov,.webm,.zip,.rar,.7z,.tar,.gz"
      />
      <button
        className="input-button file-button"
        type="button"
        onClick={triggerFileInput}
      >
        <FontAwesomeIcon icon={faFolderOpen} /> file/img
      </button>
      {/* this renders only if user has selected a file for upload: */}
      {file && (
        <button
          className="input-button upload-button"
          type="button"
          onClick={handleUpload}
        >
          Upload File
        </button>
      )}
    </>
  );
}
