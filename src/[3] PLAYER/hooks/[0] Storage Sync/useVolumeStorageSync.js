import { useEffect } from 'react';

function useVolumeStorageSync({ volume }) {
  useEffect(() => {
    try {
      localStorage.setItem("player:volume", volume.toString());
    } catch (err) {
      console.error("[Player] Could not save volume state:", err);
    }
  }, [volume]);
}

export default useVolumeStorageSync;