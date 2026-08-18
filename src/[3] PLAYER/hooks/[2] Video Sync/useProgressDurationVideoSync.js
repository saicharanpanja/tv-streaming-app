import { useEffect } from 'react';

function useProgressDurationVideoSync({ videoRef, currentIndex, setDuration, setProgress }) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateLiveDvrMetrics = () => {
      if (video.seekable.length > 0) {
        const start = video.seekable.start(0);
        const end = video.seekable.end(0);

        const dvrDuration = end - start;
        const dvrProgress = video.currentTime - start;

        setDuration(Number.isFinite(dvrDuration) ? dvrDuration : 0);
        setProgress(Number.isFinite(dvrProgress) ? dvrProgress : 0);
      }
    };

    // Update on:
    video.addEventListener("timeupdate", updateLiveDvrMetrics);
    video.addEventListener("durationchange", updateLiveDvrMetrics);
    video.addEventListener("loadedmetadata", updateLiveDvrMetrics);
    video.addEventListener("progress", updateLiveDvrMetrics);
    video.addEventListener("seeking", updateLiveDvrMetrics);

    // Initial call
    updateLiveDvrMetrics();

    return () => {
      video.removeEventListener("timeupdate", updateLiveDvrMetrics);
      video.removeEventListener("durationchange", updateLiveDvrMetrics);
      video.removeEventListener("loadedmetadata", updateLiveDvrMetrics);
      video.removeEventListener("progress", updateLiveDvrMetrics);
      video.removeEventListener("seeking", updateLiveDvrMetrics);
    };
  }, [videoRef, currentIndex, setProgress, setDuration]);
}

export default useProgressDurationVideoSync;
