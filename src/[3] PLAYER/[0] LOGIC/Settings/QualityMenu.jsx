import { CaretLeftIcon } from '@phosphor-icons/react';

export default function QualityMenu({
  activeMenuTab,
  setActiveMenuTab,
  isMenuOpen,
  hlsRef,
  qualities,
  selected,
  setSelected,
  autoHeight
}) {
  function setAuto() {
    const hls = hlsRef.current;
    setSelected("Auto");
    if (hls) hls.currentLevel = -1;
    setActiveMenuTab("main");
  };

  function setHeight(height) {
    const hls = hlsRef.current;
    setSelected(height);
    const match = qualities.find((q) => q.height === height);
    if (hls && match) hls.currentLevel = match.levelIndex;
    setActiveMenuTab("main");
  };

  return (
    <div
      className={`settings-menu quality${isMenuOpen && activeMenuTab === "quality" ? "" : " hide"}`}
    >
      <div
        className="settings-menu quality-item"
        onClick={() => setActiveMenuTab("main")}
        onKeyDown={(e) => e.key === "Enter" && setActiveMenuTab("main")}
      >
        <CaretLeftIcon size={12} weight="bold" />
        <span>Quality</span>
      </div>

      <span className="settings-menu quality-item-divider"></span>

      {/* --- Auto Option --- */}
      <div
        onClick={() => setAuto()}
        className="settings-menu quality-item"
      >
        <span className={`settings-menu quality-item-radio${selected === 'Auto' ? ' selected' : ''}`} />
        <span>{selected === "Auto" ? `Auto (${autoHeight}p)` : "Auto"}</span>
      </div>

      {qualities.map((q) => {
        const h = q.height;
        const label = `${h}p`;
        return (
          <div
            key={h}
            onClick={() => setHeight(h)}
            className="settings-menu quality-item"
          >
            <span className={`settings-menu quality-item-radio${selected === h ? " selected" : ""}`} />
            <span className="option-label">{label}</span>
            <span
              className={`settings-menu${
                (h> 1440 && h<=2160) ? " quality-item-label-4k" :
                (h>= 720 && h<=1440) ? " quality-item-label-hd" :
                (h>= 480 && h<720) ? " quality-item-label-sd" :
                ""
              }`}
            >{
              (h> 1440 && h<=2160) ? "4K" :
              (h>= 720 && h<=1440) ? "HD" :
              (h>= 480 && h<720) ? "SD" :
              ""
            }
            </span>
          </div>
        );
      })}
    </div>
  );
}