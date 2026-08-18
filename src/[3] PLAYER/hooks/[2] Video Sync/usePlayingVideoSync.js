import { useEffect } from 'react';

function usePlayingVideoSync({ setIsPlaying, videoRef, currentIndex }) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onPause);
    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onPause);
    };
  }, [videoRef, currentIndex, setIsPlaying]);
}

export default usePlayingVideoSync;