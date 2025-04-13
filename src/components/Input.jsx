import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faFaceSmile } from "@fortawesome/free-solid-svg-icons";
import { faFilm } from "@fortawesome/free-solid-svg-icons";
import FileUpload from "./FileUpload";

import { uploadFile } from "../supabaseClient";
// import { supabase } from "../supabaseClient";

// NEW - EMOJIS:
import Picker from "emoji-picker-react";
import Giphy from "./Giphy";

export default function Input({ sendMessage, thisMember }) {
  // thisMember - me / the person from whose perspective we are currently seing the chat (user-perspective)
  // = chat.member; has properties: username & avatar

  const storageUrl = process.env.REACT_APP_STORAGE_URL;

  const placeholder = [
    "Enter your message...",
    "You need to type something first...",
  ];

  const initialInput = {
    text: "",
    placeholder: placeholder[0],
  };

  // states:

  const [input, setInput] = useState(initialInput);

  // NEW - EMOJIS:
  const [showPicker, setShowPicker] = useState(false);

  // NEW - GIFS (API):
  const [showGifPicker, setShowGifPicker] = useState(false);


  // refs for storing the emoji- and gif-picker containers:
  const emojiPickerRef = useRef(null);
  const gifPickerRef = useRef(null);

  useEffect(() => {
    // Focus the picker container when it's shown
    if (showPicker && emojiPickerRef.current) {
      emojiPickerRef.current.focus();
    } else if (showGifPicker && gifPickerRef.current) {
      gifPickerRef.current.focus();
    }
  }, [showPicker, showGifPicker]);




  let nameInput;

  // function handleEmojiPicker(){
  //   if (showPicker === true){
  //     setShowPicker(false)}
  //   }
  // }

  function updateInput(e) {
    setInput({ ...input, text: e.target.value });
  }

  // NEW - EMOJIS:

  const addEmoji = (emojiObject, event) => {
    setInput((prev) => ({
      ...prev,
      text: prev.text + (emojiObject?.emoji || ""),
    }));
  };

  // Structure of each emoji in the emoji-picker-react library:
  // {
  //   emoji: "😊",
  //   names: ["smiley"],
  //   ...
  // }

  const handleGifSelect = (gifUrl) => {
    sendMessage(gifUrl);
    setShowGifPicker(false);
  };

  function publishInput(e) {
    e.preventDefault();
    if (showPicker) {
      setShowPicker(false);
    }
    
    if (input.text === "") {
      setInput({
        ...input,
        placeholder: placeholder[1],
      });
    } else {
      sendMessage(input.text);
      setInput({ text: "", placeholder: placeholder[0] });
    }
  }

  const handleKeyDown = (e) => {
    
    if (e.key === "Enter") {
      e.preventDefault();
      publishInput(e);
    }
    
  };

  // NEW: upload logic:
  const handleFileUpload = async (file) => {
    const uploadResult = await uploadFile(file);

    // console.log("Upload result:", uploadResult); 

    if (!uploadResult || !uploadResult.path) {
      console.error("Upload result is missing path!", uploadResult);
      return;
    }

    const fileLink = `${storageUrl}public/mystorage/${uploadResult.path}`;

    const shortenedLink = `${uploadResult.path}`;

    if (uploadResult) {
      // console.log(
      //   "Upload result - path (format: 'public/timestamp_name): ",
      //   uploadResult.path
      // );
      // console.log("File link - complete:", fileLink);
      // console.log("Sending file link:", fileLink);
      // console.log("Shortened link:", shortenedLink);

      // publishing message, which contains the file-link:
        // sendMessage(fileLink);   
        sendMessage(`${fileLink},${shortenedLink}`);   

    } else {
      console.error("Error generating public URL:", new Error("Upload failed"));
    }
  };

  return (
    
    <div className="input-down">
      <form onSubmit={publishInput} className="flex-message">
        <div className="my-avatar-name">
          <img
            src={`/avatars/${thisMember.avatar}`}
            alt="user-avatar"
            title={`${thisMember.username} (me)`}
            className="avatar-image"
          />
          <div className="input-name">{`${thisMember.username} (me)`}</div>
        </div>
        <div className="message-input">
          <textarea
            className="input-text"
            value={input.text}
            type="text"
            placeholder={input.placeholder}
            ref={(input) => {
              nameInput = input;
            }}
            autoFocus={true}
            onChange={updateInput}
            onKeyDown={handleKeyDown}
          />

          <div className="buttons">
            <div className="left-buttons">
              <button
                className="input-button smiley-button"
                type="button"
                onClick={() => setShowPicker(!showPicker)}
              >
                <FontAwesomeIcon icon={faFaceSmile} /> emoji
              </button>

              <button
                className="input-button file-button"
                type="button"
                onClick={() => setShowGifPicker(!showGifPicker)}
              >
                <FontAwesomeIcon icon={faFilm} /> gif
              </button>

              {/* <button className="input-button file-button" type="button">
                <FontAwesomeIcon icon={faFolderOpen} /> file/img
              </button> */}

              <FileUpload onFileSelect={handleFileUpload} />
            </div>

            <button
              className="input-button send-button"
              type="button"
              onMouseDown={publishInput}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      </form>
      {showPicker && (
        <div className="emoji-picker-container" ref={emojiPickerRef} tabIndex={-1}>
          <Picker onEmojiClick={addEmoji} />
        </div>
      )}
      {showGifPicker && (
        <div className="gif-picker-container" ref={gifPickerRef} tabIndex={-1}>
          <Giphy onGifSelect={handleGifSelect} />
        </div>
      )}
    </div>
  );
}
