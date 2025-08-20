import { BookmarkSimpleIcon } from '@phosphor-icons/react';

import json from './Utils/ChannelDesc.json'
import ChannelLogo from './Utils/ChannelLogo'
import Logo  from './Utils/Logo';
import './ChannelDesc.css'

function ChannelDesc({ channel }) {
  return (
      <div className="details-container">
        <ChannelLogo />

        <div
          className="details-container-top"
          style={{ backgroundColor: json[channel].color }}
        >
          <span className="details-container-top-name">{json[channel].name}</span>
          <BookmarkSimpleIcon
            className="details-container-top-bookmark"
            size={23}
            weight="regular"
          />
        </div>

        <div className="section-divider"></div>

        <div className="details-container-middle">
          <div className="details-container-middle-description">
            <Logo
              channel={json[channel].id}
              style={{
                backgroundColor: channel === "zdf" 
                ? "#fff" 
                : json[channel].color
              }}
              className="details-container-middle-logo"
            />
            {json[channel].desc}
          </div>
          <table className="details-container-middle-table">
            <tbody>
              <tr>
                <th>Broadcast area</th>
                <td>{json[channel].area}</td>
              </tr>
              <tr>
                <th>Ownership</th>
                <td>{json[channel].owner}</td>
              </tr>
              <tr>
                <th>Launched</th>
                <td>{json[channel].launch}</td>
              </tr>
              <tr>
                <th>Website</th>
                <td>{json[channel].web}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  );
}

export default ChannelDesc;