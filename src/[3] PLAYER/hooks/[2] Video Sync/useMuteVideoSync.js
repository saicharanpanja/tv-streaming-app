import { useEffect } from 'react';

function useMuteVideoSync({ videoRef, isMuted, setIsMuted, currentIndex }) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Initially
    if (video.muted !== isMuted) video.muted = isMuted;

    const handleMuteChange = () => {
      setIsMuted(video.muted);
    };

    video.addEventListener("volumechange", handleMuteChange);
    return () => video.removeEventListener("volumechange", handleMuteChange);
  }, [videoRef, setIsMuted, currentIndex]); // Exclude isMuted to avoid loops
}

export default useMuteVideoSync;