import Icon from "../[2] UTILS/Icon";

function SkipPrev({
  onPrev,
  isDisabled
}) {
  return (
    <button 
      className="video-controls skip-previous-container"
      onClick={onPrev}
      disabled={isDisabled}
    >
      <Icon
        name="skip-previous"
        className={"video-controls-icons"}
      />
    </button>
  );
}

export default SkipPrev;