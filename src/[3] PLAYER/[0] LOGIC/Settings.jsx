import Icon from "../[2] UTILS/Icon";

export default function Settings({
  activeMenu,
  setActiveMenu,
  autoHeight,
  qualityLabel
}) {
  return (
    <div className="video-controls settings-container">
      <Icon
        name="settings"
        className={`settings-menu icon${activeMenu ? " rotate" : ""}`}
        onClick={() => {
          setActiveMenu(!activeMenu ? "main" : null);
        }}
      />

      <span
        className={`settings-icon-quality-label-${((qualityLabel > 1440 && qualityLabel <= 2160) || (qualityLabel === "Auto" && (autoHeight > 1440 && autoHeight <= 2160))) ? "4k" :
          ((qualityLabel >= 720 && qualityLabel <= 1440) || (qualityLabel === "Auto" && (autoHeight >= 720 && autoHeight <= 1440))) ? "hd" :
            ((qualityLabel >= 480 && qualityLabel < 720) || (qualityLabel === "Auto" && (autoHeight >= 480 && autoHeight < 720))) ? "sd" :
              ""
          }`}
      >{
          ((qualityLabel > 1440 && qualityLabel <= 2160) || (qualityLabel === "Auto" && (autoHeight > 1440 && autoHeight <= 2160))) ? "4K" :
            ((qualityLabel >= 720 && qualityLabel <= 1440) || (qualityLabel === "Auto" && (autoHeight >= 720 && autoHeight <= 1440))) ? "HD" :
              ((qualityLabel >= 480 && qualityLabel < 720) || (qualityLabel === "Auto" && (autoHeight >= 480 && autoHeight < 720))) ? "SD" :
                ""
        }
      </span>
    </div>
  );
}