import { Select, Space, Dropdown, Menu, MenuProps } from "antd";
import { DocumentData } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

import { FilterOutlined } from '@ant-design/icons';

interface Props {
    dataRoom: RoomData | DocumentData | undefined
    setFilterBadge: Dispatch<SetStateAction<string>>
}

interface RoomData {
    isPrivate: boolean,
    password: string,
    categoria: [],
    badges: []
}

interface TodoItem {
    id?: string | null | number;
    text: string;
    completed: boolean;
    categoria?: string | [],
    badge?: {
        title: string,
        color: string
    } | null
}

interface ItemBadge {
    title: string,
    color: string
}

export const SelectFilterBadge = ({ dataRoom,  setFilterBadge}: Props) => {

    const onClick: MenuProps['onClick'] = ({ key }) => {
        setFilterBadge(key);
    };

    const items: MenuProps['items'] = [
        {
            label: 'Todos',
            key: 'all',
        },
        ...(dataRoom?.badges
            ? dataRoom?.badges.map((item: ItemBadge) => ({
                label: item.title,
                key: item.title,
            }))
            : []),
    ];

    return (
        <Dropdown
            className='select-filter'
            menu={{ items, onClick, selectable: true, defaultSelectedKeys: ["all"] }}
        >
            <p style={{ fontSize: "0.95rem", display: "flex", gap: "10px", cursor: "pointer", justifyContent: "flex-end"}}>Badge <FilterOutlined /></p>
        </Dropdown>
    )
}