import { CaretLeftIcon } from '@phosphor-icons/react';

const captionsLangLabel = {
  en: 'English',
  eng: 'English',
  de: 'Deutsch',
  deu: 'Deutsch',
  ger: 'Deutsch',
};

const captionsLangTag = {
  en: 'EN',
  eng: 'EN',
  de: 'DE',
  deu: 'DE',
  ger: 'DE',
};

const getConsistentLabel = (track) => {
  return captionsLangLabel[track.language] || track.label;
};

export default function CaptionsMenu({
  activeMenuTab,
  setActiveMenuTab,
  captionsLabel,
  setCaptionsLabel,
  isMenuOpen,
  tracks
}) {
  const handleSelect = (label) => {
    setCaptionsLabel(label);
    setActiveMenuTab('main');
  };

  return (
    <div
      className={`settings-menu captions${isMenuOpen && activeMenuTab === 'captions' ? '' : ' hide'}`}
    >
      <div
        className="settings-menu captions-item"
        onClick={() => setActiveMenuTab('main')}
      >
        <CaretLeftIcon size={12} weight="bold" />
        <span>Captions</span>
      </div>

      <span className="settings-menu captions-item-divider"></span>

      {/* --- Disabled Option --- */}
      <div
        onClick={() => handleSelect('Disabled')}
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
            onClick={() => handleSelect(consistentLabel)}
            className="settings-menu captions-item"
          >
            <span className={`settings-menu captions-item-radio${captionsLabel === consistentLabel ? ' selected' : ''}`} />
            <span>{consistentLabel}</span>
            <span className={`settings-menu captions-item-label`}>
              {captionsLangTag[track.language] || track.language.toUpperCase().slice(0, 2) || ""}
            </span>
          </div>
        );
      })}
    </div >
  );
}