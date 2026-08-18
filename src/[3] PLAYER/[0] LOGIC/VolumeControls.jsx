import { useState } from "react";
import useMuteStorageSync from "../hooks/[0] Storage Sync/useMuteStorageSync";
import useVolumeStorageSync from "../hooks/[0] Storage Sync/useVolumeStorageSync";
import useMuteVideoSync from "../hooks/[2] Video Sync/useMuteVideoSync";
import useVolumeVideoSync from "../hooks/[2] Video Sync/useVolumeVideoSync";
import useVolumeChange from "../hooks/[6] Control Handlers/useVolumeChange";
import useMuteToggle from "../hooks/[6] Control Handlers/useMuteToggle";

export default function VolumeControls({ videoRef, currentIndex }) {
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem("player:volume");
    return savedVolume !== null ? parseFloat(savedVolume) : 0.75;
  });

  const [isMuted, setIsMuted] = useState(() => {
    const savedMute = localStorage.getItem("player:muted");
    return savedMute === "true";
  });

  const icon = isMuted || volume === 0 ? 'volume-off' : volume < 0.5 ? 'volume-down' : 'volume-up';

  useMuteStorageSync({ isMuted });
  useVolumeStorageSync({ volume });

  useMuteVideoSync({ videoRef, currentIndex, setIsMuted, isMuted });
  useVolumeVideoSync({ videoRef, currentIndex, setVolume, volume });

  const handleVolumeChange = useVolumeChange({ videoRef });
  const handleMuteToggle = useMuteToggle({ videoRef });

  return (
    <div className="video-controls volume-container">
      <button
        className="video-controls volume-button-container"
        onClick={handleMuteToggle}
        aria-label="Mute/Unmute (m)"
      >
        <svg viewBox="0 -960 960 960" className={`video-controls-icons volume-off${icon === 'volume-off' ? "" : " hide"}`}>
          <path d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Z" />
        </svg>
        <svg viewBox="0 -960 960 960" className={`video-controls-icons volume-up${icon === 'volume-up' ? "" : " hide"}`}>
          <path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320Z" />
        </svg>
        <svg viewBox="0 -960 960 960" className={`video-controls-icons volume-down${icon === 'volume-down' ? "" : " hide"}`}>
          <path d="M200-360v-240h160l200-200v640L360-360H200Zm440 40v-322q45 21 72.5 65t27.5 97q0 53-27.5 96T640-320Z" />
        </svg>
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={isMuted ? 0 : volume}
        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
        className="video-controls-inputs volume"
        style={{ "--val": isMuted ? 0 : volume }}
        aria-label="Volume"
      />
    </div>
  );
}