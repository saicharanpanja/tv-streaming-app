import { useEffect } from 'react';

function useFullscreenDocumentSync({ setIsFullscreen }) {
  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [setIsFullscreen]);
}

export default useFullscreenDocumentSync;