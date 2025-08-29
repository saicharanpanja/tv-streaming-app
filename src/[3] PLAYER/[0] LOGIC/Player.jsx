import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Hls from "hls.js";

import Seekbar from "./Seekbar";
import PlayPause from "./PlayPause";
import Volume from "./Volume";
import Captions from "./Captions";
import Settings from "./Settings/Settings";
import Fullscreen from "./Fullscreen";
import IconSprite from "../[2] UTILS/IconSprite";

import "../[1] STYLES/Player.css";
import "../[1] STYLES/Seekbar.css";
import "../[1] STYLES/Volume.css";
import "../[1] STYLES/Settings.css";
import "../[1] STYLES/Fullscreen.css";

function Player({ poster = "", src = "" }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const containerRef = useRef(null);
  const location = useLocation();

  // States for player UI
  const [tracks, setTracks] = useState([]);
  const [qualities, setQualities] = useState([]);
  const [autoHeight, setAutoHeight] = useState(null);

  // Get the saved captionsLabel.
  const [captionsLabel, setCaptionsLabel] = useState(() => {
    return localStorage.getItem("player:captions") || 'Disabled';
  });

  // Get the saved selected quality.
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem("player:quality");
    if (saved === "Auto") return "Auto";
    const n = parseInt(saved, 10);
    return !isNaN(n) ? n : "Auto";
  });

  // HLS, quality heights, subtitles setup and teardown.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const shouldAutoplay = location.state?.fromThumbnail;
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

      hls.loadSource(src);
      hls.attachMedia(video);
      shouldAutoplay && video.play().catch(() => { });
      video.addEventListener('loadedmetadata', applyTracks);
      return () => {
        hls.destroy();
        hlsRef.current = null;
        video.removeEventListener('loadedmetadata', applyTracks);
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      shouldAutoplay && video.play().catch(() => { });
      video.addEventListener('loadedmetadata', applyTracks);
      return () => {
        video.removeEventListener('loadedmetadata', applyTracks);
      };
    }
  }, [src, location.state]);

  // Apply the saved captionsLabel whenever changes.
  useEffect(() => {
    const getConsistentLabel = (track) => {
      const langMap = { en: 'English', eng: 'English', de: 'Deutsch', deu: 'Deutsch', ger: 'Deutsch' };
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

  return (
    <div className="player-container" ref={containerRef}>
      <IconSprite />

      <video
        ref={videoRef}
        crossOrigin="anonymous"
        className="video-wrapper"
        poster={poster}
        preload="metadata"
      />

      <div className="video-controls-container">
        <Seekbar videoRef={videoRef} />

        <div className="video-controls-container-bottom">
          <PlayPause videoRef={videoRef} />
          <Volume videoRef={videoRef} />

          <div className="spacer"></div>

          <Captions
            captionsLabel={captionsLabel}
            setCaptionsLabel={setCaptionsLabel}
            tracks={tracks}
          />

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