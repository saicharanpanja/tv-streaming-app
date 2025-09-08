import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Icon from "../[2] UTILS/Icon";

export default function PlayPause({ videoRef, currentSrc }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [overlayData, setOverlayData] = useState(null);

  // Sync video play/pause state and clean up.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onPause);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onPause);
    };
  }, [videoRef, currentSrc]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video.play();
    } else {
      video.pause();
    }
  }, [videoRef]);

  // Click and Keydown effect for 'K' and 'Space' key.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let timer;

    function handleInteraction() {
      const iconName = video.paused || video.ended ? "play" : "pause";
      setOverlayData({ name: iconName, id: Date.now() });
      clearTimeout(timer);
      timer = setTimeout(() => setOverlayData(null), 500);
      togglePlay();
    };

    function handleKeyDown(event) {
      const { tagName } = event.target;
      if (tagName === "INPUT" || tagName === "TEXTAREA") {
        return;
      }

      if (event.code === "Space" || event.code === "KeyK") {
        event.preventDefault();
        handleInteraction();
      }
    }

    video.addEventListener("click", handleInteraction);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      video.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [togglePlay, videoRef, currentSrc]);

  return (
    <button className="video-controls play-pause-container" onClick={togglePlay}>
      <Icon
        name="play"
        className={`video-controls-icons play${!isPlaying ? "" : " hide"}`}
      />
      <Icon
        name="pause"
        className={`video-controls-icons pause${isPlaying ? "" : " hide"}`}
      />
      {overlayData &&
        createPortal(
          <div key={overlayData.id} className="overlay-wrapper">
            <Icon
              name={overlayData.name}
              size="3.5vw"
              color="rgba(255,255,255,0.8)"
            />
          </div>,
          document.querySelector(".player-container")
        )}
    </button>
  );
}