import { useState } from "react";
import usePlayingVideoSync from "../hooks/[2] Video Sync/usePlayingVideoSync";
import usePlayToggle from "../hooks/[6] Control Handlers/usePlayToggle";

export default function PlaybackControls({
  videoRef,
  currentIndex
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  usePlayingVideoSync({ setIsPlaying, videoRef, currentIndex });

  const handlePlayToggle = usePlayToggle({ videoRef });

  return (
    <button
      className="video-controls play-pause-container"
      aria-label={`${isPlaying ? "Pause" : "Play"} (k)`}
      onClick={event => {
        event.stopPropagation();
        handlePlayToggle();
      }}
    >
      <svg viewBox="0 -960 960 960" className={`video-controls-icons play${!isPlaying ? "" : " hide"}`}>
        <path d="M311.87-185.41v-589.18L775.07-480l-463.2 294.59Z" />
      </svg>
      <svg viewBox="0 -960 960 960" className={`video-controls-icons pause${isPlaying ? "" : " hide"}`}>
        <path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z" />
      </svg>
    </button>
  );
}