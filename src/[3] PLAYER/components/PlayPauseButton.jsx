
export const PlayPauseButton = ({ isPlaying, onClick }) => {
  const label = isPlaying ? "Pause" : "Play";
  
  return (
    <button 
      className="video-controls play-pause-container" 
      onClick={onClick}
      aria-label={`${label} (k)`}
    >
      <svg viewBox="0 -960 960 960" className={`video-controls-icons play${!isPlaying ? "" : " hide"}`}>
        <path d="M311.87-185.41v-589.18L775.07-480l-463.2 294.59Z" />
      </svg>
      <svg viewBox="0 -960 960 960" className={`video-controls-icons pause${isPlaying ? "" : " hide"}`}>
        <path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z" />
      </svg>
    </button>
  );
};