import { useEffect } from "react";

function useDocumentSingleClick({ isMenuOpen, settingsContainerRef, setActiveMenu }) {
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClick = (e) => {
      const container = settingsContainerRef.current;
      if (container && !container.contains(e.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isMenuOpen, settingsContainerRef, setActiveMenu]);
}

export default useDocumentSingleClick;
