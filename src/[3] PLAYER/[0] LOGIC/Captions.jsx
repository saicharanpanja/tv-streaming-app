import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Icon from "../[2] UTILS/Icon";

export default function Captions({ 
  captionsLabel, 
  setCaptionsLabel, 
  captionsArray,
  shouldIgnoreKeyPress,
}) {
  const [overlayData, setOverlayData] = useState(null);
  const areCaptionsOn = captionsLabel !== 'Disabled';

  const toggleCaptions = useCallback(() => {
    if (captionsArray.length < 2) return;

    if (areCaptionsOn) {
      setCaptionsLabel('Disabled');
    } else {
      const lastActive = localStorage.getItem("player:lastActiveCaption");
      const firstAvailable = captionsArray[1] ? (
        { de: 'Deutsch', deu: 'Deutsch', ger: 'Deutsch' }[captionsArray[1].language] || captionsArray[1].label
      ) : 'Disabled';

      setCaptionsLabel(lastActive || firstAvailable);
    }
  }, [areCaptionsOn, captionsArray, setCaptionsLabel]);

  // Keydown effect for 'C' key.
  useEffect(() => {
    let timer;

    const handleGlobalShortcuts = (event) => {
      if (shouldIgnoreKeyPress(event)) return;
      if (event.code === "KeyC") {
        setOverlayData({ name: "captions", id: Date.now() });
        clearTimeout(timer);
        timer = setTimeout(() => setOverlayData(null), 500);
        toggleCaptions();
      }
    };

    document.addEventListener("keydown", handleGlobalShortcuts);
    return () => {
      document.removeEventListener("keydown", handleGlobalShortcuts);
      clearTimeout(timer);
    };
  }, [shouldIgnoreKeyPress, toggleCaptions]);

  return (
    <button className="video-controls captions-container" onClick={toggleCaptions}>
      <Icon name="captions" />
      <span className={`captions-underline${areCaptionsOn ? "" : " hide"}`} />
      {overlayData &&
        createPortal(
          <div key={overlayData.id} className="overlay-wrapper">
            <Icon
              name={overlayData.name}
              size="3.5vw"
              color="rgba(255,255,255,0.8)"
            />
          </div>,
          document.querySelector(".player-container")
        )}
    </button>
  );
}