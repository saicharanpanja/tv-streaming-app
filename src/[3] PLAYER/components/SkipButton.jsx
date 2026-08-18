// Paths for the skip icon svgs
const skipPreviousIconPath = "M220-240v-480h80v480h-80Zm520 0L380-480l360-240v480Z";
const skipNextIconPath = "M660-240v-480h80v480h-80Zm-440 0v-480l360 240-360 240Z";

export const SkipButton = ({
  direction,
  onClick,
  isDisabled,
  isRendered
}) => {
  if (!isRendered) return null;

  const label = direction === 'previous'
    ? 'Skip Previous (Shift + P)'
    : 'Skip Next (Shift + N)';

  return (
    <button
      className={`video-controls skip-${direction}-container`}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={label}
    >
      <svg viewBox="0 -960 960 960" className="video-controls-icons">
        <path d={direction === 'previous' ? skipPreviousIconPath : skipNextIconPath} />
      </svg>
    </button>
  );
};