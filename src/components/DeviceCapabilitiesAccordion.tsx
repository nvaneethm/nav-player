import React, { useState, useEffect } from "react";

const getDeviceCapabilities = async () => {
  const browserName = navigator.userAgent;
  const resolution = `${window.screen.width}x${window.screen.height}`;

  // Check for Widevine and PlayReady support
  const supportsWidevine = await checkDRM("com.widevine.alpha");
  const supportsPlayReady = await checkDRM("com.microsoft.playready");

  return {
    browser: browserName,
    resolution,
    supportsWidevine,
    supportsPlayReady,
  };
};

const checkDRM = async (drmKeySystem: string) => {
  if (!navigator.requestMediaKeySystemAccess) {
    return false;
  }

  try {
    await navigator.requestMediaKeySystemAccess(drmKeySystem, [
      {
        initDataTypes: ["cenc"],
        videoCapabilities: [{ contentType: "video/mp4; codecs=\"avc1.42E01E\"" }],
      },
    ]);
    return true;
  } catch (error) {
    return false;
  }
};

const DeviceCapabilitiesAccordion: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [capabilities, setCapabilities] = useState({
    browser: "",
    resolution: "",
    supportsWidevine: false,
    supportsPlayReady: false,
  });

  useEffect(() => {
    getDeviceCapabilities().then(setCapabilities);
  }, []);

  return (
    <div className="accordion">
      <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        📱 Device Capabilities {isOpen ? "▲" : "▼"}
      </button>
      {isOpen && (
        <div className="accordion-content">
          <p><strong>🌐 Browser:</strong> {capabilities.browser}</p>
          <p><strong>🖥 Supported Resolution:</strong> {capabilities.resolution}</p>
          <p><strong>🔒 Widevine DRM:</strong> {capabilities.supportsWidevine ? "✔ Supported" : "❌ Not Supported"}</p>
          <p><strong>🔐 PlayReady DRM:</strong> {capabilities.supportsPlayReady ? "✔ Supported" : "❌ Not Supported"}</p>
        </div>
      )}
    </div>
  );
};

export default DeviceCapabilitiesAccordion;