import { useEffect, useRef } from 'react';

function useProgressAnimationVideoSync({ videoRef, seekbarContainerRef, seekbarInputRef }) {
  const animationFrameId = useRef();

  useEffect(() => {
    const updateLoop = () => {
      const video = videoRef.current;
      const seekbarContainer = seekbarContainerRef.current;
      const seekbarInput = seekbarInputRef.current

      if (video && seekbarContainer) {
        // Calculate Video Progress
        const currentProgress = (video.currentTime / video.duration) * 100;
        const safeProgress = Number.isFinite(currentProgress) ? currentProgress : 0;

        // Calculate Buffered Progress
        let safeBuffered = 0;
        if (video.buffered.length > 0 && video.duration > 0) {
          for (let i = video.buffered.length - 1; i >= 0; i--) {
            if (video.buffered.start(i) <= video.currentTime) {
              const bufferedEnd = video.buffered.end(i);
              safeBuffered = (bufferedEnd / video.duration) * 100;
              break;
            }
          }
        }

        // Update CSS Variables (Zero Re-renders)
        seekbarContainer.style.setProperty('--video-progress', `${safeProgress}%`);
        seekbarContainer.style.setProperty('--buffer-progress', `${safeBuffered}%`);
        if (seekbarInput) seekbarInput.value = safeProgress;
      }

      animationFrameId.current = requestAnimationFrame(updateLoop);
    };

    updateLoop();
    return () => cancelAnimationFrame(animationFrameId.current);
  }, [videoRef, seekbarContainerRef, seekbarInputRef]);
}

export default useProgressAnimationVideoSync;