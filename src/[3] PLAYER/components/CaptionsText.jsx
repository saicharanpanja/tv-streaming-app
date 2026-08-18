
export default function CaptionsText({ captionsText, captionsLabel }) {
  return (
    <>
      {(captionsText && captionsLabel !== "Disabled") &&
        <div className="captionstext-container">
          <span>{captionsText}</span>
        </div>
      }
    </>
  );
}