import { useState, useEffect, useRef } from 'react';
import shaka from 'shaka-player/dist/shaka-player.compiled';

function useShaka({
  videoRef,
  currentSrc,
  setActiveMenu
}) {
  const shakaPlayerRef = useRef(null);
  const [autoHeight, setAutoHeight] = useState(null);
  const [audiosArray, setAudiosArray] = useState([]);
  const [captionsArray, setCaptionsArray] = useState([]);
  const [qualitiesArray, setQualitiesArray] = useState([]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentSrc) return;

    // --- Reset State ---
    setCaptionsArray([]);
    setQualitiesArray([]);
    setAudiosArray([]);

    // --- Install Polyfills ---
    if (shaka.polyfill) {
      shaka.polyfill.installAll();
      console.log("Polyfills Installing")
    }

    // --- Initialize Player ---
    if (shaka.Player.isBrowserSupported()) {
      // Create instance (Detached)
      const player = new shaka.Player();
      shakaPlayerRef.current = player;

      // Attach to Video Element (Async)
      player.attach(video).then(() => {

        // Configure: Enable Auto Quality (ABR)
        player.configure({
          abr: { enabled: true },
        });

        // --- Helper: Update Qualities (Variants) ---
        const updateQualities = () => {
          const tracks = player.getVariantTracks();
          const map = new Map();

          // Filter: Keep highest bandwidth per resolution
          tracks.forEach((track) => {
            const height = track.height;
            const previous = map.get(height);
            if (!previous || track.bandwidth > previous.bandwidth) {
              map.set(height, { id: track.id, bandwidth: track.bandwidth });
            }
          });

          const uniqueHeights = Array.from(map.entries())
            .map(([height, obj]) => ({ height, id: obj.id }))
            .sort((a, b) => b.height - a.height); // Descending order

          uniqueHeights.length > 0
            ? setQualitiesArray([
              ...uniqueHeights,
              { height: "Auto", id: -1 } // -1 = ABR enabled
            ])
            : setActiveMenu((prev) => (prev === "quality" ? null : prev));
        };

        // --- Helper: Update Audio ---
        const updateAudio = () => {
          const tracks = player.getAudioTracks();
          const uniqueLanguages = [...new Set(tracks.map(t => t.language))];
          setAudiosArray(uniqueLanguages);

          if (uniqueLanguages.length < 1) {
            setActiveMenu(prev => prev === "audio" ? null : prev);
          }
        };

        // --- Helper: Update Captions ---
        const updateCaptions = () => {
          const tracks = player.getTextTracks();
          const uniqueCaptions = tracks.map(t => ({
            language: t.language,
            label: t.label || t.language,
            id: t.id
          }));

          uniqueCaptions.length > 0
            ? setCaptionsArray([
              { language: "disabled", label: "Disabled", mode: "hidden" },
              ...uniqueCaptions
            ])
            : setActiveMenu((prev) => (prev === "captions" ? null : prev));
        };

        // --- Event Listener: Error ---
        player.addEventListener('error', (event) => {
          const { detail } = event;
          if (detail.severity === shaka.util.Error.Severity.CRITICAL) {
            console.error('Shaka Fatal Error:', detail);
            // Attempt retry
            player.unload().then(() => player.load(currentSrc)).catch(console.error);
          }
        });

        // --- Event Listener: Auto-Height (Adaptation) ---
        player.addEventListener('adaptation', () => {
          const tracks = player.getVariantTracks();
          const activeTrack = tracks.find(t => t.active);
          if (activeTrack?.height) {
            setAutoHeight(activeTrack.height);
          }
        });

        // 3. Load Source (After attach)
        player.load(currentSrc)
          .then(() => {
            updateQualities();
            updateAudio();
            updateCaptions();
            video.play();
          })
          .catch((error) => {
            console.error('Error loading content', error);
          });
      }).catch(err => {
        console.error("Failed to attach video element", err);
      });

      return () => {
        if (player) {
          player.destroy();
          shakaPlayerRef.current = null;
        }
      };

    } else {
      // Fallback for Safari (Native HLS)
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = currentSrc;
      }
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

  return {
    shakaPlayerRef,
    autoHeight,
    audiosArray,
    captionsArray,
    qualitiesArray,
    playbackRatesArray: [0.5, 0.75, 1, 1.25, 1.5],
  }
};

export default useShaka;