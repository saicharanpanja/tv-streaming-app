import { CaretLeftIcon } from '@phosphor-icons/react';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5];

export default function SpeedMenu({
  activeMenuTab,
  setActiveMenuTab,
  playbackRate,
  setPlaybackRate,
  isMenuOpen
}) {
  return (
    <div
      className={`settings-menu speed${isMenuOpen && activeMenuTab === "speed" ? "" : " hide"}`}
    >
      <div
        className="settings-menu speed-item"
        onClick={() => setActiveMenuTab("main")}
        onKeyDown={(e) => e.key === "Enter" && setActiveMenuTab("main")}
      >
        <CaretLeftIcon size={12} weight="bold" />
        <span>Speed</span>
      </div>

      <span className="settings-menu speed-item-divider"></span>

      {SPEEDS.map((s) => {
        const label = s === 1 ? "Normal" : `${s}×`;
        const selected = playbackRate === s;
        return (
          <div
            key={s}
            onClick={() => {
              setPlaybackRate(s);
              setActiveMenuTab("main");
            }}
            className="settings-menu speed-item"
          >
            <span className={`settings-menu speed-item-radio${selected ? " selected" : ""}`} />
            <span className="option-label">{label}</span>
          </div>
        );
      })}
    </div>
  );
}