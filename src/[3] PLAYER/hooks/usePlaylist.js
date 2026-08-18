import { useState, useEffect } from 'react';

const usePlaylist = ({ initialIndex, sourcesArray, postersArray, onIndexChange }) => {
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => setCurrentIndex(initialIndex), [initialIndex]);

  useEffect(() => onIndexChange(currentIndex), [currentIndex]);

  // Derived state - no need for useState
  const isPlaylist = sourcesArray.length > 1;
  const currentSrc = sourcesArray[currentIndex];
  const currentPos = postersArray[currentIndex];
  const hasPrev = isPlaylist && currentIndex > 0;
  const hasNext = isPlaylist && currentIndex < sourcesArray.length - 1;

  return { setCurrentIndex, currentIndex, currentSrc, currentPos, hasPrev, hasNext, isPlaylist }
}

export default usePlaylist;