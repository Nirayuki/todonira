import React from 'react';
import { LayoutDetails } from '../style/layoutDetails';

type Props = {
    children: JSX.Element | JSX.Element[] | string | string[]
}

export const Layout = ({ children }: Props) => {
    return (
        <LayoutDetails>
            <header>
                <div className="logo">Todo</div>
            </header>
            <div className='children'>
                {children}
            </div>
        </LayoutDetails>
    )
}