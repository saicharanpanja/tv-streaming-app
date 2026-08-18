import { useCallback } from "react";

function useMuteToggle({ videoRef }) {
  const handleMuteToggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const currentlyMuted = video.muted;
    video.muted = !currentlyMuted;
    currentlyMuted && video.volume === 0 && (video.volume = 0.75);
  }, [videoRef]);

  return handleMuteToggle;
}

export default useMuteToggle;