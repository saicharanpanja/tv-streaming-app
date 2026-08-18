import { useEffect } from 'react';

function useBufferingVideoSync({ videoRef, currentIndex, setIsBuffering }) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);

    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    return () => {
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
    };
  }, [videoRef, currentIndex, setIsBuffering]);
}

export default useBufferingVideoSync;