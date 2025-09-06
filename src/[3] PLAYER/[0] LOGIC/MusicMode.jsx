import Icon from "../[2] UTILS/Icon";

function MusicMode() {

  return (
    <button className="video-controls music-mode-container">
      <Icon
        name="music-mode-on"
        className={`video-controls-icons music-mode-on`}
      />
    </button>
  );
}

export default MusicMode;