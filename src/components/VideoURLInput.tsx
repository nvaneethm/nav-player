import React, { useState } from "react";

interface VideoURLInputProps {
  defaultURL: string;
  onLoad: (
    url: string,
    drmType: string | null,
    licenseUrl: string | null
  ) => void;
}

const VideoURLInput: React.FC<VideoURLInputProps> = ({
  defaultURL,
  onLoad,
}) => {
  const [isCustomInputEnabled, setIsCustomInputEnabled] = useState(false);
  const [isDrmEnabled, setIsDrmEnabled] = useState(false);
  const [videoURL, setVideoURL] = useState(defaultURL);
  const [drmType, setDrmType] = useState<string | null>(null);
  const [licenseURL, setLicenseURL] = useState<string>("");

  const handleLoadClick = () => {
    onLoad(
      videoURL,
      isDrmEnabled ? drmType : null,
      isDrmEnabled ? licenseURL : null
    );
  };

  return (
    <div className="video-url-input">
      <h3>🔗 Video Options</h3>

      {/* ✅ Enable Custom Input Checkbox */}
      <label className="checkbox-container">
        <input
          type="checkbox"
          checked={isCustomInputEnabled}
          onChange={() => setIsCustomInputEnabled(!isCustomInputEnabled)}
        />
        Enable Custom Input
      </label>

      {isCustomInputEnabled && (
        <>
          <div>
            <input
              type="text"
              className="input-field"
              value={videoURL}
              onChange={(e) => setVideoURL(e.target.value)}
              placeholder="Enter video manifest URL..."
            />
          </div>

          {/* ✅ Enable DRM Checkbox */}
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={isDrmEnabled}
              onChange={() => {
                setIsDrmEnabled(!isDrmEnabled);
                if (!isDrmEnabled) {
                  setDrmType(null);
                  setLicenseURL("");
                }
              }}
            />
            Enable DRM
          </label>

          {isDrmEnabled && (
            <div className="drm-options">
              <h4>🔒 Select DRM Type</h4>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    value="widevine"
                    checked={drmType === "widevine"}
                    onChange={() => setDrmType("widevine")}
                  />
                  Widevine
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="playready"
                    checked={drmType === "playready"}
                    onChange={() => setDrmType("playready")}
                  />
                  PlayReady
                </label>
              </div>

              <h4>🔑 Enter DRM License URL</h4>
              <input
                type="text"
                className="input-field"
                value={licenseURL}
                onChange={(e) => setLicenseURL(e.target.value)}
                placeholder="Enter license URL..."
              />
            </div>
          )}
          <button className="load-button" onClick={handleLoadClick}>
            Load
          </button>
        </>
      )}
    </div>
  );
};

export default VideoURLInput;
