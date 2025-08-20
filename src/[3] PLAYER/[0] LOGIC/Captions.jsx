import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Icon from "../[2] UTILS/Icon";

const languageMap = {
  en: 'English',
  eng: 'English',
  de: 'Deutsch',
  deu: 'Deutsch',
};

const getConsistentLabel = (track) => {
  return languageMap[track.language] || track.label;
};

export default function Captions({ videoRef, captionsLabel, setCaptionsLabel, tracks }) {
  const [overlayData, setOverlayData] = useState(null);
  const areCaptionsOn = captionsLabel !== 'Disabled';
  const lastSelectedTrackLabelRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    function findInitialTrack() {
      const textTracks = video.textTracks;
      for (let i = 0; i < textTracks.length; i++) {
        if (textTracks[i].mode === 'showing') {
          const label = getConsistentLabel(textTracks[i]);
          setCaptionsLabel(label);
          lastSelectedTrackLabelRef.current = label;
          return;
        }
      }
      setCaptionsLabel('Disabled');
    }

    video.addEventListener("loadeddata", findInitialTrack);
    return () => {
      video.removeEventListener("loadeddata", findInitialTrack);
    };
  }, [setCaptionsLabel, videoRef]);

  const toggleCaptions = useCallback(() => {
    const video = videoRef.current;
    if (!video || !tracks || tracks.length === 0) return;

    if (areCaptionsOn) {
      lastSelectedTrackLabelRef.current = captionsLabel;
      tracks.forEach(track => track.mode = 'disabled');
      setCaptionsLabel('Disabled');
    } else {
      const targetLabel = lastSelectedTrackLabelRef.current && lastSelectedTrackLabelRef.current !== 'Disabled'
        ? lastSelectedTrackLabelRef.current
        : getConsistentLabel(tracks[0]);

      let trackToEnable = tracks.find(track => getConsistentLabel(track) === targetLabel) || tracks[0];
      tracks.forEach(track => {
        track.mode = (track === trackToEnable) ? 'showing' : 'disabled';
      });

      setCaptionsLabel(getConsistentLabel(trackToEnable));
    }
  }, [areCaptionsOn, captionsLabel, setCaptionsLabel, tracks, videoRef]);

  useEffect(() => {
    let timer;
    function handleKeyDown(event) {
      const { tagName } = event.target;
      if (tagName === "INPUT" || tagName === "TEXTAREA") return;

      if (event.code === "KeyC") {
        const iconName = areCaptionsOn ? "captions-off" : "captions-on";
        setOverlayData({ name: iconName, id: Date.now() });
        clearTimeout(timer);
        timer = setTimeout(() => setOverlayData(null), 500);
        toggleCaptions();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [areCaptionsOn, toggleCaptions]);

  return (
    <button className="video-controls captions-container" onClick={toggleCaptions}>
      <Icon
        name="captions-off"
        className={`video-controls-icons captions-on${!areCaptionsOn ? "" : " hide"}`}
      />
      <Icon
        name="captions-on"
        className={`video-controls-icons captions-off${areCaptionsOn ? "" : " hide"}`}
      />
      {overlayData &&
        createPortal(
          <div key={overlayData.id} className="overlay-wrapper">
            <Icon
              name={overlayData.name}
              size="3.5vw"
              color="rgba(255,255,255,0.8)"
            />
          </div>,
          document.querySelector(".player-container")
        )}
    </button>
  );
}