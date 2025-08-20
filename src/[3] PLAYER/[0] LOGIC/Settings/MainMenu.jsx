import { CaretRightIcon } from '@phosphor-icons/react';

export default function MainMenu({
  setActiveMenuTab, 
  activeMenuTab,
  speedLabel,
  captionsLabel,
  qualityLabel
}) {
  return (
    <div
      className={`settings-menu main${activeMenuTab === "main" ? "" : " hide"}`}
    >
      <div
        className="settings-menu main-item"
        onClick={() => setActiveMenuTab("captions")}
        onKeyDown={(e) => e.key === "Enter" && setActiveMenuTab("captions")}
      >
        <span>Captions</span>
        <span className="spacer"></span>
        <span>{captionsLabel}</span>
        <CaretRightIcon size={10} style={{ marginLeft: "-6px" }} />
      </div>

      <div
        className="settings-menu main-item"
        onClick={() => setActiveMenuTab("quality")}
        onKeyDown={(e) => e.key === "Enter" && setActiveMenuTab("quality")}
      >
        <span>Quality</span>
        <span className="spacer"></span>
        <span>{qualityLabel === "Auto" ? "Auto" : `${qualityLabel}p`}</span>
        <CaretRightIcon size={10} style={{ marginLeft: "-6px" }} />
      </div>

      <div
        className="settings-menu main-item"
        onClick={() => setActiveMenuTab("speed")}
        onKeyDown={(e) => e.key === "Enter" && setActiveMenuTab("speed")}
      >
        <span>Speed</span>
        <span className="spacer"></span>
        <span>{speedLabel}</span>
        <CaretRightIcon size={10} style={{ marginLeft: "-6px" }} />
      </div>
    </div>
  );
}