import { useEffect, useCallback } from "react";
import useSkipNext from "./[6] Control Handlers/useSkipNext";
import usePlayToggle from "./[6] Control Handlers/usePlayToggle";
import useSkipPrev from "./[6] Control Handlers/useSkipPrev";
import useMuteToggle from "./[6] Control Handlers/useMuteToggle";
import useVolumeChange from "./[6] Control Handlers/useVolumeChange";
import useCaptionsToggle from "./[6] Control Handlers/useCaptionsToggle";
import useFullscreenToggle from "./[6] Control Handlers/useFullscreenToggle";

const shouldIgnoreKeyPress = (event, options = {}) => {
  const { allowRange = true, allowRepeat = false, allowShift = false } = options;
  const { target, ctrlKey, altKey, metaKey, shiftKey, repeat } = event;
  if (ctrlKey || altKey || metaKey) return true;
  if (!allowShift && shiftKey) return true;
  if (target.tagName === 'INPUT') return !(allowRange && target.type === 'range');
  if (target.tagName === 'TEXTAREA' || target.isContentEditable) return true;
  if (repeat && !allowRepeat) return true;
  return false;
};

function useKeyboard({ videoRef, containerRef, setCurrentIndex, captionsArray, setCaptionsLabel, setOverlayData, overlayTimerRef }) {

  // Helper to seek
  const seekRelative = useCallback((seconds) => {
    const video = videoRef.current;
    if (!video.duration) return;

    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration));

    const iconName = seconds > 0 ? "forward-10" : "rewind-10";
    setOverlayData({ name: iconName, id: Date.now() });
    clearTimeout(overlayTimerRef.current);
    overlayTimerRef.current = setTimeout(() => setOverlayData(null), 500);
  }, [overlayTimerRef, setOverlayData, videoRef]);

  // Helper to skip next, prev
  const handleSkipNext = useSkipNext({ setCurrentIndex });
  const handleSkipPrev = useSkipPrev({ setCurrentIndex });
  const skipTo = useCallback((direction) => {
    direction === "prev" ? handleSkipPrev() : handleSkipNext();

    const iconName = direction === "prev" ? "skip-previous" : "skip-next";
    setOverlayData({ name: iconName, id: Date.now() });
    clearTimeout(overlayTimerRef.current);
    overlayTimerRef.current = setTimeout(() => setOverlayData(null), 500);
  }, [handleSkipNext, handleSkipPrev, overlayTimerRef, setOverlayData]);

  // Helper to toggle play
  const handlePlayToggle = usePlayToggle({ videoRef });
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    handlePlayToggle();

    const iconName = video.paused || video.ended ? "play" : "pause";
    setOverlayData({ name: iconName, id: Date.now() });
    clearTimeout(overlayTimerRef.current);
    overlayTimerRef.current = setTimeout(() => setOverlayData(null), 500);
  }, [handlePlayToggle, overlayTimerRef, setOverlayData, videoRef]);

  // Helper to toggle mute
  const handleMuteToggle = useMuteToggle({ videoRef });
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    handleMuteToggle();

    //READ-ONLY: video.muted
    const iconName = video.muted ? "volume-off" : "volume-up";
    setOverlayData({ name: iconName, id: Date.now() });
    clearTimeout(overlayTimerRef.current);
    overlayTimerRef.current = setTimeout(() => setOverlayData(null), 500);
  }, [handleMuteToggle, overlayTimerRef, setOverlayData, videoRef]);

  // Helper to change Volume
  const handleVolumeChange = useVolumeChange({ videoRef });
  const changeVolume = useCallback((direction) => {
    const video = videoRef.current;
    if (!video) return;

    const change = direction === "up" ? 0.1 : -0.1;
    //READ-ONLY: video.volume
    const newVolume = Math.max(0, Math.min(1, video.volume + change));
    handleVolumeChange(newVolume);

    const iconName = direction === "up" ? "volume-up" : (newVolume === 0 ? "volume-off" : "volume-down");
    setOverlayData({ name: iconName, id: Date.now() });
    clearTimeout(overlayTimerRef.current);
    overlayTimerRef.current = setTimeout(() => setOverlayData(null), 500);
  }, [handleVolumeChange, overlayTimerRef, setOverlayData, videoRef]);

  // Helper to toggle captions
  const handleCaptionsToggle = useCaptionsToggle({ captionsArray, setCaptionsLabel });
  const toggleCaptions = useCallback(() => {
    handleCaptionsToggle();

    setOverlayData({ name: "captions", id: Date.now() });
    clearTimeout(overlayTimerRef.current);
    overlayTimerRef.current = setTimeout(() => setOverlayData(null), 500);
  }, [handleCaptionsToggle, overlayTimerRef, setOverlayData]);

  // Helper to toggle fullscreen
  const handleFullscreenToggle = useFullscreenToggle({ videoRef, containerRef });
  const toggleFullscreen = useCallback(() => {
    handleFullscreenToggle();
  }, [handleFullscreenToggle]);

  /*-------- KEYBOARD SHORTCUT SIDE-EFFECTS -------*/
  // J/L keys for seek control
  useEffect(() => {
    const handleSeek1Shortcuts = (event) => {
      if (shouldIgnoreKeyPress(event, { allowRepeat: true, allowRange: true })) return;

      if (event.code === "KeyL") seekRelative(10);
      else if (event.code === "KeyJ") seekRelative(-10);
    }

    document.addEventListener("keydown", handleSeek1Shortcuts);
    return () => document.removeEventListener("keydown", handleSeek1Shortcuts);
  }, [seekRelative]);

  // Arrow left and right keys for seek control
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleSeek2Shortcuts = (event) => {
      if (shouldIgnoreKeyPress(event, { allowRepeat: true, allowRange: false })) return;

      if (event.code === "ArrowRight") {
        event.preventDefault();
        seekRelative(10);
      } else if (event.code === "ArrowLeft") {
        event.preventDefault();
        seekRelative(-10);
      }
    }

    container.addEventListener("keydown", handleSeek2Shortcuts);
    return () => container.removeEventListener("keydown", handleSeek2Shortcuts);
  }, [containerRef, seekRelative]);

  // Number keys for seek control
  useEffect(() => {
    const handleSeek3Shortcuts = (event) => {
      const video = videoRef.current;
      const digit = parseInt(event.key, 10);

      if (!isNaN(digit) && !shouldIgnoreKeyPress(event) && video.duration) {
        video.currentTime = (video.duration / 100) * (digit * 10);
      }
    }

    document.addEventListener("keydown", handleSeek3Shortcuts);
    return () => document.removeEventListener("keydown", handleSeek3Shortcuts);
  }, [videoRef]);

  // Home, End keys for seek control
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleSeek4Shortcuts = (event) => {
      if (shouldIgnoreKeyPress(event, { allowRepeat: true })) return;

      if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        const video = videoRef.current;
        if (!video.duration || event.repeat) return;
        video.currentTime = event.key === 'Home' ? 0 : video.duration;
      }
    }

    container.addEventListener("keydown", handleSeek4Shortcuts);
    return () => container.removeEventListener("keydown", handleSeek4Shortcuts);
  }, [containerRef, videoRef]);

  // Shift + N, Shift + P keys for skip control
  useEffect(() => {
    const handleSkipShortcuts = (event) => {
      if (shouldIgnoreKeyPress(event, { allowRepeat: true, allowShift: true })) return;
      if (event.shiftKey && event.code === "KeyP") skipTo("prev");
      else if (event.shiftKey && event.code === "KeyN") skipTo("next");
    }

    document.addEventListener("keydown", handleSkipShortcuts);
    return () => document.removeEventListener("keydown", handleSkipShortcuts);
  }, [skipTo]);

  // K key for playback toggle
  useEffect(() => {
    const handlePlayback1Shortcut = (event) => {
      if (event.code === "KeyK" && !shouldIgnoreKeyPress(event)) togglePlay();
    }

    document.addEventListener("keydown", handlePlayback1Shortcut);
    return () => document.removeEventListener("keydown", handlePlayback1Shortcut);
  }, [togglePlay]);

  // Space key for playback toggle
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePlayback2Shortcut = (event) => {
      if (shouldIgnoreKeyPress(event, { allowRepeat: true })) return;

      if (event.code === 'Space' && document.activeElement.tagName !== 'BUTTON') {
        event.preventDefault();
        if (!event.repeat) togglePlay();
      }
    }

    container.addEventListener("keydown", handlePlayback2Shortcut);
    return () => container.removeEventListener("keydown", handlePlayback2Shortcut);
  }, [containerRef, togglePlay]);

  // M key for mute toggle
  useEffect(() => {
    const handleMuteShortcut = (event) => {
      if (event.code === "KeyM" && !shouldIgnoreKeyPress(event)) toggleMute();
    }

    document.addEventListener("keydown", handleMuteShortcut);
    return () => document.removeEventListener("keydown", handleMuteShortcut);
  }, [toggleMute]);

  // Arrow up and down keys for volume change
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleVolumeShortcuts = (event) => {
      if (shouldIgnoreKeyPress(event, { allowRepeat: true, allowRange: false })) return;

      if (event.code === "ArrowUp") {
        event.preventDefault();
        changeVolume("up");
      } else if (event.code === "ArrowDown") {
        event.preventDefault();
        changeVolume("down");
      }
    }

    container.addEventListener("keydown", handleVolumeShortcuts);
    return () => container.removeEventListener("keydown", handleVolumeShortcuts);
  }, [changeVolume, containerRef]);

  // C key for caption toggle
  useEffect(() => {
    const handleCaptionShortcut = (event) => {
      if (event.code === "KeyC" && !shouldIgnoreKeyPress(event)) toggleCaptions();
    }

    document.addEventListener("keydown", handleCaptionShortcut);
    return () => document.removeEventListener("keydown", handleCaptionShortcut);
  }, [toggleCaptions]);

  // F key for fullscreen toggle
  useEffect(() => {
    const handleFullscreenShortcut = (event) => {
      if (event.code === "KeyF" && !shouldIgnoreKeyPress(event)) toggleFullscreen();
    }

    document.addEventListener("keydown", handleFullscreenShortcut);
    return () => document.removeEventListener("keydown", handleFullscreenShortcut);
  }, [toggleFullscreen]);
}

export default useKeyboard;