import {useState, useEffect} from "react"
import "../styles/Navbar.css";
import api from "../api";

function Navbar() {
  const [seasons, setSeasons] = useState()



  return (
    <nav className="navbar">
      <h1 className="navbar__title">Navbar</h1>
    </nav>
  );
}

export default Navbar;
