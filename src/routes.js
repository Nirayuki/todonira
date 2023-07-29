import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Slug from "./pages/slug";

const Rotas = () => {

    return (
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/:slug" element={<Slug/>}/>
        </Routes>
    )
}

export default Rotas;