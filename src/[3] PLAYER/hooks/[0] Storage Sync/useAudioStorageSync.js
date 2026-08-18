import { useEffect } from 'react';

function useAudioStorageSync({ audioLabel }) {
  useEffect(() => {
    try {
      localStorage.setItem("player:audio", audioLabel);
    } catch (err) {
      console.error("[Player] Could not save audio state:", err);
    }
  }, [audioLabel]);
}

export default useAudioStorageSync;