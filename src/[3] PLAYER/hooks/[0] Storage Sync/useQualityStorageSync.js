import { useEffect } from 'react';

function useQualityStorageSync({ qualityLabel }) {
  useEffect(() => {
    try {
      localStorage.setItem("player:quality", qualityLabel.toString());
    } catch (err) {
      console.error("[Player] Could not save quality:", err);
    }
  }, [qualityLabel]);
}

export default useQualityStorageSync;