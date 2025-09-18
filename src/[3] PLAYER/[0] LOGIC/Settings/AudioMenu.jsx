import { CaretLeftIcon } from '@phosphor-icons/react';

export default function AudioMenu({
  isMenuOpen,
  activeMenuTab,
  setActiveMenuTab,

  audiosArray,
  audioLabel,
  setAudioLabel,
}) {
  function handleSelect(label) {
    setAudioLabel(label);
    setActiveMenuTab('main');
  };

  return (
    <div
      className={`settings-menu audio${isMenuOpen && activeMenuTab === 'audio' ? '' : ' hide'}`}
    >
      <div
        className="settings-menu audio-item"
        onClick={() => setActiveMenuTab('main')}
      >
        <CaretLeftIcon size={12} weight="bold" />
        <span>Audio</span>
      </div>

      <span className="settings-menu audio-item-divider"></span>

      {/* --- Map over available audios --- */}
      {audiosArray.map((audio) => (
        <div
          key={audio.id}
          onClick={() => handleSelect(audio.name)}
          className="settings-menu audio-item"
        >
          <span className={`settings-menu audio-item-radio${audioLabel === audio.name ? ' selected' : ''}`} />
          <span>{audio.name}</span>
        </div>
      ))}
    </div >
  );
}