import { useCallback } from 'react';

function useSkipPrev({ setCurrentIndex }) {
  const handleSkipPrev = useCallback(() => {
    setCurrentIndex(prev => prev - 1);
  }, [setCurrentIndex]);

  return handleSkipPrev;
}

export default useSkipPrev;