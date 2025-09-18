import { CaretLeftIcon } from '@phosphor-icons/react';

export default function QualityMenu({
  isMenuOpen,
  activeMenuTab,
  setActiveMenuTab,

  qualitiesArray,
  qualityLabel,
  setQualityLabel,
  autoHeight,
}) {
  function handleSelect(label) {
    setQualityLabel(label);
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
        onClick={() => handleSelect("Auto")}
        className="settings-menu quality-item"
      >
        <span className={`settings-menu quality-item-radio${qualityLabel === 'Auto' ? ' selected' : ''}`} />
        <span>{qualityLabel === "Auto" ? `Auto (${autoHeight}p)` : "Auto"}</span>
      </div>

      {qualitiesArray.map((q) => {
        const h = q.height;
        return (
          <div
            key={h}
            onClick={() => handleSelect(h)}
            className="settings-menu quality-item"
          >
            <span className={`settings-menu quality-item-radio${qualityLabel === h ? " selected" : ""}`} />
            <span className="option-label">{`${h}p`}</span>
            <span
              className={`settings-menu${(h > 1440 && h <= 2160) ? " quality-item-label-4k" :
                  (h >= 720 && h <= 1440) ? " quality-item-label-hd" :
                    (h >= 480 && h < 720) ? " quality-item-label-sd" :
                      ""
                }`}
            >{
                (h > 1440 && h <= 2160) ? "4K" :
                  (h >= 720 && h <= 1440) ? "HD" :
                    (h >= 480 && h < 720) ? "SD" :
                      ""
              }
            </span>
          </div>
        );
      })}
    </div>
  );
}