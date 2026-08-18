import { useEffect } from 'react';

function useQualityProtocolSync({qualitiesArray, qualityLabel, setQualityLabel, protocolRef}) {
  // Sync QualityLabel with Protocol whenever user choice changes.
  useEffect(() => {
    const hls = protocolRef.current;
    if (!hls || qualitiesArray.length < 1) return;

    const match = qualitiesArray.find(q => q.height === qualityLabel);

    if (match) {
      hls.currentLevel !== match.levelIndex && (hls.currentLevel = match.levelIndex);
    } else {
      hls.currentLevel !== -1 && (hls.currentLevel = -1);
      qualityLabel !== "Auto" && (setQualityLabel("Auto"));
    }
  }, [protocolRef, qualitiesArray, qualityLabel, setQualityLabel]);
}

export default useQualityProtocolSync;