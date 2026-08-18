import { useEffect } from 'react';

const useVideoClicks = ({
  videoRef,
  currentIndex,
  isMenuOpen,
  setActiveMenu,
  isMobile,
  setMobileControlsVisible,
  setOverlayData,
  overlayTimerRef,

}) => {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleSingleClick = (event) => {
      event.stopPropagation();

      if (isMenuOpen) setActiveMenu(null);
      else if (isMobile) setMobileControlsVisible(prev => !prev);
      else {
        video.paused || video.ended ? video.play() : video.pause();

        const iconName = video.paused || video.ended ? "play" : "pause";
        setOverlayData({ name: iconName, id: Date.now() });
        clearTimeout(overlayTimerRef.current);
       overlayTimerRef.current = setTimeout(() => setOverlayData(null), 500);
      }
    };

    video.addEventListener('click', handleSingleClick);
    return () => video.removeEventListener('click', handleSingleClick);
  }, [isMenuOpen, isMobile, setActiveMenu, setMobileControlsVisible, videoRef, currentIndex, setOverlayData, overlayTimerRef]);
}

export default useVideoClicks;