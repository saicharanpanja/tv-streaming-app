import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "../[2] UTILS/Icon";

function SkipPrev({ onPrev, isDisabled, shouldIgnoreKeyPress }) {
  const [overlayData, setOverlayData] = useState(null);

  // Keydown effect for 'Shift + P'
  useEffect(() => {
    let timer;

    const handleGlobalShortcuts = (event) => {
      if (shouldIgnoreKeyPress(event, { allowRepeat: true, allowShift: true })) return;
      if (event.shiftKey && event.code === "KeyP" && !isDisabled) {
        setOverlayData({ name: "skip-previous", id: Date.now() });
        clearTimeout(timer);
        timer = setTimeout(() => setOverlayData(null), 500);
        onPrev();
      }
    }

    document.addEventListener("keydown", handleGlobalShortcuts);
    return () => {
      document.removeEventListener("keydown", handleGlobalShortcuts);
      clearTimeout(timer);
    };
  }, [isDisabled, onPrev, shouldIgnoreKeyPress]);

  return (
    <button
      className="video-controls skip-previous-container"
      onClick={onPrev}
      disabled={isDisabled}
    >
      <Icon name="skip-previous" className={"video-controls-icons"} />
      {overlayData &&
        createPortal(
          <div key={overlayData.id} className="overlay-wrapper-left">
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

export default SkipPrev;