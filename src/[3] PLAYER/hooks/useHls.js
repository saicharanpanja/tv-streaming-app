import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export const useHls = ({
  videoRef,
  currentSrc,
  setAutoHeight,
  setAudiosArray,
  setCaptionsArray,
  setQualitiesArray,
  setActiveMenu
}) => {
  const hlsRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentSrc) return;

    // Reset state
    setCaptionsArray([]);
    setQualitiesArray([]);
    setAudiosArray([]);

    // Get the available subtitles by filtering.
    const getCaptions = () => {
      const uniqueCaptions = Array.from(video.textTracks).filter(
        (t) => t.kind === "subtitles" || t.kind === "captions"
      );

      uniqueCaptions.length > 0
        ? setCaptionsArray([
          { language: "disabled", label: "Disabled", mode: "disabled" },
          ...uniqueCaptions])
        : setActiveMenu(prev => prev === "captions" ? null : prev);
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true, // Use a separate thread to parse video/audio segments so playback stays smooth and the UI doesn’t freeze
        fragLoadingTimeOut: 20000, // If a segment takes > 20s to load, timeout and try to switch levels or retry.
      });

      hlsRef.current = hls;

      // Event listener for discovering quality levels
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

        // Update state
        uniqueHeights.length > 0
          ? setQualitiesArray([
            ...uniqueHeights,
            { height: "Auto", levelIndex: -1 }])
          : setActiveMenu(prev => prev === "quality" ? null : prev);
      });

      // Event listener for discovering audio tracks
      let isAudioEventFired = false;
      hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, (_event, { audioTracks }) => {
        isAudioEventFired = true;
        setAudiosArray(audioTracks);
      });

      hls.on(Hls.Events.LEVEL_LOADED, () => {
        if (isAudioEventFired) return;
        isAudioEventFired = true;
        hls.audioTracks.length < 1 && setActiveMenu(
          prev => prev === "audio" ? null : prev
        );
      });

      // Event listener for tracking auto quality switching
      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
        const level = hls.levels?.[data.level];
        if (level?.height) setAutoHeight(level.height);
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log("fatal network error encountered, try to recover");
              hls.stopLoad();
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log("fatal media error, reloading live stream at nearest segment");
              hls.stopLoad();
              hls.startLoad();
              break;
            default:
              // cannot recover
              hls.destroy();
              break;
          }
        }

        // Non-fatal error handling
        // If we are stuck in a buffer hole, nudge the player
        if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
          console.log("Buffer stalled, trying to nudge");
          // Sometimes simply checking if we are at the end helps, 
          // or relying on auto-recovery if configured.
        }
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
  }, [
    currentSrc,
    setActiveMenu,
    setAudiosArray,
    setAutoHeight,
    setCaptionsArray,
    setQualitiesArray,
    videoRef
  ]);

  return hlsRef;
};