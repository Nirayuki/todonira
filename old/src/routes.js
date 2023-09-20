import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { LoadingOutlined } from '@ant-design/icons'

const Home = lazy(() => import("./pages/home"));
const Slug = lazy(() => import("./pages/slug"));

const Rotas = () => {

    return (
        <Suspense fallback={
            <div className="loading"><LoadingOutlined /></div>
        }>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:slug" element={<Slug />} />
            </Routes>
        </Suspense>
    )
}

export default Rotas;