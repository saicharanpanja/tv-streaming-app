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
      <Header color={isPlaying ? `${json[isPlaying].color}` : '#03581d'}/>

      <NavigationBar />

      {isPlaying &&
        <>
          <Player
            src={`${json[isPlaying].src[1]}`}
            poster={`${json[isPlaying].src[0]}`}
          />

          <ChannelDesc
            channel={isPlaying}
          />
        </>
      }


      <div className="content-wrapper">
        <img
          className="channel-thumbnail"
          src="/channel-thumbnails/ard-alpha.jpg"
          loading="lazy"
          alt={json["ard-alpha"].name}
          title={json["ard-alpha"].name}
          onClick={() => setIsPlaying("ard-alpha")}
        />

        <img
          className="channel-thumbnail"
          src="/channel-thumbnails/hr.jpg"
          loading="lazy"
          alt={json["hr"].name}
          title={json["hr"].name}
          onClick={() => setIsPlaying("hr")}
        />

        <img
          className="channel-thumbnail"
          src="/channel-thumbnails/kika.jpg"
          loading="lazy"
          alt={json["kika"].name}
          title={json["kika"].name}
          onClick={() => setIsPlaying("kika")}
        />

        <img
          className="channel-thumbnail"
          src="/channel-thumbnails/tagesschau24.jpg"
          loading="lazy"
          alt={json["tagesschau24"].name}
          title={json["tagesschau24"].name}
          onClick={() => setIsPlaying("tagesschau24")}
        />

        <img
          className="channel-thumbnail"
          src="/channel-thumbnails/mdr.jpg"
          loading="lazy"
          alt={json["mdr"].name}
          title={json["mdr"].name}
          onClick={() => setIsPlaying("mdr")}
        />

        <img
          className="channel-thumbnail"
          src="/channel-thumbnails/one.jpg"
          loading="lazy"
          alt={json["one"].name}
          title={json["one"].name}
          onClick={() => setIsPlaying("one")}
        />

        <img
          className="channel-thumbnail"
          src="/channel-thumbnails/zdf.jpg"
          loading="lazy"
          alt={json["zdf"].name}
          title={json["zdf"].name}
          onClick={() => setIsPlaying("zdf")}
        />

        <img
          className="channel-thumbnail"
          src="/channel-thumbnails/br.jpg"
          loading="lazy"
          alt={json["br"].name}
          title={json["br"].name}
          onClick={() => setIsPlaying("br")}
        />

        <img
          className="channel-thumbnail"
          src="/channel-thumbnails/phoenix.jpg"
          loading="lazy"
          alt={json["phoenix"].name}
          title={json["phoenix"].name}
          onClick={() => setIsPlaying("phoenix")}
        />

        <img
          className="channel-thumbnail"
          src="/channel-thumbnails/arte.jpg"
          loading="lazy"
          alt={json["arte"].name}
          title={json["arte"].name}
          onClick={() => setIsPlaying("arte")}
        />
      </div>
    </div>
  );
}

export default TvPage;