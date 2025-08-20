import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Icon from "../[2] UTILS/Icon";

export default function Volume({ videoRef }) {
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [overlayData, setOverlayData] = useState(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    handleVolumeChange();

    video.addEventListener("volumechange", handleVolumeChange);
    return () => {
      video.removeEventListener("volumechange", handleVolumeChange);
    };
  }, [videoRef]);

  const changeVolume = useCallback((e) => {
    const video = videoRef.current;
    if (!video) return;
    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    video.muted = newVolume === 0;
  }, [videoRef]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const currentlyMuted = video.muted;
    video.muted = !currentlyMuted;
    if (currentlyMuted && video.volume === 0) {
      video.volume = 0.75;
    }
  }, [videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let timer;

    function handleKeyDown(event) {
      const { tagName } = event.target;
      if (tagName === "INPUT" || tagName === "TEXTAREA") {
        return;
      }

      let iconName = null;

      if (event.code === "KeyM") {
        iconName = video.muted ? "volume-up" : "volume-off";
        toggleMute();
      } else if (event.code === "ArrowUp") {
        event.preventDefault();
        const newVolUp = Math.min(1, video.volume + 0.25);
        video.volume = newVolUp;
        video.muted = false;
        iconName = "volume-up";
      } else if (event.code === "ArrowDown") {
        event.preventDefault();
        const newVolDown = Math.max(0, video.volume - 0.25);
        video.volume = newVolDown;
        iconName = newVolDown === 0 ? "volume-off" : "volume-down";
      } else {
        return;
      }

      if (iconName) {
        setOverlayData({ name: iconName, id: Date.now() });
        clearTimeout(timer);
        timer = setTimeout(() => setOverlayData(null), 500);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [toggleMute, videoRef]);

  return (
    <div className="video-controls volume-container">
      <Icon
        name="volume-off"
        onClick={toggleMute}
        className={`video-controls-icons volume-off${volume === 0 || isMuted ? "" : " hide"}`}
      />
      <Icon
        name="volume-up"
        onClick={toggleMute}
        className={`video-controls-icons volume-up${volume >= 0.5 && volume <= 1 && !isMuted ? "" : " hide"}`}
      />
      <Icon
        name="volume-down"
        onClick={toggleMute}
        className={`video-controls-icons volume-down${volume > 0 && volume < 0.5 && !isMuted ? "" : " hide"}`}
      />
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={isMuted ? 0 : volume}
        onChange={changeVolume}
        className="video-controls-inputs volume"
        style={{ "--val": isMuted ? 0 : volume }}
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
    </div>
  );
}