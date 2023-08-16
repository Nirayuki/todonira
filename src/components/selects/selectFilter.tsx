import { Dropdown, MenuProps } from "antd";
import { DocumentData } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

import { FilterOutlined } from '@ant-design/icons';

interface Props {
    dataRoom: RoomData | DocumentData | undefined,
    setFilterCategoria: Dispatch<SetStateAction<string>>,
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



export const SelectFilter = ({ dataRoom, setFilterCategoria}: Props) => {

    const onClick: MenuProps['onClick'] = ({ key }) => {
        setFilterCategoria(key);
    };

    const items: MenuProps['items'] = [
        {
            key: "categoria",
            type: 'group',
            label: "Categoria",
            children: [
                {
                    label: 'Todos',
                    key: 'all',
                },
                ...(dataRoom?.categoria
                    ? dataRoom?.categoria.map((item: string) => ({
                        label: item,
                        key: item,
                    }))
                    : []),
            ]
        }
    ];

    return (
        <Dropdown
            className='select-filter'
            menu={{ items, onClick, selectable: true, defaultSelectedKeys: ["all"] }}
        >
            <p className="p-filter">Categorias <FilterOutlined /></p>
        </Dropdown>
    )
}