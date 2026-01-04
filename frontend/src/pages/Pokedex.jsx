import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/pokedex/Sidebar";
import "../styles/Home.css";
import PokemonDetail from "../components/pokedex/PokemonDetail";

function Pokedex() {

    return (
    <div className="home">
        <Navbar />
        <div className="home__body">
            <Sidebar />
            <PokemonDetail />
        </div>
    </div>
    );
}

export default Pokedex;
