import React, { useState } from "react";

interface VideoURLInputProps {
  defaultURL: string;
  onLoad: (url: string) => void;
}

const VideoURLInput: React.FC<VideoURLInputProps> = ({
  defaultURL,
  onLoad,
}) => {
  const [inputURL, setInputURL] = useState(defaultURL);
  const [isEnabled, setIsEnabled] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputURL(event.target.value);
  };

  const handleLoadVideo = () => {
    onLoad(inputURL);
  };

  return (
    <div className="video-url-container">
      <label className="toggle-label">
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={() => setIsEnabled(!isEnabled)}
        />
        Enable Custom URL
      </label>

      {isEnabled && (
        <div className="video-url-input">
          <label htmlFor="video-url">🔗 Enter Video URL: </label>
          <input
            type="text"
            id="video-url"
            value={inputURL}
            onChange={handleInputChange}
            className="input-box"
            placeholder="Enter video stream URL..."
          />
          <button className="load-btn" onClick={handleLoadVideo}>
            Load Video
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoURLInput;
