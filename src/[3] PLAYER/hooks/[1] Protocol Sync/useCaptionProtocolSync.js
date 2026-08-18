import { useEffect } from 'react';

function useCaptionProtocolSync({captionsArray, captionsLabel, setCaptionsLabel, setCaptionsText}) {
  // Sync CaptionsLabel and CaptionsText with Protocol whenever user choice changes.
  useEffect(() => {
    if (captionsArray.length > 0) {
      const getConsistentLabel = track => {
        const langMap = { de: 'Deutsch', deu: 'Deutsch', ger: 'Deutsch' };
        return langMap[track.language] || track.label;
      };

      let trackFound = null;
      captionsArray.forEach(track => {
        if (captionsLabel !== "Disabled" && getConsistentLabel(track) === captionsLabel) {
          track.mode = 'hidden';
          trackFound = track;
        } else {
          track.mode = 'disabled';
        }
      });

      if (trackFound) {
        const handleCueChange = () => {
          const text = trackFound.activeCues?.[0]?.text || '';
          setCaptionsText(text.replace(/<[^>]+>/g, ''));
        }

        handleCueChange();
        trackFound.addEventListener('cuechange', handleCueChange);
        return () => {
          trackFound.removeEventListener('cuechange', handleCueChange);
        };
      } else setCaptionsText('');

      if (!trackFound && captionsLabel !== 'Disabled') {
        setCaptionsLabel(getConsistentLabel(captionsArray[1]));
      }
    } else setCaptionsText('');
  }, [captionsArray, captionsLabel, setCaptionsLabel, setCaptionsText]);
}

export default useCaptionProtocolSync;