import { useCallback } from "react";

function useFullscreenToggle({ videoRef, containerRef }) {
  const handleFullscreenToggle = useCallback(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
      } else {
        console.warn("webkitEnterFullscreen not available on this browser");
      }
      return;
    }

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) { // Safari
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) { // IE11
        container.msRequestFullscreen();
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
  }, [containerRef, videoRef]);

  return handleFullscreenToggle;
}

export default useFullscreenToggle;