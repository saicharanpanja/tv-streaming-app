import { useEffect } from 'react';
import Hls from "hls.js";
import { CaretLeftIcon } from '@phosphor-icons/react';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5];

export default function SpeedMenu({
  activeMenuTab,
  setActiveMenuTab,
  playbackRate,
  setPlaybackRate,
  isMenuOpen,
  videoRef
}) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    function applyInitialRate() {
      try {
        video.playbackRate = playbackRate;
        if ("preservesPitch" in video) video.preservesPitch = true;
        else if ("mozPreservesPitch" in video) video.mozPreservesPitch = true;
        else if ("webkitPreservesPitch" in video) video.webkitPreservesPitch = true;
      } catch (err) {
        console.warn(
          "[Player] Failed to apply playback rate:",
          playbackRate,
          err
        );
      }
    }

    if (Hls.isSupported() || video.canPlayType("application/vnd.apple.mpegurl")) {
      video.addEventListener("loadedmetadata", applyInitialRate);
      return () => {
        video.removeEventListener("loadedmetadata", applyInitialRate);
      };
    }
  }, [playbackRate, videoRef]);

  useEffect(() => {
    try {
      localStorage.setItem("player:playbackRate", playbackRate.toString());
      const video = videoRef.current;
      if (video && video.playbackRate !== playbackRate) {
        video.playbackRate = playbackRate;
      }
    } catch (err) {
      console.error(
        "[Player] Could not save or apply playback rate:",
        playbackRate,
        err
      );
    }
  }, [playbackRate, videoRef]);

  return (
    <div
      className={`settings-menu speed${isMenuOpen && activeMenuTab === "speed" ? "" : " hide"}`}
    >
      <div
        className="settings-menu speed-item"
        onClick={() => setActiveMenuTab("main")}
        onKeyDown={(e) => e.key === "Enter" && setActiveMenuTab("main")}
      >
        <CaretLeftIcon size={12} weight="bold" />
        <span>Speed</span>
      </div>

      <span className="settings-menu speed-item-divider"></span>

      {SPEEDS.map((s) => {
        const label = s === 1 ? "Normal" : `${s}×`;
        const selected = playbackRate === s;
        return (
          <div
            key={s}
            onClick={() => {
              setPlaybackRate(s);
              setActiveMenuTab("main");
            }}
            className="settings-menu speed-item"
          >
            <span className={`settings-menu speed-item-radio${selected ? " selected" : ""}`} />
            <span className="option-label">{label}</span>
          </div>
        );
      })}
    </div>
  );
}