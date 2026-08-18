import { useState, useEffect } from 'react';

function useMobileDocumentSync() {
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
    setIsMobileDevice(isMobile);
  }, []);

  return { isMobileDevice };
}

export default useMobileDocumentSync;