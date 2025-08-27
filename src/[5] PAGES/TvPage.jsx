import { useState } from 'react';

import Header from '../[1] HEADER/Header'
import NavigationBar from '../[2] NAVIGATION/NavigationBar'
import Player from '../[3] PLAYER/[0] LOGIC/Player'
import ChannelDesc from '../[4] DESCRIPTION/ChannelDesc'
import json from '../[4] DESCRIPTION/Utils/ChannelDesc.json'

import './TvPage.css'

function TvPage() {
  const [isPlaying, setIsPlaying] = useState(null);

  return (
    <div className="tv-container">
      <Header color={isPlaying ? `${json[isPlaying].color}` : '#03581d'} />

      <NavigationBar />

      {isPlaying &&
        <>
          <Player
            src={`${json[isPlaying].src[1]}`}
            poster={`${json[isPlaying].src[0]}`}
          />

          <ChannelDesc channel={isPlaying} />
        </>
      }


      <div className="content-wrapper">
        {Object.keys(json).map((key) => (
          <img
            key={key}
            className="channel-thumbnail"
            src={json[key].src[0]}
            loading="lazy"
            alt={json[key].name}
            title={json[key].name}
            onClick={() => setIsPlaying(key)}
          />
        ))}
      </div>
    </div>
  );
}

export default TvPage;