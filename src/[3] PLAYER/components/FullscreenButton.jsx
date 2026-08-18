// Paths for the fullscreen icon svgs
const enterFullscreenIconPath = "M111.87-111.87v-214.35h91v123.35h123.35v91H111.87Zm522.15 0v-91h123.11v-123.35h91v214.35H634.02ZM111.87-634.02v-214.11h214.35v91H202.87v123.11h-91Zm645.26 0v-123.11H634.02v-91h214.11v214.11h-91Z";
const exitFullscreenIconPath = "M235.22-111.87v-123.35H111.87v-91h214.35v214.35h-91Zm398.8 0v-214.35h214.11v91H725.02v123.35h-91ZM111.87-634.02v-91h123.35v-123.11h91v214.11H111.87Zm522.15 0v-214.11h91v123.11h123.11v91H634.02Z";

export const FullscreenButton = ({ isFullScreen, onClick }) => {
  const label = isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen';

  return (
    <button
      className="video-controls fullscreen-container"
      onClick={onClick}
      aria-label={`${label} (f)`}
    >
      <svg viewBox="0 -960 960 960" className="video-controls-icons">
        <path d={isFullScreen ? exitFullscreenIconPath : enterFullscreenIconPath} />
      </svg>
    </button>
  );
};