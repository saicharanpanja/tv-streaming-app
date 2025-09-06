import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Icon from "../[2] UTILS/Icon";

export default function Seekbar({ videoRef }) {
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [bufferedProgress, setBufferedProgress] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [overlayData, setOverlayData] = useState(null);

  const isSeekingRef = useRef(false);
  const rafRef = useRef(null);
  const ignoreBufferUpdateRef = useRef(false);
  const bufferUpdateTimeoutRef = useRef(null);

  useEffect(() => {
    const video = videoRef?.current;
    if (!video) return;

    let mounted = true;

    function update() {
      if (!mounted) return;

      if (video.duration && isFinite(video.duration) && video.duration > 0) {
        setDuration(video.duration);
      }

      if (!isSeekingRef.current && video.duration && !isNaN(video.currentTime)) {
        const percentage = (video.currentTime / video.duration) * 100;
        setProgress(Number.isFinite(percentage) ? percentage : 0);
      }


      if ((isSeekingRef.current || ignoreBufferUpdateRef.current)
        || (video.paused && video.readyState < 2)) {
        setBufferedProgress(0);
      } else {
        if (video.buffered && video.duration) {
          let bufferedEnd = 0;
          for (let i = 0; i < video.buffered.length; i++) {
            if (
              video.buffered.start(i) <= video.currentTime &&
              video.currentTime <= video.buffered.end(i)
            ) {
              bufferedEnd = video.buffered.end(i);
              break;
            }
            bufferedEnd = video.buffered.end(video.buffered.length - 1);
          }
          const bufferedPercent = ((bufferedEnd / video.duration) * 100);
          setBufferedProgress(bufferedPercent);
        }
      }

      rafRef.current = requestAnimationFrame(update);
    }

    const startLoop = () => rafRef.current = !rafRef.current && requestAnimationFrame(update);
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);

    video.addEventListener("loadedmetadata", startLoop);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    if (video.readyState >= 1) startLoop();

    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (bufferUpdateTimeoutRef.current) clearTimeout(bufferUpdateTimeoutRef.current);
      video.removeEventListener("loadedmetadata", startLoop);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
    };
  }, [videoRef]);

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
  }, [videoRef]);

  const handleSeekEnd = useCallback(() => {
    window.removeEventListener("pointerup", handleSeekEnd);
    isSeekingRef.current = false;
    const video = videoRef?.current;
    if (!video || !video.duration) return;

    // Ignore buffer updates briefly after seek ends to prevent jump to 100%
    ignoreBufferUpdateRef.current = true;
    if (bufferUpdateTimeoutRef.current) clearTimeout(bufferUpdateTimeoutRef.current);
    bufferUpdateTimeoutRef.current = setTimeout(() => {
      ignoreBufferUpdateRef.current = false;
    }, 600); // 600ms delay, tweak if needed

    const sec = (progress / 100) * video.duration;
    video.currentTime = Math.min(Math.max(sec, 0), video.duration);
  }, [progress, videoRef, isSeekingRef, ignoreBufferUpdateRef, bufferUpdateTimeoutRef]);

  useEffect(() => {
    return () => {
      window.removeEventListener("pointerup", handleSeekEnd);
    };
  }, [handleSeekEnd]);

  function handleSeekStart() {
    isSeekingRef.current = true;
    window.addEventListener("pointerup", handleSeekEnd);
  }

  function handleSeekChange(e) {
    const val = parseFloat(e.target.value);
    if (Number.isNaN(val)) return;
    setProgress(val);
  }

  const gradientStyle = {
    background: `linear-gradient(to right, rgb(47, 125, 72) 0%, rgb(47, 125, 72) ${progress}%, transparent ${progress}%, transparent 100%)`,
  };

  return (
    <div className="seekbar-container">
      <input
        type="range"
        min={0}
        max={100}
        step={0.01}
        value={progress}
        onPointerDown={handleSeekStart}
        onMouseDown={handleSeekStart}
        onTouchStart={handleSeekStart}
        onChange={handleSeekChange}
        onPointerUp={handleSeekEnd}
        onMouseUp={handleSeekEnd}
        onTouchEnd={handleSeekEnd}
        className="video-controls-inputs seekbar"
        style={gradientStyle}
        aria-label="Seek"
      />
      <progress
        className={`buffered-progress ${isBuffering ? "buffering" : ""}`}
        max={100}
        value={isBuffering ? 0 : bufferedProgress}
        aria-hidden="true"
      />

      {overlayData && createPortal(
        <div 
          key={overlayData.id} 
          className={`overlay-wrapper-${overlayData.name==="forward-10" ? "forward" : "rewind"}`}>
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
