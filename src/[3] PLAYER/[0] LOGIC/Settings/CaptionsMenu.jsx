import { CaretLeftIcon } from '@phosphor-icons/react';

const languageMap = {
  en: 'English',
  eng: 'English',
  de: 'Deutsch',
  deu: 'Deutsch',
};

function getConsistentLabel(track) {
  return languageMap[track.language] || track.label;
};

export default function CaptionsMenu({
  activeMenuTab,
  setActiveMenuTab,
  captionsLabel,
  setCaptionsLabel,
  isMenuOpen,
  tracks
}) {
  const handleSelect = (track) => {
    tracks.forEach((t) => (t.mode = 'disabled'));

    if (track) {
      track.mode = 'showing';
      setCaptionsLabel(getConsistentLabel(track));
    } else {
      setCaptionsLabel('Disabled');
    }

    setActiveMenuTab('main');
  };

  return (
    <div
      className={`settings-menu captions${isMenuOpen && activeMenuTab === 'captions' ? '' : ' hide'}`}
    >
      <div
        className="settings-menu captions-item"
        onClick={() => setActiveMenuTab('main')}
        onKeyDown={(e) => e.key === 'Enter' && setActiveMenuTab('main')}
      >
        <CaretLeftIcon size={12} weight="bold" />
        <span>Captions</span>
      </div>

      <span className="settings-menu captions-item-divider"></span>

      {/* --- Disabled Option --- */}
      <div
        onClick={() => handleSelect(null)}
        className="settings-menu captions-item"
      >
        <span className={`settings-menu captions-item-radio${captionsLabel === 'Disabled' ? ' selected' : ''}`} />
        <span>Disabled</span>
      </div>

      {/* --- Map over available tracks --- */}
      {tracks.map((track) => {
        const consistentLabel = getConsistentLabel(track);
        return (
          <div
            key={track.language + track.label}
            onClick={() => handleSelect(track)}
            className="settings-menu captions-item"
          >
            <span className={`settings-menu captions-item-radio${captionsLabel === consistentLabel ? ' selected' : ''}`} />
            <span>{consistentLabel}</span>
            <span
              className={`settings-menu captions-item-label`}
            >{track.language.toUpperCase().slice(0, 2) || ""}</span>
          </div>
        );
      })}
    </div >
  );
}