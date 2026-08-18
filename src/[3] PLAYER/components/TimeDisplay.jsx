import { useState } from 'react';
import useProgressDurationVideoSync from '../hooks/[2] Video Sync/useProgressDurationVideoSync';
import "../[1] STYLES/TimeDisplay.css";

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

function TimeDisplay({ videoRef, currentIndex }) {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useProgressDurationVideoSync({ videoRef, currentIndex, setDuration, setProgress });

  return (
    <div className="video-controls time-display-container">
      {`${formatTime(progress)} / ${formatTime(duration)}`}
    </div>
  );

}

export default TimeDisplay;