'use client'
import '../styles/modal.css';
import React, { useState, useEffect } from 'react';

import { AiOutlineClose } from 'react-icons/ai';

interface Props {
    children: React.ReactNode,
    open: boolean,
    footer?: React.ReactNode,
    onCancel: () => void,
    onOk: () => void,
    width?: number
}

export const Modal = ({ children, open, footer, onCancel, onOk, width }: Props) => {
    const [modal, setModal] = useState(open);

    useEffect(() => {
        setModal(open);
        if (open) {
            document.body.style.overflowY = "hidden";
        } else {
            document.body.style.overflowY = "auto";
        }
    }, [open])

    return (
        <>
            {modal && (<div className="mask" onClick={() => onCancel()}></div>)}
            <div className={`modal ${modal ? "open-modal" : "close-modal"}`} style={{width: "100%", maxWidth: width ? `${width}px` : "400px"}}>
                <div className="content-modal">
                    {children}
                    <div className="footer">
                        {footer && footer}
                        {!footer && (
                            <>
                                <button className='back' onClick={() => onCancel()}>Não</button>
                                <button className='ok' onClick={() => onOk()}>Sim</button>
                            </>
                        )}
                    </div>
                    <div className="close" onClick={() => onCancel()}>
                        <AiOutlineClose />
                    </div>
                </div>
            </div>
        </>
    )
}