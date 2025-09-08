import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "../[2] UTILS/Icon";

export default function Seekbar({ videoRef, currentSrc }) {
  const isSeeking = useRef(false);
  const wasPlayingBeforeSeek = useRef(false);
  const animationFrameId = useRef();

  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  const [isBuffering, setIsBuffering] = useState(false);
  const [bufferedProgress, setBufferedProgress] = useState(0);

  const [isHovering, setIsHovering] = useState(false);
  const [hoverProgress, setHoverProgress] = useState(0);

  const [overlayData, setOverlayData] = useState(null);

  // Sync duration, progress, buffered progress with video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (!isSeeking.current) {
        const percentage = (video.currentTime / video.duration) * 100;
        setProgress(Number.isFinite(percentage) ? percentage : 0);
      }

      if (video.buffered.length > 0 && video.duration > 0) {
        for (let i = video.buffered.length - 1; i >= 0; i--) {
          if (video.buffered.start(i) <= video.currentTime) {
            const bufferedEnd = video.buffered.end(i);
            const bufferedPercentage = (bufferedEnd / video.duration) * 100;
            setBufferedProgress(bufferedPercentage);
            break;
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(updateProgress);
    };

    const updateDuration = () => {
      const newDuration = video.duration;
      setDuration(Number.isFinite(newDuration) ? newDuration : 0);
    };

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);

    updateDuration();
    updateProgress();

    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("durationchange", updateDuration);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    return () => {
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("durationchange", updateDuration);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [videoRef, currentSrc]);

  // Keydown effect for '←','→','J','L' keys.
  useEffect(() => {
    let timer;

    const seekRelative = (seconds) => {
      const video = videoRef.current;
      if (!video || !video.duration) return;
      const newTime = video.currentTime + seconds;
      video.currentTime = Math.max(0, Math.min(newTime, video.duration));
    };

    function handleKeyDown(event) {
      const target = event.target;
      const tagName = target.tagName;
      const isSeekbarFocused = tagName === "INPUT" && target.type === "range";
      if ((tagName === "INPUT" && target.type !== "range") || tagName === "TEXTAREA") {
        return;
      }

      let iconName = null;
      if (event.code === "ArrowRight" || event.code === "KeyL") {
        if (isSeekbarFocused && event.code === "ArrowRight") return;
        event.preventDefault();
        seekRelative(10);
        iconName = "forward-10";
      } else if (event.code === "ArrowLeft" || event.code === "KeyJ") {
        if (isSeekbarFocused && event.code === "ArrowLeft") return;
        event.preventDefault();
        seekRelative(-10);
        iconName = "rewind-10";
      } else return;

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
  }, [videoRef, currentSrc]);

  const handleMouseUp = () => {
    isSeeking.current = false;
    const video = videoRef.current;
    if (!video) return;

    if (wasPlayingBeforeSeek.current) {
      video.play();
    }
  };

  const handleMouseDown = () => {
    const video = videoRef.current;
    if (!video) return;

    isSeeking.current = true;
    wasPlayingBeforeSeek.current = !video.paused;
    if (wasPlayingBeforeSeek.current) {
      video.pause();
    }
  };

  const handleChange = (e) => {
    const video = videoRef.current;
    if (!duration) return;

    isSeeking.current = true;
    const seekPercentage = parseFloat(e.target.value);
    video.currentTime = (duration / 100) * seekPercentage;
    setProgress(seekPercentage);
  };

  const handleMouseMove = (e) => {
    const seekbar = e.currentTarget;
    const rect = seekbar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = (offsetX / rect.width) * 100;

    setHoverProgress(Math.max(0, Math.min(percentage, 100)));
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const gradientStyle = {
    background: `linear-gradient(to right, rgb(47, 125, 72) 0%, rgb(47, 125, 72) ${progress}%, transparent ${progress}%, transparent 100%)`,
  };

  return (
    <div className="seekbar-container">
      <input
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={progress}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onChange={handleChange}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="video-controls-inputs seekbar"
        style={gradientStyle}
      />

      <progress
        className={`buffered-progress${isBuffering ? " buffering" : ""}${isHovering ? " hovering" : ""}`}
        min={0}
        max={100}
        value={isBuffering ? 0 : bufferedProgress}
        aria-hidden="true"
      />

      <progress
        className={"hovered-progress"}
        min={0}
        max={100}
        value={hoverProgress}
        style={{ opacity: isHovering ? 1 : 0 }}
        aria-hidden="true"
      />

      {overlayData && createPortal(
        <div
          key={overlayData.id}
          className={`overlay-wrapper-${overlayData.name === "forward-10" ? "forward" : "rewind"}`}>
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
