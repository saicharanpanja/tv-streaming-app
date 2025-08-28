import { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import Header from '../[1] HEADER/Header'
import NavigationBar from '../[2] NAVIGATION/NavigationBar'
import Player from '../[3] PLAYER/[0] LOGIC/Player'
import ChannelDesc from '../[4] DESCRIPTION/ChannelDesc'
import json from '../[4] DESCRIPTION/Utils/ChannelDesc.json'

import './TvPage.css'

function TvPage() {
  const [isPlaying, setIsPlaying] = useState(null);
  const { channelKey } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [channelKey]);

  useEffect(() => {
    if (channelKey && json[channelKey]) {
      setIsPlaying(channelKey);
    } else {
      setIsPlaying(null);
    }
  }, [channelKey]);

  return (
    <div className="tv-container">
      <Header color={isPlaying ? `${json[isPlaying].color}` : '#03581d'} />
      <NavigationBar />

      {isPlaying && (
        <>
          <Player
            src={`${json[isPlaying].src[1]}`}
            poster={`${json[isPlaying].src[0]}`}
          />
          <ChannelDesc channel={isPlaying} />
        </>
      )}

      <div className="content-wrapper">
        {Object.keys(json).map((key) => (
          isPlaying !== key &&
          <NavLink
            key={key}
            to={`/tv/${key}`}
            state={{ fromThumbnail: true }}
          >
            <img
              className="channel-thumbnail"
              src={json[key].src[0]}
              loading="lazy"
              alt={json[key].name}
              title={json[key].name}
            />
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default TvPage;