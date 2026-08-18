import { useCallback } from "react";

function useCaptionsToggle({ captionsArray, setCaptionsLabel }) {
  const handleCaptionsToggle = useCallback(() => {
    const captionsLabel = localStorage.getItem("player:captions");

    if (captionsArray.length < 1) return;

    if (captionsLabel !== 'Disabled') {
      setCaptionsLabel('Disabled');
    } else {
      const lastActive = localStorage.getItem("player:lastActiveCaption");
      const firstAvailable = captionsArray[1]
        ? ({ de: 'Deutsch', deu: 'Deutsch', ger: 'Deutsch' }[captionsArray[1].language] || captionsArray[1].label)
        : 'Disabled';

      setCaptionsLabel(lastActive || firstAvailable);
    }
  }, [captionsArray, setCaptionsLabel]);

  return handleCaptionsToggle;
}

export default useCaptionsToggle;