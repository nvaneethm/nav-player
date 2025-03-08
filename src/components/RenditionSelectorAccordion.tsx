import React, { useState, useEffect } from "react";
import { IPlayer } from "../players/IPlayer";

interface RenditionSelectorAccordionProps {
  playerInstance: IPlayer | null;
}

const RenditionSelectorAccordion: React.FC<RenditionSelectorAccordionProps> = ({
  playerInstance,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [renditions, setRenditions] = useState<
    { resolution: string; bitrate: number }[]
  >([]);
  const [selectedRendition, setSelectedRendition] = useState<string>("ABR");

  useEffect(() => {
    if (!playerInstance) return;
    setSelectedRendition("ABR");

    const fetchRenditions = () => {
      const availableRenditions =
        playerInstance.getAvailableRenditions?.() || [];
      setRenditions(availableRenditions);
      console.log("Available Renditions:", availableRenditions);
    };

    fetchRenditions(); // Fetch initially

    playerInstance.on?.("loadedmetadata", fetchRenditions);
    playerInstance.on?.("renditionchange", fetchRenditions); // Handle dynamic changes

    return () => {
      playerInstance.off?.("loadedmetadata", fetchRenditions);
      playerInstance.off?.("renditionchange", fetchRenditions);
    };
  }, [playerInstance]);

  const handleRenditionChange = (resolution: string) => {
    setSelectedRendition(resolution);
    if (resolution === "ABR") {
      playerInstance?.setAdaptiveBitrate?.(true);
    } else {
      playerInstance?.setAdaptiveBitrate?.(false);
      playerInstance?.setRendition?.(resolution);
    }
  };

  return (
    <div className="accordion">
      <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        🎛 Renditions {isOpen ? "▲" : "▼"}
      </button>
      {isOpen && (
        <div className="accordion-content">
          <h4>📡 Select Video Quality</h4>
          <label className="radio-label">
            <input
              type="radio"
              value="ABR"
              checked={selectedRendition === "ABR"}
              onChange={() => handleRenditionChange("ABR")}
            />
            Auto (ABR)
          </label>
          {renditions.map((rendition, index) => (
            <label
              key={`${rendition.resolution}-${index}`}
              className="radio-label"
            >
              <input
                type="radio"
                value={rendition.resolution}
                checked={selectedRendition === rendition.resolution}
                onChange={() => handleRenditionChange(rendition.resolution)}
              />
              {rendition.resolution} ({rendition.bitrate} Kbps)
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default RenditionSelectorAccordion;
