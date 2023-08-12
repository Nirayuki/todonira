import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';

import '../style/cardHomeFancy.css';

export const CardHomeFancy = ({ handleOpen }) => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    return (
        <AnimatePresence>
            <motion.div
                className='cardHomeFancy'
                variants={{
                    hidden: { opacity: 0, y: -75 },
                    visible: { opacity: 1, y: 0 }
                }}
                initial="hidden"
                animate="visible"
                transition={{
                    durantion: 0.5,
                    delay: 0.25,

                }}
            >
                <div className="header-card">
                    <LeftCircleOutlined />
                    <div className="header-card-nav">
                        {width >= 379 ? (
                            <div className="nira">
                                <a href='https://nirayuki.netlify.app/' target='_blank'>@ Nirayuki</a>
                            </div>
                        ) : null}
                        <div className="line-balls">
                            <div className="ball" />
                            <div className="ball" />
                            <div className="ball" />
                        </div>
                    </div>
                    <RightCircleOutlined />
                </div>
                <div className="line" />
                <motion.div layout className="content-cardfancy">
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, x: -175 },
                            visible: { opacity: 1, x: 0 }
                        }}
                        initial="hidden"
                        animate="visible"
                        transition={{
                            durantion: 1,
                            delay: 0.45,

                        }}
                    >
                        <p className='title-cardfancy'>Todo Nira</p>
                    </motion.div>
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, x: 175 },
                            visible: { opacity: 1, x: 0 }
                        }}
                        initial="hidden"
                        animate="visible"
                        transition={{
                            durantion: 1,
                            delay: 0.45,

                        }}
                    >
                        <p className='subtitle-cardfancy'>Sua lista grátis e simples de afazeres</p>
                    </motion.div>
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, x: -175 },
                            visible: { opacity: 1, x: 0 }
                        }}
                        initial="hidden"
                        animate="visible"
                        transition={{
                            durantion: 1,
                            delay: 0.45,

                        }}
                    >
                        <button className='button-cardfancy' onClick={() => handleOpen()}>Criar uma sala</button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}