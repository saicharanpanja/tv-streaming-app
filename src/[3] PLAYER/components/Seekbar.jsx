import { useState, useRef, useCallback } from 'react';
import useBufferingVideoSync from '../hooks/[2] Video Sync/useBufferingVideoSync';
import useProgressAnimationVideoSync from '../hooks/[2] Video Sync/useProgressAnimationVideoSync';

// A self-contained helper function for formatting time
const formatTime = (timeInSeconds) => {
  const time = Math.floor(timeInSeconds);
  if (!Number.isFinite(time) || time < 0) {
    return "00:00";
  }

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

const getClientX = (event) => {
  if (event.touches && event.touches.length > 0) {
    return event.touches[0].clientX;
  }
  return event.clientX;
};

export const Seekbar = ({
  videoRef,
  currentIndex
}) => {
  const [hoverData, setHoverData] = useState(null);
  const [isBuffering, setIsBuffering] = useState(false);

  // DOM-Refs
  const seekbarTooltipRef = useRef(null);
  const seekbarTrackWrapperRef = useRef(null);
  const seekbarContainerRef = useRef(null);
  const seekbarInputRef = useRef(null);

  // Mutable values
  const isSeekingRef = useRef(false);
  const wasPlayingBeforeSeekRef = useRef(false);

  useBufferingVideoSync({ videoRef, currentIndex, setIsBuffering });
  useProgressAnimationVideoSync({ videoRef, seekbarContainerRef, seekbarInputRef, isSeekingRef });

  /* ----- SEEK HANDLERS -----*/
  const handlePointerMove = useCallback((e) => {
    const track = seekbarTrackWrapperRef.current;
    const tooltip = seekbarTooltipRef.current;
    const duration = videoRef.current.duration;

    // Safety checks
    if (!track || !tooltip || !duration) {
      if (hoverData !== null) setHoverData(null);
      return;
    }

    // --- DOM Measurements ---
    const trackRect = track.getBoundingClientRect();
    const trackWidth = trackRect.width;
    const tooltipWidth = tooltip.offsetWidth;
    const containerWidth = track.parentElement.offsetWidth;

    // --- Position & Time Calculation ---
    const clientX = getClientX(e);
    const positionX = clientX - trackRect.left;
    const clampedPositionX = Math.max(0, Math.min(positionX, trackWidth));
    const hoverPercentage = (clampedPositionX / trackWidth) * 100;
    const timeInSeconds = (duration * hoverPercentage) / 100;

    // --- Tooltip Position Calculation ---
    // This logic keeps the tooltip from going off the edges of the seekbar container
    const idealTipPosition = (clampedPositionX + 12) - (tooltipWidth / 2); // 12 is seekbar-container's left padding
    const minTipPosition = 12;
    const maxTipPosition = containerWidth - tooltipWidth - 12;
    const finalTipPosition = Math.max(minTipPosition, Math.min(idealTipPosition, maxTipPosition));

    // --- Line Color ---
    const progress = (videoRef.current.currentTime / duration) * 100
    const lineColor = hoverPercentage > progress ? "#fafafa" : "#333";

    setHoverData({
      time: formatTime(timeInSeconds),
      linePosition: clampedPositionX,
      tipPosition: finalTipPosition,
      lineColor: lineColor
    });
  }, [hoverData, videoRef]);

  const handlePointerDown = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    isSeekingRef.current = true;
    wasPlayingBeforeSeekRef.current = !video.paused;

    if (wasPlayingBeforeSeekRef.current) video.pause();
  }, [videoRef]);

  const handlePointerUp = useCallback(() => {
    const video = videoRef.current;
    isSeekingRef.current = false;

    if (video && wasPlayingBeforeSeekRef.current) video.play();
    setHoverData(null);
  }, [videoRef]);

  const handleSeek = useCallback((newProgress) => {
    const video = videoRef.current;
    const duration = video.duration;
    if (!video || !duration) return;

    video.currentTime = (duration / 100) * newProgress;
  }, [videoRef]);

  return (
    <div
      ref={seekbarContainerRef}
      className={`seekbar-container${isBuffering ? " buffering" : ""}`}
    >
      <div
        ref={seekbarTooltipRef}
        className="hover-tooltip"
        style={{
          opacity: hoverData ? 1 : 0,
          left: `${hoverData?.tipPosition || 0}px`
        }}
      >
        {hoverData?.time || "00:00"}
      </div>

      <input
        ref={seekbarInputRef}
        className="play-progress-input"
        type="range"
        min={0}
        max={100}
        step="any"
        aria-label="Video progress"

        // --- Event Listeners ---
        onChange={(e) => handleSeek(parseFloat(e.target.value))}

        // Mouse Events
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onMouseMove={handlePointerMove}
        onMouseLeave={() => setHoverData(null)}

        // Touch Events (Mobile)
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
        onTouchMove={handlePointerMove}
        style={{ touchAction: "none" }}
      />

      <div ref={seekbarTrackWrapperRef} className="seekbar-track-wrapper">
        <div className="seekbar-track" />

        <div
          className="buffer-progress"
          style={{ width: `var(--buffer-progress, 0%)` }}
        />

        <div
          className="play-progress-fill"
          style={{ width: `var(--video-progress, 0%)` }}
        />

        <div
          className="hover-line"
          style={{
            opacity: hoverData ? 1 : 0,
            left: `${hoverData?.linePosition || 0}px`,
            backgroundColor: hoverData?.lineColor || "#333"
          }}
        />

        <div
          className="progress-thumb"
          style={{ left: `var(--video-progress, 0%)` }}
        />
      </div>
    </div>
  );
};