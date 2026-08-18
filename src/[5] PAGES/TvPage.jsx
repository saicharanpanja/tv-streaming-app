import { NavLink, useParams, useNavigate } from 'react-router-dom';

import Header from '../[1] HEADER/Header'
import Player from '../[3] PLAYER/[0] LOGIC/Player'
import ChannelDesc from '../[4] DESCRIPTION/ChannelDesc'
import Footer from '../[0] FOOTER/Footer';
import json from '../[4] DESCRIPTION/Utils/ChannelDesc.json'

import './TvPage.css'

function TvPage() {
  const navigate = useNavigate();

  const { channelKey } = useParams();
  const isPlaying = (channelKey && json[channelKey]) ? channelKey : null;

  // Prepare data to send to Player
  const channelsArray = Object.keys(json);
  const index = isPlaying ? channelsArray.indexOf(isPlaying) : -1;
  const postersArray = channelsArray.map(key => json[key].src[0]);
  const sourcesArray = channelsArray.map(key => json[key].src[1]);
  const handleIndexChange = (newIndex) => {
    const newChannelKey = channelsArray[newIndex];
    if (newChannelKey) {
      navigate(`/tv/${newChannelKey}`);
    }
  };

  return (
    <div className="tv-container">
      <Header color={isPlaying ? `${json[isPlaying].color}` : '#03581d'} />

      {/*<NavigationBar channel={isPlaying} />*/}

      {isPlaying && (
        <>
          <Player
            sourcesArray={sourcesArray}
            postersArray={postersArray}
            initialIndex={index}
            onIndexChange={handleIndexChange}
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
            className="content-nav-link"
          >
            <img
              className="content-channel-thumbnail"
              src={json[key].src[0]}
              loading="lazy"
              alt={json[key].name}
              title={json[key].name}
            />
          </NavLink>
        ))}
      </div>

      <Footer />
    </div>
  );
}

export default TvPage;