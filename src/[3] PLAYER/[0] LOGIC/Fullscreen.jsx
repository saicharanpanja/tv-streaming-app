import { useState, useEffect, useCallback } from "react";
import Icon from "../[2] UTILS/Icon";

export default function Fullscreen({
  containerRef,
  shouldIgnoreKeyPress,
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Listen for fullscreen changes and update state
  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) { // Safari
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) { // IE11
        containerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { // Safari
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE11
        document.msExitFullscreen();
      }
    }
  }, [containerRef]);

  // Keydown effect for 'F' key.
  useEffect(() => {
    const handleGlobalShortcuts = (event) => {
      if (shouldIgnoreKeyPress(event)) return;
      if (event.code === "KeyF") toggleFullscreen();
    };

    document.addEventListener("keydown", handleGlobalShortcuts);
    return () => {
      document.removeEventListener("keydown", handleGlobalShortcuts);
    };
  }, [shouldIgnoreKeyPress, toggleFullscreen]);
  
  return (
    <button className="video-controls fullscreen-container" onClick={toggleFullscreen}>
      <Icon name={isFullscreen ? "exit-fullscreen" : "enter-fullscreen"} />
    </button>
  );
}