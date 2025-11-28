import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/Home.css";

function Home() {

    return (
    <div className="home">
        <Navbar />
        <div className="home__body">
        <Sidebar />
        <div className="home__content">here</div>
        </div>
    </div>
    );
}

export default Home;
