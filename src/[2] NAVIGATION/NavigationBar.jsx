import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FilmReelIcon,
  MusicNoteIcon,
  RadioIcon,
  TelevisionIcon,
} from "@phosphor-icons/react";
import "./NavigationBar.css";

function NavigationBar({channel}) {
  const [clickedIcon, setClickedIcon] = useState(null);

  function navClickEffect(page) {
    setClickedIcon(page);
    setTimeout(()=>setClickedIcon(null), 200);
  }

  return (
    <div className="nav-container">

      <NavLink
        to={`/tv${channel ? `/${channel}` : ""}`}
        className="nav-icon-wrapper"
        onClick={() => navClickEffect("tv")}
      >
        {({ isActive }) =>
          <TelevisionIcon
            className={`nav-icon${clickedIcon==="tv" ? " clicked" : ""}`}
            weight={isActive ? "fill" : "light"}
            color={isActive ? "#1A2421" : "black"}
            size={29}
          />
        }
      </NavLink>

      <NavLink
        to="/radio"
        className="nav-icon-wrapper"
        onClick={() => navClickEffect("radio")}
      >
        {({ isActive }) =>
          <RadioIcon
            className={`nav-icon${clickedIcon === "radio" ? " clicked" : ""}`}
            weight={isActive ? "fill" : "light"}
            color={isActive ? "#1A2421" : "black"}
            size={29}
          />
        }
      </NavLink>

      <NavLink
        to="/movies"
        className="nav-icon-wrapper"
        onClick={() => navClickEffect("movies")}
      >
        {({ isActive }) =>
          <FilmReelIcon
            className={`nav-icon${clickedIcon === "movies" ? " clicked" : ""}`}
            weight={isActive ? "fill" : "light"}
            color={isActive ? "#1A2421" : "black"}
            size={29}
          />
        }
      </NavLink>

      <NavLink
        to="/music"
        className="nav-icon-wrapper"
        onClick={() => navClickEffect("music")}
      >
        {({ isActive }) =>
          <MusicNoteIcon
            className={`nav-icon${clickedIcon === "music" ? " clicked" : ""}`}
            weight={isActive ? "fill" : "light"}
            color={isActive ? "#1A2421" : "black"}
            size={29}
          />
        }
      </NavLink>
    </div>
  );
}

export default NavigationBar;