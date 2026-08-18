import { useCallback } from 'react';

function useSkipNext({ setCurrentIndex }) {
  const handleSkipNext = useCallback(() => {
    setCurrentIndex(prev => prev + 1);
  }, [setCurrentIndex]);

  return handleSkipNext;
}

export default useSkipNext;