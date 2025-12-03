import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/Home.css";
import PokemonDetail from "../components/PokemonDetail";

function Home() {

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

export default Home;
