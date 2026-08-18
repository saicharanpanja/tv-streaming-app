import { useCallback } from "react"

function useVolumeChange({ videoRef }) {
  const handleVolumeChange = useCallback((newVolume) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = newVolume;
    video.muted = newVolume === 0;
  }, [videoRef]);

  return handleVolumeChange;
}

export default useVolumeChange;