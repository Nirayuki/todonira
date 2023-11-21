import React from 'react';
import '../style/layout.css';

type Props = {
    children: JSX.Element | JSX.Element[] | string | string[],
    hasChildren: boolean
}

export const Layout = ({ children, hasChildren }: Props) => {
    return (
        <>
            <div className={hasChildren ? "children" : undefined}>
                {children}
            </div>
        </>
    )
}