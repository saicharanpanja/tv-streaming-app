import { useEffect } from 'react';

function usePlaybackRateStorageSync({ playbackRate }) {
  useEffect(() => {
    try {
      localStorage.setItem("player:playbackRate", playbackRate.toString());
    } catch (err) {
      console.error("[Player] Could not save playback rate:", err);
    }
  }, [playbackRate]);
}

export default usePlaybackRateStorageSync;