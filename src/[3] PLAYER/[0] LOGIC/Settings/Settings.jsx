import { useState, useMemo } from "react";

import MainMenu from "./MainMenu";
import SpeedMenu from "./SpeedMenu";
import CaptionsMenu from "./CaptionsMenu";
import QualityMenu from "./QualityMenu";

import Icon from "../../[2] UTILS/Icon";

export default function Settings({
  videoRef,
  captionsLabel,
  setCaptionsLabel,
  tracks,
  hlsRef,
  qualities,
  selected,
  setSelected,
  autoHeight
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenuTab, setActiveMenuTab] = useState("none");

  const [playbackRate, setPlaybackRate] = useState(() => {
    const saved = localStorage.getItem("player:playbackRate");
    const n = parseFloat(saved);
    return !isNaN(n) ? n : 1;
  });

  const speedLabel = useMemo(
    () => (playbackRate === 1
      ? "Normal"
      : `${playbackRate.toFixed(2).replace(/\.00$/, "")}×`),
    [playbackRate]
  );

  return (
    <div className="video-controls settings-container">
      <Icon
        name="settings"
        className={`settings-menu icon${isMenuOpen ? " rotate" : ""}`}
        onClick={() => {
          setIsMenuOpen(v => !v);
          setActiveMenuTab(!isMenuOpen ? "main" : "none");
        }}
      />

      <span
        className={`settings-icon-quality-label-${
          ((selected> 1440 && selected<=2160) || (selected==="Auto" && (autoHeight> 1440 && autoHeight<=2160))) ? "4k" :
          ((selected>= 720 && selected<=1440) || (selected==="Auto" && (autoHeight>= 720 && autoHeight<=1440))) ? "hd" :
          ((selected>= 480 && selected<720) || (selected==="Auto" && (autoHeight>= 480 && autoHeight<720))) ? "sd" :
          ""
        }`}
      >{
        ((selected> 1440 && selected<=2160) || (selected==="Auto" && (autoHeight> 1440 && autoHeight<=2160))) ? "4K" :
        ((selected>= 720 && selected<=1440) || (selected==="Auto" && (autoHeight>= 720 && autoHeight<=1440))) ? "HD" :
        ((selected>= 480 && selected<720) || (selected==="Auto" && (autoHeight>= 480 && autoHeight<720))) ? "SD" :
        ""
        }
      </span>

      <MainMenu
        activeMenuTab={activeMenuTab}
        setActiveMenuTab={setActiveMenuTab}

        speedLabel={speedLabel}
        captionsLabel={captionsLabel}
        qualityLabel={selected}
      />

      <QualityMenu
        activeMenuTab={activeMenuTab}
        setActiveMenuTab={setActiveMenuTab}
        isMenuOpen={isMenuOpen}

        hlsRef={hlsRef}
        qualities={qualities}
        selected={selected}
        setSelected={setSelected}
        autoHeight={autoHeight}
      />

      <SpeedMenu
        activeMenuTab={activeMenuTab}
        setActiveMenuTab={setActiveMenuTab}
        isMenuOpen={isMenuOpen}

        playbackRate={playbackRate}
        setPlaybackRate={setPlaybackRate}
        videoRef={videoRef}
      />

      <CaptionsMenu
        activeMenuTab={activeMenuTab}
        setActiveMenuTab={setActiveMenuTab}
        isMenuOpen={isMenuOpen}

        captionsLabel={captionsLabel}
        setCaptionsLabel={setCaptionsLabel}
        tracks={tracks}
      />
    </div>
  );
}