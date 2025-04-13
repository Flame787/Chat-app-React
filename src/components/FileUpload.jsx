import { useState, useRef } from "react";
import { uploadFile } from "../supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-regular-svg-icons";

export default function FileUpload({ onFileSelect }) {
  const [file, setFile] = useState(null);

  const [uploadStatus, setUploadStatus] = useState("");

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    // console.log("selectedFile in FileUpload component: ", selectedFile);

    // if no file selected (but cancelled instead):
    if (!selectedFile) {
      setFile(null);
      setUploadStatus(""); 
      return; 
    }

    setFile(selectedFile);

    if (onFileSelect) {
      onFileSelect(selectedFile); // calling the prop-function and passing the selectedFile
    }

    // starts UPLOAD when file is selected:
    if (selectedFile) {
      handleUpload(selectedFile);
    }
  };

  const handleUpload = async (selectedFile) => {
    // console.log("Upload button clicked");
    if (selectedFile) {
      const uploadedData = await uploadFile(selectedFile);
      if (uploadedData) {
        // console.log(
        //   "File uploaded successfully in FileUpload component:",  
        //   uploadedData
        // );
        setUploadStatus("File uploaded successfully!");
      } else {
        setUploadStatus("File upload failed!");
      }
    } else {
      console.log("No file selected");
      setUploadStatus("No file selected.");
    }
    // Reset uploadStatus after 3 seconds
    setTimeout(() => {
      setUploadStatus("");
    }, 3000);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
    // handleUpload();
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

      {uploadStatus && <p>{uploadStatus}</p>}
    </>
  );
}
