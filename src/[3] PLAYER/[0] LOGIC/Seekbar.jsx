import { useEffect, useRef, useState } from "react";
import Icon from "../[2] UTILS/Icon";

export default function Seekbar({
  videoRef,
  currentSrc,
}) {
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
    const linePosition = clampedPositionX;

    // --- Tip Position Calculation ---
    const idealTipPosition = (linePosition + 12) - (tooltipWidth / 2);  // 12 is container's left padding
    const minTipPosition = 12;
    const maxTipPosition = containerWidth - tooltipWidth - 12;
    const finalTipPosition = Math.max(minTipPosition, Math.min(idealTipPosition, maxTipPosition));

    // --- Time Calculation ---
    const hoverPercentage = (clampedPositionX / trackWidth) * 100;
    const timeInSeconds = (duration * hoverPercentage) / 100;

    // --- Line Color ---
    const lineColor = hoverPercentage > progress ? "#fafafa" : "#333";

    setHoverData({
      time: formatTime(timeInSeconds),
      linePosition: linePosition,
      tipPosition: finalTipPosition,
      lineColor: lineColor
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
        <div
          className="hover-line"
          style={{
            opacity: hoverData ? 1 : 0,
            left: hoverData?.linePosition || 0,
            backgroundColor: hoverData?.lineColor || "#333"
          }}
        />
        <div className="progress-thumb" style={{ left: `${progress}%` }} />
      </div>
    </div>
  );
}
