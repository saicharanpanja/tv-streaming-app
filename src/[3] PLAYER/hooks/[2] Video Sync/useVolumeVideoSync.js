import { useEffect } from 'react';

function useVolumeVideoSync({ videoRef, volume, setVolume, currentIndex }) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Initialisation
    if (video.volume !== volume) video.volume = volume;

    const handleVolumeChange = () => {
      setVolume(video.volume);
    };

    video.addEventListener("volumechange", handleVolumeChange);
    return () => video.removeEventListener("volumechange", handleVolumeChange);

  }, [videoRef, setVolume, currentIndex ]);
  // Note: We purposely exclude 'volume' from dependency array here to prevent 
  // a setVolume -> re-render -> useEffect -> setVolume loop.
  // We only want to "Sync" on mount or when the video index changes.
}

export default useVolumeVideoSync;