import { useState, useEffect } from "react";
import Icon from "../[2] UTILS/Icon";

export default function Fullscreen({ containerRef }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.mozRequestFullScreen) { /* Firefox */
        containerRef.current.mozRequestFullScreen();
      } else if (containerRef.current.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) { /* IE/Edge */
        containerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  return (
    <div className="video-controls fullscreen-container" onClick={toggleFullscreen}>
      <Icon
        name="enter-fullscreen"
        className={`video-controls-icons enter-fullscreen${isFullscreen ? " hide" : ""}`}
      />
      <Icon name="exit-fullscreen"
        className={`video-controls-icons exit-fullscreen${!isFullscreen ? " hide" : ""}`}
      />

    </div>
  );
}