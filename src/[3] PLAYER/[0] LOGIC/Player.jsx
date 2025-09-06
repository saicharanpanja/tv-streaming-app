import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

import Seekbar from "./Seekbar";
import SkipPrev from "./SkipPrev";
import PlayPause from "./PlayPause";
import SkipNext from "./SkipNext";
import Volume from "./Volume";
import Captions from "./Captions";
import MusicMode from "./MusicMode";
import Settings from "./Settings/Settings";
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

  //Get current Source and Poster and check hasPrev, hasNext
  const [currentIndex, setCurrentIndex] = useState(index);
  const currentSrc = sourcesArray[currentIndex];
  const currentPos = postersArray[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < sourcesArray.length - 1;
  useEffect(() => setCurrentIndex(index), [index]);

  // States for Captions, Qualities.
  const [tracks, setTracks] = useState([]);
  const [captionsLabel, setCaptionsLabel] = useState(() => localStorage.getItem("player:captions") || 'Disabled');

  const [qualities, setQualities] = useState([]);
  const [autoHeight, setAutoHeight] = useState(null);
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem("player:quality");
    if (saved === "Auto") return "Auto";
    const n = parseInt(saved, 10);
    return !isNaN(n) ? n : "Auto";
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
  }, []);

  // Manage controls visibility when play/pause state changes
  useEffect(() => {
    clearTimeout(hideControlsTimeout.current);
    isPaused ? setControlsVisible(true)
      : hideControlsTimeout.current = setTimeout(() => setControlsVisible(false), 3000);
  }, [isPaused]);

  // HLS Setup, Get quality heights and subtitles and teardown.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentSrc) return;

    setQualities([]);

    // Function to get the available Subtitles by filtering.
    function applyTracks() {
      const availableTracks = Array.from(video.textTracks).filter(
        (t) =>
          t.cues != null &&
          (t.kind === "subtitles" || t.kind === "captions")
      );
      setTracks(availableTracks);
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

        // Map new array without bitrates.
        const uniqueHeights = Array.from(map.entries())
          .map(([height, obj]) => ({ height, levelIndex: obj.levelIndex }))
          .sort((a, b) => a.height - b.height);
        setQualities(uniqueHeights);
      });

      // Set the AutoHeight if quality changes.
      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
        const level = hls.levels?.[data.level];
        if (level?.height) setAutoHeight(level.height);
      });

      hls.loadSource(currentSrc);
      hls.attachMedia(video);
      video.play().catch(() => { });
      video.addEventListener('loadedmetadata', applyTracks);
      return () => {
        hls.destroy();
        hlsRef.current = null;
        video.removeEventListener('loadedmetadata', applyTracks);
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = currentSrc;
      video.play().catch(() => { });
      video.addEventListener('loadedmetadata', applyTracks);
      return () => {
        video.removeEventListener('loadedmetadata', applyTracks);
      };
    }
  }, [currentSrc]);

  // Apply the saved captionsLabel whenever changes.
  useEffect(() => {
    const getConsistentLabel = (track) => {
      const langMap = { de: 'Deutsch', deu: 'Deutsch', ger: 'Deutsch' };
      return langMap[track.language] || track.label;
    };

    if (tracks.length === 0) return;

    let trackFound = false;
    tracks.forEach(track => {
      if (getConsistentLabel(track) === captionsLabel) {
        track.mode = 'showing';
        trackFound = true;
      } else {
        track.mode = 'disabled';
      }
    });

    if (!trackFound && captionsLabel !== 'Disabled') {
      setCaptionsLabel(getConsistentLabel(tracks[0]));
    }
  }, [tracks, captionsLabel]);

  // Apply the saved quality whenever changes.
  useEffect(() => {
    const hls = hlsRef.current;
    if (!hls || qualities.length === 0) return;

    const preferredQualityAvailable = qualities.some(q => q.height === selected);

    if (selected !== "Auto" && preferredQualityAvailable) {
      const match = qualities.find(q => q.height === selected);
      if (match && hls.currentLevel !== match.levelIndex) {
        hls.currentLevel = match.levelIndex;
      }
    } else {
      if (hls.currentLevel !== -1) {
        hls.currentLevel = -1;
      }
      if (selected !== "Auto" && !preferredQualityAvailable) {
        setSelected("Auto");
      }
    }
  }, [qualities, selected]);

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
      localStorage.setItem("player:quality", selected.toString());
    } catch (err) {
      console.error("[Player] Could not save quality:", selected, err);
    }
  }, [selected]);

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

  return (
    <div
      ref={containerRef}
      className={`player-container${isPaused || controlsVisible ? "" : " hide-cursor"}`}
      onMouseLeave={() => !isPaused && (
        clearTimeout(hideControlsTimeout.current),
        setControlsVisible(false))
      }
      onMouseMove={() => {
        if (isPaused) return;
        clearTimeout(hideControlsTimeout.current);
        setControlsVisible(true);
        !isHoveringControlsRef.current && (hideControlsTimeout.current = setTimeout(() => setControlsVisible(false), 3000))
      }}
    >
      <IconSprite />

      <video
        ref={videoRef}
        crossOrigin="anonymous"
        className="video-wrapper"
        poster={currentPos}
        preload="metadata"
      />

      <div
        className={`video-controls-container${isPaused || controlsVisible ? "" : " hide"}`}
        onMouseEnter={() => isHoveringControlsRef.current = true}
        onMouseLeave={() => isHoveringControlsRef.current = false}
      >
        <Seekbar videoRef={videoRef} />

        <div className="video-controls-container-bottom">
          <SkipPrev onPrev={handlePrev} isDisabled={!hasPrev} />
          <PlayPause videoRef={videoRef} />
          <SkipNext onNext={handleNext} isDisabled={!hasNext} />
          <Volume videoRef={videoRef} />

          <div className="spacer"></div>

          <Captions
            captionsLabel={captionsLabel}
            setCaptionsLabel={setCaptionsLabel}
            tracks={tracks}
          />

          <MusicMode />

          <Settings
            videoRef={videoRef}
            captionsLabel={captionsLabel}
            setCaptionsLabel={setCaptionsLabel}
            tracks={tracks}
            hlsRef={hlsRef}
            qualities={qualities}
            selected={selected}
            setSelected={setSelected}
            autoHeight={autoHeight}
          />

          <Fullscreen containerRef={containerRef} />
        </div>
      </div>
    </div>
  );
}

export default Player;