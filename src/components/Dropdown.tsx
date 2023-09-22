'use client'
import React, { useState, useRef, useEffect } from "react"
import '../styles/dropdown.css';

interface Props {
    children: React.ReactNode,
    item: React.ReactNode[];
}

export const Dropdown = ({ children, item }: Props) => {
    const [open, setOpen] = useState(false);

    const dropRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
           if(open === true){
                if (dropRef.current && !dropRef.current.contains(event.target as Node)) {
                    setOpen(false);
                }
           }
        }

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [open])
    
    return (
        <div className="dropdown" ref={dropRef}>
            <div className="children-drop" onClick={() => setOpen(!open)}>
                {children}
            </div>
            <div className={`item-drop ${open ? "open" : "close"}`}>
                {item.map((item, key) => {
                    return (
                        <>
                            <div className="drop-item" key={key} onClick={() => setOpen(false)}>
                                {item}
                            </div>
                        </>
                    )
                })}
            </div>
        </div>
    )
}