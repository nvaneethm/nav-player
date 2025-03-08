import React, { useState } from "react";

interface StreamDetailsAccordionProps {
  videoURL: string;
  drmType: string | null | undefined;
  licenseUrl: string | null | undefined;
}

const StreamDetailsAccordion: React.FC<StreamDetailsAccordionProps> = ({
  videoURL,
  drmType,
  licenseUrl,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion">
      <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        🎥 Stream Details {isOpen ? "▲" : "▼"}
      </button>
      {isOpen && (
        <div className="accordion-content">
          <p>
            <strong>📡 Stream URL:</strong> {videoURL}
          </p>
          <p>
            <strong>🔒 DRM Type:</strong> {drmType || "None"}
          </p>
          <p>
            <strong>🔑 License URL:</strong> {licenseUrl || "Not Required"}
          </p>
        </div>
      )}
    </div>
  );
};

export default StreamDetailsAccordion;
