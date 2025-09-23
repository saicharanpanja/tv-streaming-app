import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

import SettingsMenu from "./SettingsMenu";
import Seekbar from "./Seekbar";
import SkipPrev from "./SkipPrev";
import PlayPause from "./PlayPause";
import SkipNext from "./SkipNext";
import Volume from "./Volume";
import Captions from "./Captions";
import Settings from "./Settings";
import Fullscreen from "./Fullscreen";
import IconSprite from "../[2] UTILS/IconSprite";

import "../[1] STYLES/Player.css";
import "../[1] STYLES/Seekbar.css";
import "../[1] STYLES/Volume.css";
import "../[1] STYLES/Settings.css";
import "../[1] STYLES/Fullscreen.css";

function Player({
  index = 0,
  postersArray = [],
  sourcesArray = [],
  onIndexChange = () => { }
}) {

  //DOM References
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const containerRef = useRef(null);
  const hideControlsTimeout = useRef(null);
  const isHoveringControlsRef = useRef(false);

  // UI Visibility State
  const [isPaused, setIsPaused] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [playerSize, setPlayerSize] = useState({ width: 0, height: 0 });

  //Get current Source and Poster and check hasPrev, hasNext
  const [currentIndex, setCurrentIndex] = useState(index);
  const currentSrc = sourcesArray[currentIndex];
  const currentPos = postersArray[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < sourcesArray.length - 1;
  useEffect(() => setCurrentIndex(index), [index]);

  // States for Captions, Qualities, Audio and playbackRate.
  const [captionsText, setCaptionsText] = useState("");
  const [captionsArray, setCaptionsArray] = useState([]);
  const [captionsLabel, setCaptionsLabel] = useState(() => localStorage.getItem("player:captions") || 'Disabled');

  const [autoHeight, setAutoHeight] = useState(null);
  const [qualitiesArray, setQualitiesArray] = useState([]);
  const [qualityLabel, setQualityLabel] = useState(
    () => (localStorage.getItem("player:quality") === "Auto"
      ? "Auto"
      : parseInt(localStorage.getItem("player:quality"), 10) || "Auto")
  );

  const [audiosArray, setAudiosArray] = useState([]);
  const [audioLabel, setAudioLabel] = useState(() => localStorage.getItem("player:audio") || null);

  const playbackRatesArray = [0.5, 0.75, 1, 1.25, 1.5];
  const [playbackRate, setPlaybackRate] = useState(() => {
    const n = parseFloat(localStorage.getItem("player:playbackRate"));
    return !isNaN(n) ? n : 1;
  });

  // Listen to core video events (play, pause, ended)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPaused(false);
    const handlePause = () => setIsPaused(true);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handlePause);
    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handlePause);
    };
  }, [currentSrc]);

  // Manage controls visibility when play/pause state changes
  useEffect(() => {
    clearTimeout(hideControlsTimeout.current);
    isPaused ? setControlsVisible(true)
      : hideControlsTimeout.current = setTimeout(() => setControlsVisible(false), 3000);
  }, [isPaused]);

  // Listen to player size and update it
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = () => {
      setPlayerSize({
        width: container.offsetWidth,
        height: container.offsetHeight,
      });
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // HLS Setup, Get quality heights, subtitles, audio tracks and teardown.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentSrc) return;

    setCaptionsArray([]);
    setQualitiesArray([]);
    setAudiosArray([]);

    // Get the available subtitles by filtering.
    const getCaptions = () => {
      const uniqueCaptions = Array.from(video.textTracks).filter(
        (t) => t.kind === "subtitles" || t.kind === "captions"
      );
      setCaptionsArray([
        { language: "disabled", label: "Disabled", mode: "disabled" },
        ...uniqueCaptions,
      ]);
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;

      // Get the available quality levels.
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const map = new Map();
        hls.levels.forEach((level, index) => {
          const previous = map.get(level.height);
          // Get the best bitrate of same heights if any.
          if (!previous || level.bitrate > previous.bitrate) {
            map.set(level.height, { levelIndex: index, bitrate: level.bitrate });
          }
        });

        // Convert to new array without bitrates.
        const uniqueHeights = Array.from(map.entries())
          .map(([height, obj]) => ({ height, levelIndex: obj.levelIndex }))
          .sort((a, b) => b.height - a.height);

        setQualitiesArray([
          ...uniqueHeights,
          { height: "Auto", levelIndex: -1 }
        ]);
      });

      // Get the available audio levels.
      hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, (_event, { audioTracks }) => {
        if (audioTracks.length > 0) setAudiosArray(audioTracks);
      });

      // Set the AutoHeight if quality changes.
      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
        const level = hls.levels?.[data.level];
        if (level?.height) setAutoHeight(level.height);
      });

      hls.loadSource(currentSrc);
      hls.attachMedia(video);
      video.play().catch(() => { });
      video.addEventListener('loadedmetadata', getCaptions);
      return () => {
        hls.destroy();
        hlsRef.current = null;
        video.removeEventListener('loadedmetadata', getCaptions);
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = currentSrc;
      video.play().catch(() => { });
      video.addEventListener('loadedmetadata', getCaptions);
      return () => {
        video.removeEventListener('loadedmetadata', getCaptions);
      };
    }
  }, [currentSrc]);

  // Apply the saved captions whenever changes.
  useEffect(() => {
    if (captionsArray.length > 1) {
      const getConsistentLabel = track => {
        const langMap = { de: 'Deutsch', deu: 'Deutsch', ger: 'Deutsch' };
        return langMap[track.language] || track.label;
      };

      let trackFound = null;
      captionsArray.forEach(track => {
        if (captionsLabel !== "Disabled" && getConsistentLabel(track) === captionsLabel) {
          track.mode = 'hidden';
          trackFound = track;
        } else {
          track.mode = 'disabled';
        }
      });

      if (trackFound) {
        const handleCueChange = () => {
          const text = trackFound.activeCues?.[0]?.text || '';
          setCaptionsText(text.replace(/<[^>]+>/g, ''));
        }

        handleCueChange();
        trackFound.addEventListener('cuechange', handleCueChange);
        return () => {
          trackFound.removeEventListener('cuechange', handleCueChange);
        };
      } else setCaptionsText('');

      if (!trackFound && captionsLabel !== 'Disabled') {
        setCaptionsLabel(getConsistentLabel(captionsArray[1]));
      }
    } else setCaptionsText('');
  }, [captionsArray, captionsLabel]);

  // Apply the saved quality whenever changes.
  useEffect(() => {
    const hls = hlsRef.current;
    if (!hls || qualitiesArray.length < 2) return;

    const match = qualitiesArray.find(q => q.height === qualityLabel);

    if (match) {
      hls.currentLevel !== match.levelIndex && (hls.currentLevel = match.levelIndex);
    } else {
      hls.currentLevel !== -1 && (hls.currentLevel = -1);
      qualityLabel !== "Auto" && (setQualityLabel("Auto"));
    }
  }, [qualitiesArray, qualityLabel]);

  // Apply the saved audio whenever changes.
  useEffect(() => {
    const hls = hlsRef.current;
    if (!hls || audiosArray.length === 0) return;

    const match = audiosArray.find(t => t.name === audioLabel);

    if (audioLabel && match) {
      hls.audioTrack !== match.id && (hls.audioTrack = match.id);
    } else {
      hls.audioTrack = -1;
      setAudioLabel(audiosArray[hls.audioTrack].name);
    }
  }, [audiosArray, audioLabel]);

  // Apply the saved playbackRate whenever changes.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = playbackRate;
    if ("preservesPitch" in video) {
      video.preservesPitch = true;
    } else if ("mozPreservesPitch" in video) {
      video.mozPreservesPitch = true;
    }
  }, [currentSrc, playbackRate]);

  // Save the captionsLabel whenever changes.
  useEffect(() => {
    try {
      localStorage.setItem("player:captions", captionsLabel);
      if (captionsLabel !== 'Disabled') {
        localStorage.setItem("player:lastActiveCaption", captionsLabel);
      }
    } catch (err) {
      console.error("[Player] Could not save caption state:", err);
    }
  }, [captionsLabel]);

  // Save the qualityLabel whenever changes.
  useEffect(() => {
    try {
      localStorage.setItem("player:quality", qualityLabel.toString());
    } catch (err) {
      console.error("[Player] Could not save quality:", err);
    }
  }, [qualityLabel]);

  // Save the audioLabel whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem("player:audio", audioLabel);
    } catch (err) {
      console.error("[Player] Could not save audio state:", err);
    }
  }, [audioLabel]);

  // Save the playbackRate whenever changes.
  useEffect(() => {
    try {
      localStorage.setItem("player:playbackRate", playbackRate.toString());
    } catch (err) {
      console.error("[Player] Could not save playback rate:", err);
    }
  }, [playbackRate]);

  const handlePrev = () => {
    if (hasPrev) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      onIndexChange(newIndex);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      onIndexChange(newIndex);
    }
  };

  //Gatekeeper for Keydown Effects.
  const shouldIgnoreKeyPress = (event, options = {}) => {
    const { allowRange = true, allowRepeat = false, allowShift = false } = options;
    const { target, ctrlKey, altKey, metaKey, shiftKey, repeat } = event;
    if (ctrlKey || altKey || metaKey) return true;
    if (!allowShift && shiftKey) return true;
    if (target.tagName === 'INPUT') return !(allowRange && target.type === 'range');
    if (target.tagName === 'TEXTAREA' || target.isContentEditable) return true;
    if (repeat && !allowRepeat) return true;
    return false;
  };

  return (
    <div
      ref={containerRef}
      tabIndex="-1"
      style={{ outline: 'none' }}
      className={`player-container${controlsVisible ? " controls-visible" : " hide-cursor"}`}
      onMouseLeave={() => !isPaused && (clearTimeout(hideControlsTimeout.current), setControlsVisible(false))}
      onMouseMove={() => {
        if (isPaused) return;
        clearTimeout(hideControlsTimeout.current);
        setControlsVisible(true);
        !isHoveringControlsRef.current && (hideControlsTimeout.current = setTimeout(() => setControlsVisible(false), 3000))
      }}
    >
      <IconSprite />

      <video
        key={currentSrc}
        ref={videoRef}
        crossOrigin="anonymous"
        className="video-wrapper"
        poster={currentPos}
        preload="metadata"
      />

      {(captionsText && captionsLabel !== "Disabled") &&
        <div className="video-captions-container">
          <span>{captionsText}</span>
        </div>
      }

      <SettingsMenu
        playerSize={playerSize}

        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}

        audiosArray={audiosArray}
        captionsArray={captionsArray}
        qualitiesArray={qualitiesArray}
        playbackRatesArray={playbackRatesArray}

        autoHeight={autoHeight}
        audioLabel={audioLabel}
        captionsLabel={captionsLabel}
        qualityLabel={qualityLabel}
        playbackRate={playbackRate}

        setAudioLabel={setAudioLabel}
        setCaptionsLabel={setCaptionsLabel}
        setQualityLabel={setQualityLabel}
        setPlaybackRate={setPlaybackRate}
      />

      <div
        className={`video-controls-container${controlsVisible ? "" : " hide"}`}
        onMouseEnter={() => isHoveringControlsRef.current = true}
        onMouseLeave={() => isHoveringControlsRef.current = false}
      >
        <Seekbar
          videoRef={videoRef}
          currentSrc={currentSrc}
          containerRef={containerRef}
          shouldIgnoreKeyPress={shouldIgnoreKeyPress}
        />

        <div className="video-controls-container-bottom">
          {sourcesArray.length > 1 &&
            <SkipPrev
              onPrev={handlePrev}
              isDisabled={!hasPrev}
              shouldIgnoreKeyPress={shouldIgnoreKeyPress}
            />
          }

          <PlayPause
            videoRef={videoRef}
            currentSrc={currentSrc}
            shouldIgnoreKeyPress={shouldIgnoreKeyPress}
          />

          {sourcesArray.length > 1 &&
            <SkipNext
              onNext={handleNext}
              isDisabled={!hasNext}
              shouldIgnoreKeyPress={shouldIgnoreKeyPress}
            />
          }

          <Volume
            videoRef={videoRef}
            currentSrc={currentSrc}
            containerRef={containerRef}
            shouldIgnoreKeyPress={shouldIgnoreKeyPress}
          />

          <div className="spacer"></div>

          {captionsArray.length > 1 &&
            <Captions
              captionsLabel={captionsLabel}
              setCaptionsLabel={setCaptionsLabel}
              captionsArray={captionsArray}
              shouldIgnoreKeyPress={shouldIgnoreKeyPress}
            />
          }

          <Settings
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            autoHeight={autoHeight}
            qualityLabel={qualityLabel}
          />

          <Fullscreen
            containerRef={containerRef}
            shouldIgnoreKeyPress={shouldIgnoreKeyPress}
          />
        </div>
      </div>
    </div>
  );
}

export default Player;