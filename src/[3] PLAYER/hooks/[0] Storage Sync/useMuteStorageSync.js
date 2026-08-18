import { useEffect } from 'react';

function useMuteStorageSync({isMuted}) {
  useEffect(() => {
    try {
      localStorage.setItem("player:muted", isMuted.toString());
    } catch (err) {
      console.error("[Player] Could not save mute state:", err);
    }
  }, [isMuted]);
}

export default useMuteStorageSync;