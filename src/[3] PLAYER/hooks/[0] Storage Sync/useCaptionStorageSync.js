import { useEffect } from 'react';

function useCaptionStorageSync({ captionsLabel }) {
  useEffect(() => {
    try {
      localStorage.setItem("player:captions", captionsLabel);
      if (captionsLabel !== 'Disabled') {
        localStorage.setItem("player:lastActiveCaption", captionsLabel);
      }
    } catch (err) {
      console.error("[Player] Could not save caption state:", err);
    }
  }, [captionsLabel]);
}

export default useCaptionStorageSync;