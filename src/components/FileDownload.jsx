import { useState } from "react";
import { downloadFile } from '../supabaseClient';

const FileDownload = ({ filePath }) => {
    const [downloadUrl, setDownloadUrl] = useState(null);
  
    const handleDownload = async () => {
      const url = await downloadFile(filePath);
      if (url) {
        setDownloadUrl(url);
        window.open(url, '_blank'); // open in a new tab
      }
    };
  
    return (
      <div>
        <button onClick={handleDownload}>Download File</button>
        {downloadUrl && <a href={downloadUrl} target="_blank" rel="noopener noreferrer">Click to download</a>}
      </div>
    );
  };
  
  export default FileDownload;