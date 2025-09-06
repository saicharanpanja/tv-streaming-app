import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Icon from "../[2] UTILS/Icon";

export default function Captions({ captionsLabel, setCaptionsLabel, tracks }) {
  const [overlayData, setOverlayData] = useState(null);
  const areCaptionsOn = captionsLabel !== 'Disabled';

  const toggleCaptions = useCallback(() => {
    if (tracks.length === 0) return;

    if (areCaptionsOn) {
      setCaptionsLabel('Disabled');
    } else {
      const lastActive = localStorage.getItem("player:lastActiveCaption");
      const firstAvailable = tracks[0] ? (
          { de: 'Deutsch', deu: 'Deutsch', ger: 'Deutsch' }[tracks[0].language] || tracks[0].label
      ) : 'Disabled';
      
      setCaptionsLabel(lastActive || firstAvailable);
    }
  }, [areCaptionsOn, tracks, setCaptionsLabel]);

  // Keydown effect for 'C' key.
  useEffect(() => {
    let timer;
    function handleKeyDown(event) {
      const { tagName } = event.target;
      if (tagName === "INPUT" || tagName === "TEXTAREA") return;

      if (event.code === "KeyC") {
        const iconName = areCaptionsOn ? "captions-off" : "captions-on";
        setOverlayData({ name: iconName, id: Date.now() });
        clearTimeout(timer);
        timer = setTimeout(() => setOverlayData(null), 500);
        toggleCaptions();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [areCaptionsOn, toggleCaptions]);

  return (
    <button className="video-controls captions-container" onClick={toggleCaptions}>
      <Icon
        name="captions-off"
        className={`video-controls-icons captions-off${!areCaptionsOn ? "" : " hide"}`}
      />
      <Icon
        name="captions-on"
        className={`video-controls-icons captions-on${areCaptionsOn ? "" : " hide"}`}
      />
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