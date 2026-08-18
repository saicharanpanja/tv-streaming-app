import { useState } from 'react';
import { useHls } from './useHls';

const useProtocol = ({ videoRef, currentSrc, setActiveMenu }) => {
  const [autoHeight, setAutoHeight] = useState(null);
  const [audiosArray, setAudiosArray] = useState([]);
  const [captionsArray, setCaptionsArray] = useState([]);
  const [qualitiesArray, setQualitiesArray] = useState([]);

  const protocolRef = useHls({videoRef, currentSrc, setAutoHeight, setAudiosArray, setCaptionsArray, setQualitiesArray, setActiveMenu});

  return {
    protocolRef,
    autoHeight,
    audiosArray,
    captionsArray,
    qualitiesArray,
    playbackRatesArray: [0.5, 0.75, 1, 1.25, 1.5],
  }
}

export default useProtocol;