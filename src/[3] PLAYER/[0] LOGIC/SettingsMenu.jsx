import { useRef, useState, useEffect } from "react";
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import Icon from "../[2] UTILS/Icon";
import useDocumentSingleClick from "../hooks/[5] Document Clicks/useDocumentSingleClick";
import useQualityStorageSync from "../hooks/[0] Storage Sync/useQualityStorageSync";
import useQualityProtocolSync from "../hooks/[1] Protocol Sync/useQualityProtocolSync";
import useAudioStorageSync from "../hooks/[0] Storage Sync/useAudioStorageSync";
import useAudioProtocolSync from "../hooks/[1] Protocol Sync/useAudioProtocolSync";
import usePlaybackRateStorageSync from "../hooks/[0] Storage Sync/usePlaybackRateStorageSync";
import usePlaybackRateVideoSync from "../hooks/[2] Video Sync/usePlaybackRateVideoSync";

function SettingsMenu({
  videoRef,
  protocolRef,
  currentIndex,

  isMobile,
  isMenuOpen,
  activeMenu,
  setActiveMenu,

  audiosArray,
  captionsArray,
  qualitiesArray,
  playbackRatesArray,

  autoHeight,
  captionsLabel,
  qualityLabel,
  setCaptionsLabel,
  setQualityLabel,
}) {
  // DOM-Refs
  const settingsContainerRef = useRef(null);
  const settingsMainMenuRef = useRef(null);
  const settingsAudioMenuRef = useRef(null);
  const settingsCaptionMenuRef = useRef(null);
  const settingsQualityMenuRef = useRef(null);
  const settingsPlaybackRateMenuRef = useRef(null);

  const [audioLabel, setAudioLabel] = useState(() => {
    const savedAudio = localStorage.getItem("player:audio");
    return savedAudio || null;
  });

  const [playbackRate, setPlaybackRate] = useState(() => {
    const savedRate = localStorage.getItem("player:playbackRate");
    const n = parseFloat(savedRate);
    return !isNaN(n) ? n : 1;
  });

  useDocumentSingleClick({ isMenuOpen, settingsContainerRef, setActiveMenu });
  
  useAudioStorageSync({ audioLabel });
  useQualityStorageSync({ qualityLabel });
  usePlaybackRateStorageSync({ playbackRate });

  usePlaybackRateVideoSync({ videoRef, playbackRate, currentIndex });
  useAudioProtocolSync({ audiosArray, audioLabel, setAudioLabel, protocolRef });
  useQualityProtocolSync({ qualitiesArray, qualityLabel, setQualityLabel, protocolRef });

  // Focus the first button in menu whenever menu changes.
  useEffect(() => {
    if (!activeMenu) return;

    const menuRefs = {
      main: settingsMainMenuRef,
      audio: settingsAudioMenuRef,
      captions: settingsCaptionMenuRef,
      quality: settingsQualityMenuRef,
      speed: settingsPlaybackRateMenuRef,
    };

    const activeContainer = menuRefs[activeMenu]?.current;
    const firstButton = activeContainer?.querySelector("button");
    if (!firstButton) return;

    const handleFocus = () => firstButton.focus();
    activeContainer.addEventListener('transitionend', handleFocus, { once: true });
    return () => activeContainer.removeEventListener('transitionend', handleFocus);
  }, [activeMenu]);

  // Update the container size based on active Menu & arrayslength change.
  useEffect(() => {
    const container = settingsContainerRef.current;
    if (!container) return;

    const menuIsAvailable = {
      main: true,
      audio: audiosArray.length > 0,
      captions: captionsArray.length > 0,
      quality: qualitiesArray.length > 0,
      speed: playbackRatesArray.length > 0,
    };

    if (!menuIsAvailable[activeMenu]) {
      container.style.opacity = "0";
      container.style.setProperty("--container-width", 0);
      isMobile && (container.style.height = "0");
      return;
    }

    const menuRefs = {
      main: settingsMainMenuRef,
      audio: settingsAudioMenuRef,
      captions: settingsCaptionMenuRef,
      quality: settingsQualityMenuRef,
      speed: settingsPlaybackRateMenuRef,
    };

    const el = menuRefs[activeMenu]?.current;
    if (!el) return;

    const updateSize = () => {
      const { offsetWidth, offsetHeight } = el;
      container.style.opacity = "1";
      container.style.height = `${offsetHeight}px`;

      if (!isMobile) {
        container.style.width = `${offsetWidth}px`;
        container.style.setProperty("--container-width", `${offsetWidth}px`);
      } else {
        container.style.width = "calc(100% - 20px)";
        container.style.setProperty("--container-width", "100%");
      }
    };

    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, [
    isMobile,
    activeMenu,
    audiosArray.length,
    captionsArray.length,
    playbackRatesArray.length,
    qualitiesArray.length,
    setActiveMenu
  ]);

  // Other Utils
  function submenuHeader(title = "") {
    return (
      <>
        <button className="settings-menu submenu-item" onClick={() => setActiveMenu("main")}>
          <CaretLeftIcon size={12} weight="bold" />
          <span>{title}</span>
        </button>
        <span className="settings-menu submenu-item-divider"></span>
      </>
    );
  }

  const getCaptionsLabel = track => {
    const langMap = { de: 'Deutsch', deu: 'Deutsch', ger: 'Deutsch' };
    return langMap[track.language] || track.label;
  };

  const getCaptionsTag = track => {
    const langMap = { de: 'DE', deu: 'DE', ger: 'DE' };
    return langMap[track.language] || (track.language === "disabled" ? '' : (track.language.toUpperCase().slice(0, 2) || ""))
  }

  const getQualityTag = height =>
    (height > 1440 && height <= 2160) ? "4K" :
      (height >= 720 && height <= 1440) ? "HD" : "";

  return (
    <div
      ref={settingsContainerRef}
      className={`settings-menu-container${isMenuOpen ? " active" : ""}`}
    >
      {/*Main Menu*/}
      <div
        ref={settingsMainMenuRef}
        className={`settings-menu mainmenu${activeMenu === "main" ? " active" : ""}`}
      >
        {audiosArray.length > 0 &&
          <button
            className="settings-menu mainmenu-item"
            onClick={() => setActiveMenu("audio")}
          >
            <Icon name="audio-menu" size={27} />
            <span>Audio</span>
            <span>({audiosArray.length})</span>
            <span className="settings-menu mainmenu-item-spacer"></span>
            <span>{audioLabel}</span>
            <CaretRightIcon size={12} style={{ marginLeft: "-6px" }} />
          </button>
        }

        {captionsArray.length > 0 &&
          <button
            className="settings-menu mainmenu-item"
            onClick={() => setActiveMenu("captions")}
          >
            <Icon name="captions-menu" size={27} />
            <span>Captions</span>
            <span>({captionsArray.length - 1})</span>
            <span className="settings-menu mainmenu-item-spacer"></span>
            <span>{captionsLabel}</span>
            <CaretRightIcon size={12} style={{ marginLeft: "-6px" }} />
          </button>
        }

        {qualitiesArray.length > 0 &&
          <button
            className="settings-menu mainmenu-item"
            onClick={() => setActiveMenu("quality")}
          >
            <Icon name="quality-menu" size={27} />
            <span>Quality</span>
            <span className="settings-menu mainmenu-item-spacer"></span>
            <span>{qualityLabel === "Auto" ? "Auto" : `${qualityLabel}p`}</span>
            {qualityLabel === "Auto" && <span>({autoHeight}p)</span>}
            <CaretRightIcon size={12} style={{ marginLeft: "-6px" }} />
          </button>
        }

        {playbackRatesArray.length > 0 &&
          <button
            className="settings-menu mainmenu-item"
            onClick={() => setActiveMenu("speed")}
          >
            <Icon name="speed-menu" size={27} />
            <span>Speed</span>
            <span className="settings-menu mainmenu-item-spacer"></span>
            <span>{playbackRate === 1 ? "Normal" : `${playbackRate}×`}</span>
            <CaretRightIcon size={12} style={{ marginLeft: "-6px" }} />
          </button>
        }
      </div>

      {/*Audio Menu*/}
      {audiosArray.length > 0 &&
        <div
          ref={settingsAudioMenuRef}
          className={`settings-menu submenu${activeMenu === 'audio' ? ' active' : ''}`}
        >
          {submenuHeader("Audio")}

          <div className="settings-menu submenu-list">
            {audiosArray.map((audio) =>
              <button
                key={audio.id}
                className="settings-menu submenu-item"
                onClick={() => {
                  setAudioLabel(audio.name);
                  setActiveMenu("main");
                }}
              >
                <span className={`settings-menu submenu-item-radio${audioLabel === audio.name ? ' selected' : ''}`} />
                <span>{audio.name}</span>
              </button>
            )}
          </div>
        </div>
      }

      {/*Captions Menu*/}
      {captionsArray.length > 0 &&
        <div
          ref={settingsCaptionMenuRef}
          className={`settings-menu submenu${activeMenu === 'captions' ? ' active' : ''}`}
        >
          {submenuHeader("Captions")}

          <div className="settings-menu submenu-list">
            {captionsArray.map((track) => {
              const consistentLabel = getCaptionsLabel(track);
              const tag = getCaptionsTag(track);
              return (
                <button
                  key={track.language + track.label}
                  className="settings-menu submenu-item"
                  onClick={() => {
                    setCaptionsLabel(consistentLabel);
                    setActiveMenu('main');
                  }}
                >
                  <span className={`settings-menu submenu-item-radio${captionsLabel === consistentLabel ? ' selected' : ''}`} />
                  <span>{consistentLabel}</span>
                  {tag &&
                    <span className={`settings-menu submenu-item-tag`}>
                      {tag}
                    </span>
                  }
                </button>
              );
            })}
          </div>
        </div >
      }

      {/*Quality Menu*/}
      {qualitiesArray.length > 0 &&
        <div
          ref={settingsQualityMenuRef}
          className={`settings-menu submenu${activeMenu === "quality" ? " active" : ""}`}
        >
          {submenuHeader("Quality")}

          <div className="settings-menu submenu-list">
            {qualitiesArray.map((q) => {
              const h = q.height;
              const tag = getQualityTag(h);
              return (
                <button
                  key={h}
                  className="settings-menu submenu-item"
                  onClick={() => {
                    setQualityLabel(h);
                    setActiveMenu("main");
                  }}
                >
                  <span className={`settings-menu submenu-item-radio${qualityLabel === h ? " selected" : ""}`} />

                  <span>
                    {h === "Auto"
                      ? qualityLabel === "Auto"
                        ? `Auto (${autoHeight}p)`
                        : "Auto"
                      : `${h}p`}
                  </span>

                  {tag &&
                    <span className={`settings-menu submenu-item-tag-${tag.toLowerCase()}`}>
                      {tag}
                    </span>
                  }
                </button>
              );
            })}
          </div>
        </div>
      }

      {/*Speed Menu*/}
      {playbackRatesArray.length > 0 &&
        <div
          ref={settingsPlaybackRateMenuRef}
          className={`settings-menu submenu${activeMenu === "speed" ? " active" : ""}`}
        >
          {submenuHeader("Speed")}

          <div className="settings-menu submenu-list">
            {playbackRatesArray.map((s) =>
              <button
                key={s}
                className="settings-menu submenu-item"
                onClick={() => {
                  setPlaybackRate(s);
                  setActiveMenu("main");
                }}
              >
                <span className={`settings-menu submenu-item-radio${playbackRate === s ? " selected" : ""}`} />
                <span>{s === 1 ? "Normal" : `${s}×`}</span>
              </button>
            )}
          </div>
        </div>
      }
    </div >
  );
}

export default SettingsMenu;