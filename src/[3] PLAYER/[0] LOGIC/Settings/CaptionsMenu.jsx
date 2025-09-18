import { CaretLeftIcon } from '@phosphor-icons/react';

const captionsLangLabel = { de: 'Deutsch', deu: 'Deutsch', ger: 'Deutsch' };
const getConsistentLabel = (track) => captionsLangLabel[track.language] || track.label;

const captionsLangTag = { de: 'DE', deu: 'DE', ger: 'DE' };

export default function CaptionsMenu({
  isMenuOpen,
  activeMenuTab,
  setActiveMenuTab,

  captionsArray,
  captionsLabel,
  setCaptionsLabel,
}) {
  function handleSelect(label) {
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
      {captionsArray.map((track) => {
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