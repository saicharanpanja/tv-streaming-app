import { CaretRightIcon } from '@phosphor-icons/react';

export default function MainMenu({
  activeMenuTab,
  setActiveMenuTab,

  audiosArray,
  audioLabel,
  captionsArray,
  captionsLabel,
  qualityLabel,
  speedLabel,
}) {
  return (
    <div
      className={`settings-menu main${activeMenuTab === "main" ? "" : " hide"}`}
    >
      {/*Audio*/}
      {audiosArray.length !== 0 && <div
        className="settings-menu main-item"
        onClick={() => setActiveMenuTab("audio")}
        onKeyDown={(e) => e.key === "Enter" && setActiveMenuTab("audio")}
      >
        <span>Audio</span>
        <span className="spacer"></span>
        <span>{audioLabel}</span>
        <CaretRightIcon size={10} style={{ marginLeft: "-6px" }} />
      </div>
      }

      {/*Captions*/}
      {captionsArray.length !== 0 &&
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
      }


      {/*Quality*/}
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


      {/*Speed*/}
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