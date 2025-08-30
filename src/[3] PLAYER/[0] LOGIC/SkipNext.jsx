import Icon from "../[2] UTILS/Icon";

function SkipNext({
  onNext, 
  isDisabled
}) {
  return (
    <button 
      className="video-controls skip-next-container"
      onClick={onNext}
      disabled={isDisabled}
    >
      <Icon
        name="skip-next"
        className={"video-controls-icons"}
      />
    </button>
  );
}

export default SkipNext;