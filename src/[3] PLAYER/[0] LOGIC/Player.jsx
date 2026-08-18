import { useState, useRef } from 'react';

import { Seekbar } from '../components/Seekbar';
import { SkipButton } from '../components/SkipButton';
import { SettingsButton } from '../components/SettingsButton';

import usePlaylist from "../hooks/usePlaylist";
import useProtocol from "../hooks/useProtocol";
import useControlHandlers from '../hooks/useControlHandlers';

import SettingsMenu from "./SettingsMenu";

import "../[1] STYLES/Player.css";
import "../[1] STYLES/Seekbar.css";
import "../[1] STYLES/Volume.css";
import "../[1] STYLES/Settings.css";
import "../[1] STYLES/Fullscreen.css";
import Fullscreen from './Fullscreen';
import CaptionsText from '../components/CaptionsText';
import Captions from './Captions';
import useMobileDocumentSync from '../hooks/[3] Document Sync/useMobileDocumentSync';
import VolumeControls from './VolumeControls';
import PlaybackControls from './PlaybackControls';
import TimeDisplay from '../components/TimeDisplay';
import FeedbackOverlay from '../components/FeedbackOverlay';
import IconSprite from '../[2] UTILS/IconSprite';

function Player({
  initialIndex = 0,
  postersArray = [],
  sourcesArray = [],
  onIndexChange = () => { }
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [activeMenu, setActiveMenu] = useState(null);
  const isMenuOpen = activeMenu !== null;

  const [mobileControlsVisible, setMobileControlsVisible] = useState(true);
  const [desktopControlsVisible, setDesktopControlsVisible] = useState(true);

  const [captionsText, setCaptionsText] = useState("");
  const [captionsLabel, setCaptionsLabel] = useState(() => {
    const savedCaption = localStorage.getItem("player:captions");
    return savedCaption || 'Disabled'
  });

  const [qualityLabel, setQualityLabel] = useState(() => {
    const savedQuality = localStorage.getItem("player:quality");
    if (savedQuality === "Auto") return "Auto";
    return parseInt(savedQuality, 10) || "Auto";
  });

  /* ------------------------------------------------------------------------------------------------------ */

  const PLAYLIST = usePlaylist({ initialIndex, sourcesArray, postersArray, onIndexChange });

  const CONTROLS_STATE_01 = useProtocol({ videoRef, currentSrc: PLAYLIST.currentSrc, setActiveMenu });

  const CONTROLS_HANDLERS = useControlHandlers({ setCurrentIndex: PLAYLIST.setCurrentIndex });

  const { isMobileDevice } = useMobileDocumentSync();

  /* ---------------------------------------------------------------------------------------------------------- */

  return (
    <div
      tabIndex="-1" //So that the player keyboard controls work
      ref={containerRef}
      className={
        `player-container
        ${desktopControlsVisible || isMenuOpen ? " controls-visible" : " hide-cursor"}
        ${isMobileDevice ? " mobile" : " desktop"}`
      }
    >
      <IconSprite />

      <video
        key={PLAYLIST.currentIndex}
        ref={videoRef}
        crossOrigin="anonymous"
        className="video-wrapper"
        poster={PLAYLIST.currentPos}
        preload="metadata"
        playsInline={true}
      />

      <CaptionsText
        captionsLabel={captionsLabel}
        captionsText={captionsText}
      />

      <FeedbackOverlay
        videoRef={videoRef}
        containerRef={containerRef}
        setCurrentIndex={PLAYLIST.setCurrentIndex}
        captionsArray={CONTROLS_STATE_01.captionsArray}
        setCaptionsLabel={setCaptionsLabel}

        isMenuOpen={isMenuOpen}
        setActiveMenu={setActiveMenu}
        currentIndex={PLAYLIST.currentIndex}
        isMobile={isMobileDevice}
        setMobileControlsVisible={setMobileControlsVisible}
      />

      <div
        className={`controls-container-mobile${mobileControlsVisible ? "" : " hide-controls"}`}
        onClick={() => isMenuOpen ? setActiveMenu(null) : setMobileControlsVisible(false)}
      >
        <div className="top">
          <Captions
            captionsLabel={captionsLabel}
            setCaptionsLabel={setCaptionsLabel}
            captionsArray={CONTROLS_STATE_01.captionsArray}
            setCaptionsText={setCaptionsText}
          />

          <SettingsButton
            shouldRotate={isMenuOpen}
            autoHeight={CONTROLS_STATE_01.autoHeight}
            qualityLabel={qualityLabel}
            setActiveMenu={setActiveMenu}
          />
        </div>

        <div className="middle">
          <SkipButton
            direction="previous"
            isDisabled={!PLAYLIST.hasPrev}
            isRendered={PLAYLIST.isPlaylist}
            onClick={(e) => {
              e.stopPropagation();
              CONTROLS_HANDLERS.handleSkipPrev();
            }}
          />

          <PlaybackControls
            videoRef={videoRef}
            currentIndex={PLAYLIST.currentIndex}
          />

          <SkipButton
            direction="next"
            isDisabled={!PLAYLIST.hasNext}
            isRendered={PLAYLIST.isPlaylist}
            onClick={(e) => {
              e.stopPropagation();
              CONTROLS_HANDLERS.handleSkipNext();
            }}
          />
        </div>

        <div className="bottom-one">
          <Fullscreen
            containerRef={containerRef}
            videoRef={videoRef}
          />
        </div>

        <div className="bottom-two">
          <Seekbar
            videoRef={videoRef}
            currentIndex={PLAYLIST.currentIndex}
            onSeekStart={CONTROLS_HANDLERS.handleSeekStart}
            onSeekEnd={CONTROLS_HANDLERS.handleSeekEnd}
            onSeek={CONTROLS_HANDLERS.handleSeek}
          />
        </div>
      </div>

      <div
        className={`controls-container-desktop${desktopControlsVisible || isMenuOpen ? "" : " hide-controls"}`}
      >
        <div className="top">
          <Seekbar
            videoRef={videoRef}
            currentIndex={PLAYLIST.currentIndex}
            onSeekStart={CONTROLS_HANDLERS.handleSeekStart}
            onSeekEnd={CONTROLS_HANDLERS.handleSeekEnd}
            onSeek={CONTROLS_HANDLERS.handleSeek}
          />
        </div>

        <div className="bottom">
          <SkipButton
            direction="previous"
            onClick={CONTROLS_HANDLERS.handleSkipPrev}
            isDisabled={!PLAYLIST.hasPrev}
            isRendered={PLAYLIST.isPlaylist}
          />

          <PlaybackControls
            videoRef={videoRef}
            currentIndex={PLAYLIST.currentIndex}
          />

          <SkipButton
            direction="next"
            onClick={CONTROLS_HANDLERS.handleSkipNext}
            isDisabled={!PLAYLIST.hasNext}
            isRendered={PLAYLIST.isPlaylist}
          />

          <VolumeControls
            videoRef={videoRef}
            currentIndex={PLAYLIST.currentIndex}
          />

          <TimeDisplay
            videoRef={videoRef}
            currentIndex={PLAYLIST.currentIndex}
          />

          <div className="spacer" />

          <Captions
            captionsLabel={captionsLabel}
            setCaptionsLabel={setCaptionsLabel}
            captionsArray={CONTROLS_STATE_01.captionsArray}
            setCaptionsText={setCaptionsText}
          />

          <SettingsButton
            shouldRotate={isMenuOpen}
            autoHeight={CONTROLS_STATE_01.autoHeight}
            qualityLabel={qualityLabel}
            setActiveMenu={setActiveMenu}
          />

          <Fullscreen
            containerRef={containerRef}
            videoRef={videoRef}
          />
        </div>
      </div>

      <SettingsMenu
        videoRef={videoRef}
        protocolRef={CONTROLS_STATE_01.protocolRef}
        currentIndex={PLAYLIST.currentIndex}

        isMobile={isMobileDevice}
        isMenuOpen={isMenuOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}

        autoHeight={CONTROLS_STATE_01.autoHeight}
        audiosArray={CONTROLS_STATE_01.audiosArray}
        captionsArray={CONTROLS_STATE_01.captionsArray}
        qualitiesArray={CONTROLS_STATE_01.qualitiesArray}
        playbackRatesArray={CONTROLS_STATE_01.playbackRatesArray}

        captionsLabel={captionsLabel}
        qualityLabel={qualityLabel}

        setCaptionsLabel={setCaptionsLabel}
        setQualityLabel={setQualityLabel}
      />
    </div>
  );
}

export default Player;