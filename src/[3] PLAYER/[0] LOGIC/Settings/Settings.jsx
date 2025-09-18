import { useState, useMemo, useEffect } from "react";

import MainMenu from "./MainMenu";
import AudioMenu from './AudioMenu';
import CaptionsMenu from "./CaptionsMenu";
import QualityMenu from "./QualityMenu";
import SpeedMenu from "./SpeedMenu";

import Icon from "../../[2] UTILS/Icon";

export default function Settings({
  videoRef,
  hlsRef,
  currentSrc,

  captionsArray,
  captionsLabel,
  setCaptionsLabel,

  qualitiesArray,
  autoHeight,
  qualityLabel,
  setQualityLabel,

  audiosArray,
  audioLabel,
  setAudioLabel,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenuTab, setActiveMenuTab] = useState("none");

  // States for Speed
  const [playbackRate, setPlaybackRate] = useState(() => {
    const saved = localStorage.getItem("player:playbackRate");
    const n = parseFloat(saved);
    return !isNaN(n) ? n : 1;
  });

  // Apply the speed whenever changes.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const applyRate = () => {
      try {
        video.playbackRate = playbackRate;
        if ("preservesPitch" in video) {
          video.preservesPitch = true;
        } else if ("mozPreservesPitch" in video) {
          video.mozPreservesPitch = true;
        }
      } catch (err) {
        console.warn("[Player] Failed to apply playback rate:", err);
      }
    };

    applyRate();
    video.addEventListener('loadedmetadata', applyRate);
    return () => {
      video.removeEventListener('loadedmetadata', applyRate);
    };
  }, [playbackRate, videoRef, currentSrc]);

  // Save the speed whenever changes.
  useEffect(() => {
    try {
      localStorage.setItem("player:playbackRate", playbackRate.toString());
    } catch (err) {
      console.error("[Player] Could not save playback rate:", playbackRate, err);
    }
  }, [playbackRate]);

  // Get a speed Label
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
        className={`settings-icon-quality-label-${((qualityLabel > 1440 && qualityLabel <= 2160) || (qualityLabel === "Auto" && (autoHeight > 1440 && autoHeight <= 2160))) ? "4k" :
          ((qualityLabel >= 720 && qualityLabel <= 1440) || (qualityLabel === "Auto" && (autoHeight >= 720 && autoHeight <= 1440))) ? "hd" :
            ((qualityLabel >= 480 && qualityLabel < 720) || (qualityLabel === "Auto" && (autoHeight >= 480 && autoHeight < 720))) ? "sd" :
              ""
          }`}
      >{
          ((qualityLabel > 1440 && qualityLabel <= 2160) || (qualityLabel === "Auto" && (autoHeight > 1440 && autoHeight <= 2160))) ? "4K" :
            ((qualityLabel >= 720 && qualityLabel <= 1440) || (qualityLabel === "Auto" && (autoHeight >= 720 && autoHeight <= 1440))) ? "HD" :
              ((qualityLabel >= 480 && qualityLabel < 720) || (qualityLabel === "Auto" && (autoHeight >= 480 && autoHeight < 720))) ? "SD" :
                ""
        }
      </span>

      <MainMenu
        activeMenuTab={activeMenuTab}
        setActiveMenuTab={setActiveMenuTab}

        audiosArray={audiosArray}
        audioLabel={audioLabel}

        captionsArray={captionsArray}
        captionsLabel={captionsLabel}
        
        qualityLabel={qualityLabel}
        speedLabel={speedLabel}
      />

      {audiosArray.length !== 0 && <AudioMenu
        isMenuOpen={isMenuOpen}
        activeMenuTab={activeMenuTab}
        setActiveMenuTab={setActiveMenuTab}

        audiosArray={audiosArray}
        audioLabel={audioLabel}
        setAudioLabel={setAudioLabel}
      />}

      <QualityMenu
        isMenuOpen={isMenuOpen}
        activeMenuTab={activeMenuTab}
        setActiveMenuTab={setActiveMenuTab}

        hlsRef={hlsRef}
        qualitiesArray={qualitiesArray}
        qualityLabel={qualityLabel}
        setQualityLabel={setQualityLabel}
        autoHeight={autoHeight}
      />

      <SpeedMenu
        activeMenuTab={activeMenuTab}
        setActiveMenuTab={setActiveMenuTab}
        isMenuOpen={isMenuOpen}
        playbackRate={playbackRate}
        setPlaybackRate={setPlaybackRate}
      />

      {captionsArray.length !== 0 && <CaptionsMenu
        activeMenuTab={activeMenuTab}
        setActiveMenuTab={setActiveMenuTab}
        isMenuOpen={isMenuOpen}

        captionsArray={captionsArray}
        captionsLabel={captionsLabel}
        setCaptionsLabel={setCaptionsLabel}
      />}
    </div>
  );
}