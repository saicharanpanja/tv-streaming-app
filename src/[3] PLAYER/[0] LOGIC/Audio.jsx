import { useState } from "react";
import Icon from "../[2] UTILS/Icon";

function Audio() {
  const [isAudioMode, setIsAudioMode] = useState(false);

  return (
    <button 
      className="video-controls audio-mode-container"
      onClick={()=>setIsAudioMode(!isAudioMode)}
    >
      <Icon
        name="audio-mode-off"
        className={`video-controls-icons audio-mode-off${!isAudioMode ? "" : " hide"}`}
      />
      <Icon
        name="audio-mode-on"
        color="#2f7d48"
        className={`video-controls-icons audio-mode-on${isAudioMode ? "" : " hide"}`}
      />
    </button>
  );
}

export default Audio;