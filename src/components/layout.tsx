import React from 'react';
import '../style/layout.css';
import { FloatButton } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

type Props = {
    children: JSX.Element | JSX.Element[] | string | string[]
}

export const Layout = ({ children }: Props) => {
    return (
        <>
            <header>
                <div className="logo">Todo</div>
            </header>
            <div className='children'>
                {children}
            </div>
        </>
    )
}