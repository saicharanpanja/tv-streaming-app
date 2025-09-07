import { useState } from "react";
import Icon from "../[2] UTILS/Icon";

function MusicMode() {
  const [isMusicMode, setIsMusicMode] = useState(false);

  return (
    <button 
      className="video-controls music-mode-container"
      onClick={()=>setIsMusicMode(!isMusicMode)}
    >
      <Icon
        name="music-mode-off"
        className={`video-controls-icons music-mode-off${!isMusicMode ? "" : " hide"}`}
      />
      <Icon
        name="music-mode-on"
        color="#2f7d48"
        className={`video-controls-icons music-mode-on${isMusicMode ? "" : " hide"}`}
      />
    </button>
  );
}

export default MusicMode;