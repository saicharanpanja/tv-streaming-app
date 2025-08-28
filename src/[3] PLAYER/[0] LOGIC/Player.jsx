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

  const [isReadyToPlay, setIsReadyToPlay] = useState(false);

  // States for player UI
  const [captionsLabel, setCaptionsLabel] = useState('Disabled');
  const [tracks, setTracks] = useState([]);
  const [qualities, setQualities] = useState([]);
  const [selected, setSelected] = useState("Auto");
  const [autoHeight, setAutoHeight] = useState(null);

  // --- EFFECT 1: Manages HLS Stream Setup & Teardown ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    setIsReadyToPlay(false);

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

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const map = new Map();
        hls.levels.forEach((level, index) => {
          const previous = map.get(level.height);
          if (!previous || level.bitrate > previous.bitrate) {
            map.set(level.height, { levelIndex: index, bitrate: level.bitrate });
          }
        });

        const uniqueHeights = Array.from(map.entries())
          .map(([height, obj]) => ({ height, levelIndex: obj.levelIndex }))
          .sort((a, b) => a.height - b.height);

        setQualities(uniqueHeights);
        setSelected("Auto");
        hls.currentLevel = -1;
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
        const level = hls.levels?.[data.level];
        if (level?.height) setAutoHeight(level.height);
      });

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        setIsReadyToPlay(true);
      });

      hls.loadSource(src);
      hls.attachMedia(video);
      video.addEventListener('loadedmetadata', applyTracks);

      return () => {
        hls.destroy();
        hlsRef.current = null;
        video.removeEventListener('loadedmetadata', applyTracks);
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      setIsReadyToPlay(true);
      video.addEventListener('loadedmetadata', applyTracks);
      return () => {
        video.removeEventListener('loadedmetadata', applyTracks);
      }
    }
  }, [src]);

  // --- EFFECT 2: Manages Conditional Autoplay ---
  useEffect(() => {
    const video = videoRef.current;
    const shouldAutoplay = location.state?.fromThumbnail;

    if (video && isReadyToPlay && shouldAutoplay) {
      video.play().catch((error) => {
        console.error('Autoplay was attempted but prevented:', error);
      });
    }
  }, [isReadyToPlay, location.state]);
  
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
            videoRef={videoRef}
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
