import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "../[2] UTILS/Icon";

export default function Seekbar({ videoRef, currentSrc }) {
  // Refs for DOM elements and state that doesn't trigger re-renders
  const isSeeking = useRef(false);
  const wasPlayingBeforeSeek = useRef(false);
  const animationFrameId = useRef();
  const trackWrapperRef = useRef(null);
  const tooltipRef = useRef(null);

  // Component state
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [bufferedProgress, setBufferedProgress] = useState(0);
  const [overlayData, setOverlayData] = useState(null);
  const [hoverData, setHoverData] = useState(null);

  // Helper function to format seconds into MM:SS or HH:MM:SS
  const formatTime = (timeInSeconds) => {
    const time = Math.floor(timeInSeconds);
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    const formattedSeconds = seconds.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    if (hours > 0) {
      return `${hours}:${formattedMinutes}:${formattedSeconds}`;
    }
    return `${formattedMinutes}:${formattedSeconds}`;
  };

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
      video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration));
    };
    const handleKeyDown = (event) => {
      const { target, code } = event;
      const tagName = target.tagName;
      if ((tagName === "INPUT" && target.type !== "range") || tagName === "TEXTAREA") return;
      const isSeekbarFocused = tagName === "INPUT" && target.type === "range";

      let iconName = null;
      if ((code === "ArrowRight" || code === "KeyL") && !(isSeekbarFocused && code === "ArrowRight")) {
        event.preventDefault();
        seekRelative(10);
        iconName = "forward-10";
      } else if ((code === "ArrowLeft" || code === "KeyJ") && !(isSeekbarFocused && code === "ArrowLeft")) {
        event.preventDefault();
        seekRelative(-10);
        iconName = "rewind-10";
      }

      if (iconName) {
        setOverlayData({ name: iconName, id: Date.now() });
        clearTimeout(timer);
        timer = setTimeout(() => setOverlayData(null), 500);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [videoRef, currentSrc]);

  const handleMouseUp = () => {
    isSeeking.current = false;
    if (videoRef.current && wasPlayingBeforeSeek.current) {
      videoRef.current.play();
    }
  };

  const handleMouseDown = () => {
    if (!videoRef.current) return;
    isSeeking.current = true;
    wasPlayingBeforeSeek.current = !videoRef.current.paused;
    if (wasPlayingBeforeSeek.current) videoRef.current.pause();
  };

  const handleChange = (e) => {
    if (!videoRef.current || !duration) return;
    isSeeking.current = true;
    const seekPercentage = parseFloat(e.target.value);
    videoRef.current.currentTime = (duration / 100) * seekPercentage;
    setProgress(seekPercentage);
  };

  const handleMouseMove = (e) => {
    const track = trackWrapperRef.current;
    const tooltip = tooltipRef.current;
    if (!track || !tooltip || !duration) {
      if (hoverData !== null) setHoverData(null);
      return;
    }

    // Get Measurements ---
    const trackRect = track.getBoundingClientRect();
    const trackWidth = trackRect.width;
    const tooltipWidth = tooltip.offsetWidth;
    const containerWidth = track.parentElement.offsetWidth;

    // Position of cursor relative to the track's start
    const positionX = e.clientX - trackRect.left;
    const clampedPositionX = Math.max(0, Math.min(positionX, trackWidth));

    // --- Line Position Calculation ---
    const linePosition = 12 + clampedPositionX; // 12 is container's left padding

    // --- Tip Position Calculation ---
    const idealTipPosition = linePosition - (tooltipWidth / 2);
    const minTipPosition = 6;
    const maxTipPosition = containerWidth - tooltipWidth - 6;
    const finalTipPosition = Math.max(minTipPosition, Math.min(idealTipPosition, maxTipPosition));

    // --- Time Calculation ---
    const hoverPercentage = (clampedPositionX / trackWidth) * 100;
    const timeInSeconds = (duration * hoverPercentage) / 100;

    setHoverData({
      time: formatTime(timeInSeconds),
      linePosition: linePosition,
      tipPosition: finalTipPosition,
    });
  };

  return (
    <div
      className={`seekbar-container${isBuffering ? " buffering" : ""}`}
      onMouseEnter={handleMouseMove}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverData(null)}
    >
      <div
        ref={tooltipRef}
        className="hover-tooltip"
        style={{ opacity: hoverData ? 1 : 0, left: hoverData?.tipPosition || 0 }}
      >
        {hoverData?.time || "00:00"}
      </div>

      <div
        className="hover-line"
        style={{ opacity: hoverData ? 1 : 0, left: hoverData?.linePosition || 0 }}
      />

      <input
        className="play-progress-input"
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={progress}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onChange={handleChange}
        aria-label="Video progress"
      />

      <div ref={trackWrapperRef} className="seekbar-track-wrapper">
        <div className="seekbar-track" />
        <div className="buffer-progress" style={{ width: `${bufferedProgress}%` }} />
        <div className="play-progress-fill" style={{ width: `${progress}%` }} />
        <div className="progress-thumb" style={{ left: `${progress}%` }} />
      </div>

      {overlayData &&
        createPortal(
          <div
            key={overlayData.id}
            className={`overlay-wrapper-${overlayData.name === "forward-10" ? "forward" : "rewind"}`}
          >
            <Icon name={overlayData.name} size="3.5vw" color="rgba(255,255,255,0.8)" />
          </div>,
          document.querySelector(".player-container")
        )}
    </div>
  );
}
