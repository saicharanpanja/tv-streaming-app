import { useEffect } from 'react';

function useAudioProtocolSync({audiosArray, audioLabel, setAudioLabel, protocolRef}) {
  // Sync AudioLabel with Protocol whenever user choice changes.
  useEffect(() => {
    const hls = protocolRef.current;
    if (!hls || audiosArray.length < 1) return;

    const match = audiosArray.find(t => t.name === audioLabel);

    if (audioLabel && match) {
      hls.audioTrack !== match.id && (hls.audioTrack = match.id);
    } else {
      hls.audioTrack = -1;
      setAudioLabel(audiosArray[hls.audioTrack].name);
    }
  }, [protocolRef, audiosArray, audioLabel, setAudioLabel]);
}

export default useAudioProtocolSync;