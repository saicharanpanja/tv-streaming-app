import { useEffect } from 'react';

function usePlaybackRateVideoSync({ videoRef, playbackRate, currentIndex }) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = playbackRate;
    video.preservesPitch = true;
    video.mozPreservesPitch = true;
  }, [playbackRate, currentIndex, videoRef]);
}

export default usePlaybackRateVideoSync;