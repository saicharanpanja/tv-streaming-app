import { useCallback } from 'react';

const useControlHandlers = ({
  setCurrentIndex,
}) => {
  /*------- SKIP CONTROLS --------*/
  const handleSkipPrev = useCallback(() => {
    setCurrentIndex(prev => prev - 1);
  }, [setCurrentIndex]);

  const handleSkipNext = useCallback(() => {
    setCurrentIndex(prev => prev + 1);
  }, [setCurrentIndex]);

  /* -------- VOLUME CONTROLS ---------*/
  return {
    handleSkipNext, handleSkipPrev
  }
}

export default useControlHandlers;