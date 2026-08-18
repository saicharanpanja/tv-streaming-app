import { useCallback } from "react";

function usePlayToggle({ videoRef }) {
  const handlePlayToggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.paused || video.ended ? video.play() : video.pause();
  }, [videoRef]);

  return handlePlayToggle;
}

export default usePlayToggle;