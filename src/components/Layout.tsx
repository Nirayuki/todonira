'use client'
import React from "react";
import { LuKanbanSquare } from "react-icons/lu";
import { AiOutlineUser, AiOutlineHome, AiOutlinePlus } from 'react-icons/ai';

import { useAuthContext } from "./authContext";
import { useState, useEffect, useRef } from "react";


export const Layout = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);
    const dropdownref = useRef<HTMLDivElement | null>(null);

    const auth = useAuthContext();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
           if(open === true){
                if (dropdownref.current && !dropdownref.current.contains(event.target as Node)) {
                    setOpen(false);
                }
           }
        }

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [open])

    const handleItemClick = () => {
        setOpen(false);
    }

    return (
        <>
            <header>
                <a className="logo" href="/">
                    <div className="icon">
                        <LuKanbanSquare />
                    </div>
                    <p className='logo-name'>Todonira</p>
                </a>
                <div className="navigation">
                    {auth?.user ? (
                        <div className="user-nav">
                            <div className="add">
                                <AiOutlinePlus/>
                            </div>
                            <div className="avatar">
                                <AiOutlineUser onClick={() => setOpen(!open)}/>
                                <div className={`menu ${open ? "open-menu" : "close-menu"}`} ref={dropdownref}>
                                    <div className="content-menu">
                                        <a className="home">
                                            <span className="icon-menu">
                                                <AiOutlineHome /></span>
                                            {auth.user.name}
                                        </a>
                                        <div className="nav-menu">
                                            <a href="/nova-lista">Nova Lista</a>
                                            <a href="/">Suas Listas</a>
                                            <a href="/perfil/editar">Editar Perfil</a>
                                        </div>
                                        <div className="sair" onClick={() => {
                                            auth.handleLogout();
                                            setOpen(false);
                                        }}>
                                            Deslogar
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="login-cadastro">
                            <a href="/login">Login</a>
                            <a href="/cadastro">Cadastrar</a>
                        </div>
                    )}
                </div>
            </header>
            <div className="children">
                {children}
            </div>
        </>
    )
}