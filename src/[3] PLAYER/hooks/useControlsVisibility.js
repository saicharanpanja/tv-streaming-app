import { useRef, useState, useEffect, useCallback } from "react";

export const useControlsVisibility = (isPlaying, {
  containerRef,
  isMobile,
}) => {
  const hideTimeout = useRef(null);
  const [mobileControlsVisible, setMobileControlsVisible] = useState(true);
  const [desktopControlsVisible, setDesktopControlsVisible] = useState(true);

  useEffect(() => {
    if (isMobile) {
      if (isPlaying) hideTimeout.current = setTimeout(() => setMobileControlsVisible(false), 3000);
    } else {
      if (isPlaying) hideTimeout.current = setTimeout(() => setDesktopControlsVisible(false), 3000);
      else setDesktopControlsVisible(true);
    }
    return () => clearTimeout(hideTimeout.current);
  }, [isPlaying, isMobile]);

  const hideControls = useCallback(() => {
    if (!isPlaying || isMobile) return;
    clearTimeout(hideTimeout.current);
    setDesktopControlsVisible(false);
  }, [isPlaying, isMobile]);

  const showControls = useCallback(() => {
    if (!isPlaying || isMobile) return;
    clearTimeout(hideTimeout.current);
    setDesktopControlsVisible(true);
    hideTimeout.current = setTimeout(() => setDesktopControlsVisible(false), 3000);
  }, [isPlaying, isMobile]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", showControls);
    container.addEventListener("mouseleave", hideControls);

    return () => {
      container.removeEventListener("mousemove", showControls);
      container.removeEventListener("mouseleave", hideControls);
      clearTimeout(hideTimeout.current);
    };
  }, [showControls, hideControls, containerRef]);

  return {
    mobileControlsVisible,
    desktopControlsVisible
  };
}
