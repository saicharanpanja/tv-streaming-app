import { useState, useRef } from "react";
import useKeyboard from "../hooks/useKeyboard";
import Icon from "../[2] UTILS/Icon";
import useVideoClicks from "../hooks/useVideoClicks";


function FeedbackOverlay({ videoRef, containerRef, setCurrentIndex, captionsArray, setCaptionsLabel, currentIndex, isMenuOpen, setActiveMenu, isMobile, setMobileControlsVisible }) {
  const overlayTimerRef = useRef();
  const [overlayData, setOverlayData] = useState(null);

  useKeyboard({ videoRef, containerRef, setCurrentIndex, captionsArray, setCaptionsLabel, setOverlayData, overlayTimerRef });
  useVideoClicks({ videoRef, currentIndex, isMenuOpen, setActiveMenu, isMobile, setMobileControlsVisible, setOverlayData, overlayTimerRef })

  return (
    <>
      {overlayData &&
        <div key={overlayData.id} className="overlay-wrapper">
          <Icon
            name={overlayData.name}
            size="3.5vw"
            color="rgba(255,255,255,0.8)"
          />
        </div>
      }
    </>
  );
}

export default FeedbackOverlay;